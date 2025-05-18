export const SIGNIN_MSG_PATTERN = {
    type: 'auth',
    cmd: 'sign-in',
} as const;

export const SIGNUP_MSG_PATTERN = {
    type: 'auth',
    cmd: 'sign-up',
} as const;

export const VIEW_EVENT_MSG_PATTERN = {
    type: 'event',
    cmd: 'select',
} as const;

export const CREATE_EVENT_MSG_PATTERN = {
    type: 'event',
    cmd: 'create',
};

export const VIEW_REWARD_MSG_PATTERN = {
    type: 'reward',
    cmd: 'select',
};

export const CREATE_REWARD_MSG_PATTERN = {
    type: 'reward',
    cmd: 'create',
};

export const REQUEST_REWARD_MSG_PATTERN = {
    type: 'reward',
    cmd: 'request',
};

export const VIEW_REQUEST_REWARD_LOG_MSG_PATTERN = {
    type: 'request-reward-log',
    cmd: 'select',
};
