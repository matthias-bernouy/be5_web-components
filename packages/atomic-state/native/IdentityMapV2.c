#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <stdatomic.h>
#include <string.h>
#include <immintrin.h>
#include <stdatomic.h>

#include "headers/Transaction.h"

#define PROVIDER_TRANSACTION_ID 1

#define HASHMAP_SIZE_SHIFT 24 // 16 642 177 entries
#define HASHMAP_SIZE (1 << HASHMAP_SIZE_SHIFT)
#define HASHMAP_MASK (HASHMAP_SIZE - 1)

typedef struct
{
    uint64_t hash;  // based on the key
    uint64_t value; // identifier associated
} HashEntryData;

typedef struct
{
    _Atomic uint32_t status;
    uint32_t _pad;
    HashEntryData persistent_data;
    HashEntryData staged_data;
} HashEntryTransactionController;

// Data
static _Atomic uint32_t counter_elements = 0;
static HashEntryTransactionController table[HASHMAP_SIZE];

static bool tryExchangeStatus(uint32_t *status_ptr, uint32_t expected, uint32_t desired)
{
    return atomic_compare_exchange_strong_explicit(status_ptr, &expected, desired, memory_order_acq_rel, memory_order_relaxed);
}

static bool isStatus(uint32_t *status_ptr, uint32_t status)
{
    return atomic_load_explicit(status_ptr, memory_order_acquire) == status;
}

static void forceStatus(_Atomic uint32_t *status_ptr, uint32_t desired)
{
    atomic_store_explicit(status_ptr, desired, memory_order_release);
}

bool link(const uint8_t *key, size_t length, uint64_t value, uint64_t id_transaction)
{

    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t max_iterations = HASHMAP_SIZE;

    while (max_iterations--)
    {
        if (!isStatus(&table[index].status, TX_FREE))
        {
            if (isStatus(&table[index].status, TX_STAGED))
            {
                uint64_t timestamp = get_now_nanoseconds();
                while (isStatus(&table[index].status, TX_STAGED))
                {
                    if (get_now_nanoseconds() - timestamp > 1000000ULL)
                        break;
                    _mm_pause();
                }
            }
            if (table[index].persistent_data.hash == h ||
                (isStatus(&table[index].status, TX_STAGED) && table[index].staged_data.hash == h))
            {
                return false;
            }
            index = (index + 1) & HASHMAP_MASK;
            continue;
        }
        bool statusExchanged = tryExchangeStatus(&table[index].status, TX_FREE, TX_LOCKED);

        if (!statusExchanged)
        {
            index = (index + 1) & HASHMAP_MASK;
            continue;
        }

        table[index].staged_data.hash = h;
        table[index].staged_data.value = value;

        forceStatus(&table[index].status, TX_STAGED);

        add_action_to_transaction(id_transaction, PROVIDER_TRANSACTION_ID, sizeof(HashEntryData), &table[index].staged_data);

        atomic_fetch_add_explicit(&counter_elements, 1, memory_order_relaxed);

        return true;
    }
    return false;
}