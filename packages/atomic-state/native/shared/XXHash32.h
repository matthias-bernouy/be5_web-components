#ifndef XXHASH32_H
#define XXHASH32_H

#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>

uint32_t xxh32_fixed(const void* input, size_t len, uint32_t seed);

#endif