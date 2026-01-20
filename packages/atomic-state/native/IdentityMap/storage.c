#include "./identity_map.h"

static _Atomic uint32_t counter_identity_map = 0;
static HashIdentityTransactionController table[HASHMAP_SIZE];

uint32_t getStatus(uint32_t index){
    uint64_t status = atomic_load_explicit(&identity_hashed_map[index].status, memory_order_acquire);
}