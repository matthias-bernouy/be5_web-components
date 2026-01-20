#ifndef TRANSACTION_SYSTEM_H
#define TRANSACTION_SYSTEM_H

#include <stdint.h>
#include <stddef.h>
#include <stdatomic.h>
#include <stdbool.h>

#include "../shared/XXHash32.h"
#include "../shared/Time.h"

// CONSTANTS
#define MAX_TRANSACTIONS (1 << 16)
#define TRANSACTION_MODULO_MASK (MAX_TRANSACTIONS - 1)
#define TRANSACTION_TIMEOUT_NS (5ULL * 60ULL * 1000000000ULL)

#define TRANSACTION_MAX_ACTIONS (1 << 7)

#define TRANSACTION_MAX_HANDLER (1 << 8)

#define TRANSACTION_STATUS_STARTED_MASK (1 << 1)
#define TRANSACTION_STATUS_LOCKED_MASK (1 << 2)
#define TRANSACTION_STATUS_COMMITED_MASK (1 << 3)
#define TRANSACTION_STATUS_ABORTED_MASK (1 << 4)
#define TRANSACTION_STATUS_WRITING_ON_DISK_STARTED_MASK (1 << 5)
#define TRANSACTION_STATUS_FREE_MASK (1 << 6)

#define TRANSACTION_HANDLER_ASK_TO_COMMIT_MASK (1 << 1)
#define TRANSACTION_HANDLER_ASK_TO_ABORTED_MASK (1 << 2)
#define TRANSACTION_HANDLER_ASK_TO_RELEASE_MASK (1 << 3)

#define TX_FREE ( 1 << 1 )
#define TX_LOCKED (1 << 2)
#define TX_STAGED (1 << 3) // Data prepared to be committed
#define TX_ABORTED ( 1 << 4)
#define TX_COMMITED ( 1 << 5 )
#define TX_PERSISTED ( 1 << 6 )


// STRUCTURES
typedef struct
{
    uint32_t type; 
    uint32_t size;
    void *data;
} PayloadTransaction;

typedef struct
{
    uint64_t transaction_id;
    _Atomic uint32_t status;
    uint64_t timestamp;

    _Atomic uint32_t action_counter;
    uint32_t checksum;               
    PayloadTransaction actions[TRANSACTION_MAX_ACTIONS]; 
} Transaction;

typedef struct
{
    uint64_t transaction_id;
    uint32_t _padding;
    Transaction ptr;
} MapTransactionEntry;

typedef struct
{
    ActionHandler* perform;
} MapHandlerEntry;


// FUNCTIONS DEFINITIONS
typedef struct PayloadTransaction; 
typedef void (*ActionHandler)(struct PayloadTransaction* payload, uint32_t tx_status);
uint64_t create_transaction();
void add_action_to_transaction(uint64_t transaction_id, uint32_t action_type, uint32_t size, void *data);
void commit_transaction(uint64_t transaction_id);
void abort_transaction(uint64_t transaction_id);
void restore_transaction(uint64_t transaction_id, uint32_t action_type, uint32_t size, void *data);



#endif