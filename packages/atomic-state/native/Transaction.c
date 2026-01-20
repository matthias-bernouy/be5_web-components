#include "headers/Transaction.h"

static _Atomic uint32_t global_handler_counter = 1;
static _Atomic uint32_t global_transaction_counter = 1;
static MapTransactionEntry transaction_map[MAX_TRANSACTIONS];
static MapHandlerEntry handler_map[TRANSACTION_MAX_HANDLER];

static bool tryChangeStatus(Transaction *tx, uint32_t expected, uint32_t desired)
{
    return atomic_compare_exchange_strong_explicit(
        &tx->status,
        &expected,
        desired,
        memory_order_acq_rel, // On garantit la visibilité des écritures précédentes
        memory_order_relaxed);
}

static bool isStatus(Transaction *tx, uint32_t status)
{
    return atomic_load_explicit(&tx->status, memory_order_acquire) == status;
}

uint32_t register_handler(uint32_t status, ActionHandler handler)
{
    uint32_t index = atomic_fetch_add_explicit(&global_handler_counter, 1, memory_order_acquire);
    if (index >= TRANSACTION_MAX_HANDLER)
    {
        return 0x00000000;
    }
    handler_map[index].perform = handler;
    return index;
}

Transaction* get_transaction(uint64_t transaction_id)
{
    MapTransactionEntry* map_entry = &transaction_map[transaction_id & (MAX_TRANSACTIONS - 1)];
    Transaction* transaction = &map_entry->ptr;
    if (transaction->transaction_id != transaction_id) return NULL;    
    return transaction;
}

uint64_t create_transaction()
{

    for (int i = 0; i < MAX_TRANSACTIONS; i++)
    {
        uint64_t index = atomic_fetch_add_explicit(&global_transaction_counter, 1, memory_order_relaxed);
        MapTransactionEntry *map_entry = &transaction_map[index & (MAX_TRANSACTIONS - 1)];
        Transaction *tx = &map_entry->ptr;
        if (tryChangeStatus(tx, TRANSACTION_STATUS_FREE_MASK, TRANSACTION_STATUS_STARTED_MASK))
        {
            tx->transaction_id = index;
            tx->timestamp = get_now_nanoseconds();
            return index;
        }
    }
    return 0;
}

bool add_action_to_transaction(uint64_t transaction_id, uint32_t action_provider, uint32_t size, void *data)
{
    Transaction *transaction = get_transaction(transaction_id);
    if (transaction == NULL)
        return false;
    if (!isStatus(transaction, TRANSACTION_STATUS_STARTED_MASK))
        return false;
    uint32_t action_index = atomic_fetch_add_explicit(&transaction->action_counter, 1, memory_order_acq_rel);
    
    if (action_index >= TRANSACTION_MAX_ACTIONS)
    {
        atomic_fetch_sub_explicit(&transaction->action_counter, 1, memory_order_acq_rel);
        return false;
    }
    transaction->actions[action_index].type = action_provider;
    transaction->actions[action_index].size = size;
    transaction->actions[action_index].data = data;
    return true;
}

bool write_transaction_to_disk(uint64_t transaction_id)
{
    MapTransactionEntry *map_entry = &transaction_map[transaction_id & (MAX_TRANSACTIONS - 1)];
    Transaction *transaction = get_transaction(transaction_id);
    if (transaction == NULL)
        return false;
    if (!isStatus(transaction, TRANSACTION_STATUS_COMMITED_MASK))
        return false;
    bool statusChanged = tryChangeStatus(transaction, TRANSACTION_STATUS_COMMITED_MASK, TRANSACTION_STATUS_WRITING_ON_DISK_STARTED_MASK);
    if (!statusChanged)
        return false;

    // Ici on écrirait la transaction sur le disque (simulation)

    reset_transaction(transaction);
    return true;
}

bool commit_transaction(uint64_t transaction_id)
{
    bool ok = lock_and_start_action(transaction_id, TRANSACTION_STATUS_COMMITED_MASK);
    if (!ok)
        return false;
    Transaction *tx = get_transaction(transaction_id);
    if (tx == NULL)
        return false;
    uint64_t hash = 0;
    for (uint32_t i = 0; i < tx->action_counter; i++)
    {
        hash = xxh32_fixed(tx->actions[i].data, tx->actions[i].size, (uint32_t)hash);
    }
    tx->checksum = hash;
    return true;
}

bool abort_transaction(uint64_t transaction_id)
{
    bool ok = lock_and_start_action(transaction_id, TRANSACTION_STATUS_ABORTED_MASK);
    if (!ok)
        return false;
    reset_transaction(get_transaction(transaction_id));
    return true;
}

static void reset_transaction(Transaction *transaction)
{
    transaction->transaction_id = 0;
    transaction->timestamp = 0;
    transaction->checksum = 0;
    atomic_store_explicit(&transaction->action_counter, 0, memory_order_release);
    atomic_store_explicit(&transaction->status, TRANSACTION_STATUS_FREE_MASK, memory_order_release);
}

static bool lock_and_start_action(uint64_t transaction_id, uint32_t final_status)
{
    MapTransactionEntry *map_entry = &transaction_map[transaction_id & (MAX_TRANSACTIONS - 1)];
    Transaction *transaction = get_transaction(transaction_id);
    if (transaction == NULL)
        return false;

    if (!tryChangeStatus(transaction, TRANSACTION_STATUS_STARTED_MASK, TRANSACTION_STATUS_LOCKED_MASK))
    {
        return false;
    }

    uint32_t ask_phase = (final_status == TRANSACTION_STATUS_COMMITED_MASK)
                             ? TRANSACTION_HANDLER_ASK_TO_COMMIT_MASK
                             : TRANSACTION_HANDLER_ASK_TO_ABORTED_MASK;

    for (uint32_t i = 0; i < transaction->action_counter; i++)
    {
        uint32_t action_type = transaction->actions[i].type;
        if (action_type > 0 && action_type < TRANSACTION_MAX_HANDLER)
        {
            ActionHandler h = handler_map[action_type].perform;
            if (h)
                h(&transaction->actions[i], ask_phase);
        }
    }

    if (!tryChangeStatus(transaction, TRANSACTION_STATUS_LOCKED_MASK, final_status))
    {
        return false;
    }

    for (uint32_t i = 0; i < transaction->action_counter; i++)
    {
        uint32_t action_type = transaction->actions[i].type;
        if (action_type > 0 && action_type < TRANSACTION_MAX_HANDLER)
        {
            ActionHandler h = handler_map[action_type].perform;
            if (h)
                h(&transaction->actions[i], TRANSACTION_HANDLER_ASK_TO_RELEASE_MASK);
        }
    }

    return true;
}