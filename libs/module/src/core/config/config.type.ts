export const CONFIG_MODE_TUPLE = ['local', 'dev', 'prod'] as const;
export type TConfigModeType = (typeof CONFIG_MODE_TUPLE)[number];

export type TConfigSession = { retry_count: number; retry_interval: number };
export type TConfigDatabaseConnection = {
    ip: string;
    port: number;
    db_name: string;
    user?: string;
    passwd?: string;
    shard?: number;
    use_tls?: boolean;
    min_pool_size?: number;
    max_pool_size?: number;
};
