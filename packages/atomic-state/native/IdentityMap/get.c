#include "./identity_map.h"

uint64_t link(const uint8_t *key, size_t length, uint64_t value, uint64_t id_transaction)
{
    uint64_t h = hash(key, length);
    uint32_t index = (uint32_t)(h & HASHMAP_MASK);
    uint32_t max_iterations = 1024;

    while (max_iterations--)
    {
        uint64_t slot_state = get_slot_state_with_comparing_hash(index, h);
        if (slot_state == SLOT_EQUALS) return &identity_hashed_map[index].staged_data;
        if (slot_state == SLOT_TIMEOUT) return ERR_TIMEOUT;
        if (slot_state == SLOT_USED) {
            index = (index + 1) & HASHMAP_MASK;
            continue;
        }

        if (slot_state == SLOT_AVAILABLE || slot_state == SLOT_DELETED) {
            bool statusExchanged = tryExchangeStatus(&identity_hashed_map[index].status, TX_FREE, TX_LOCKED);

            if (!statusExchanged)
            {
                mm_pause();
                max_iterations++;
                continue;
            }

            identity_hashed_map[index].staged_data.hash = h;
            identity_hashed_map[index].staged_data.value = value;

            forceStatus(&identity_hashed_map[index].status, TX_STAGED);

            add_action_to_transaction(id_transaction, PROVIDER_TRANSACTION_ID, sizeof(HashIdentityData), &identity_hashed_map[index].staged_data);

            return SUCCESS;
        }
        return ERR_UNKNOWN;

    }
    return ERR_MAX_ITERATION;
}