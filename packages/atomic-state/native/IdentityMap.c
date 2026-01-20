#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <stdatomic.h>
#include <string.h>
#include <immintrin.h>
#include <stdatomic.h>

#include "headers/Transaction.h"

#define HASHMAP_SIZE_SHIFT 24 // 16 642 177 entries
#define HASHMAP_SIZE       (1 << HASHMAP_SIZE_SHIFT)
#define HASHMAP_MASK       (HASHMAP_SIZE - 1)

#define STATUS_EMPTY    0
#define STATUS_OCCUPIED 1
#define STATUS_BUSY     2
#define STATUS_DELETED  3

typedef struct {
    _Atomic uint32_t status; // Use TRANSACTION_STATUS masks
    uint32_t _pad;
    uint64_t hash;  // based on the key
    _Atomic uint64_t value; // identifier associated
} HashEntry;

// Data
static _Atomic uint32_t counter = 0;
static HashEntry table[HASHMAP_SIZE];

// Functions
static inline uint64_t hash(const uint8_t* key, size_t length) {
    register uint64_t h = 0xcbf29ce484222325ULL;
    for (size_t i = 0; i < length; i++) {
        h ^= (uint64_t)key[i];
        h *= 0x100000001b3ULL;
    }
    return h;
}

bool link(const uint8_t* key, size_t length, uint64_t value) {
    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t start_index = index;

    while (1) {
        uint32_t s = atomic_load_explicit(&table[index].status, memory_order_acquire);

        if (s == STATUS_BUSY) {
            _mm_pause();
            continue;
        }

        if (s == STATUS_EMPTY || s == STATUS_DELETED) {
            uint32_t expected = s;
            if (atomic_compare_exchange_strong(&table[index].status, &expected, STATUS_BUSY)) {
                table[index].hash = h;
                atomic_store_explicit(&table[index].value, value, memory_order_relaxed);
                atomic_store_explicit(&table[index].status, STATUS_OCCUPIED, memory_order_release);
                atomic_fetch_add_explicit(&counter, 1, memory_order_relaxed);
                return true;
            }
            continue;
        }

        if (s == STATUS_OCCUPIED) {
            if (table[index].hash == h) {
                atomic_store_explicit(&table[index].value, value, memory_order_relaxed);
                return true;
            }
        }

        index = (index + 1) & HASHMAP_MASK;
        if (index == start_index) return false;
    }
}

bool exists(const uint8_t* key, size_t length) {
    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t start_index = index;

    while (1) {
        uint32_t s = atomic_load_explicit(&table[index].status, memory_order_acquire);
        if (s == STATUS_EMPTY) return false;
        if (s == STATUS_OCCUPIED) {
            if (table[index].hash == h) {
                return true;
            }
        }
        index = (index + 1) & HASHMAP_MASK;
        if (index == start_index) break;
    }
    return false;
}

uint64_t get(const uint8_t* key, size_t length) {
    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t start_index = index;

    while (1) {
        uint32_t s = atomic_load_explicit(&table[index].status, memory_order_acquire);
        if (s == STATUS_EMPTY) return (uint64_t)(-1);
        if (s == STATUS_OCCUPIED) {
            if (table[index].hash == h) {
                return atomic_load_explicit(&table[index].value, memory_order_relaxed);
            }
        }
        index = (index + 1) & HASHMAP_MASK;
        if (index == start_index) break;
    }
    return (uint64_t)(-1);
}

bool unlink(const uint8_t* key, size_t length) {
    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t start_index = index;

    while (1) {
        uint32_t s = atomic_load_explicit(&table[index].status, memory_order_acquire);
        if (s == STATUS_EMPTY) return false;

        if (s == STATUS_OCCUPIED && table[index].hash == h) {
            uint32_t expected = STATUS_OCCUPIED;
            if (atomic_compare_exchange_strong(&table[index].status, &expected, STATUS_BUSY)) {
                atomic_store_explicit(&table[index].value, 0, memory_order_relaxed);
                atomic_store_explicit(&table[index].status, STATUS_DELETED, memory_order_release);
                atomic_fetch_sub_explicit(&counter, 1, memory_order_relaxed);
                return true;
            }
            continue;
        }

        index = (index + 1) & HASHMAP_MASK;
        if (index == start_index) break;
    }
    return false;
}

uint32_t count(){
    return atomic_load_explicit(&counter, memory_order_relaxed);
}