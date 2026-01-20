typedef enum {
    SUCCESS           = 200,
    EXISTS            = 201,

    ALREADY_EXISTS    = 400,
    NOT_FOUND         = 404,

    ERR_FULL          = 503,
    ERR_CORRUPTED     = 504,
    ERR_TIMEOUT       = 505,
    ERR_MAX_ITERATION = 506,
    ERR_UNKNOWN       = 520
} ReturnCodes;