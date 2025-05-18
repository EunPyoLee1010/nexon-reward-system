import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { existsSync, readFileSync } from 'fs';
import { CONFIG_MODE_TUPLE, TConfigDatabaseConnection, TConfigModeType, TConfigSession } from './config.type';

@Injectable()
export class NexonConfigService {
    private _config: NexonConfig;

    getConfig() {
        return this._config;
    }

    constructor() {
        if (!this.isValidMode(process.env.mode)) {
            Logger.error('[NexonConfigService] Error: Invalid mode');
            process.exit(1);
        }

        const configFilePath = this.getConfigFilePath(process.env.mode);
        this.load(configFilePath).catch((e) => Logger.error(e));
    }

    private getConfigFilePath(mode: TConfigModeType) {
        const filePathParsed = ['config', `${mode}.config.json`];

        while (!existsSync(filePathParsed.join('/'))) {
            filePathParsed.unshift('..');

            if (filePathParsed.length > 5) {
                break;
            }
        }

        const configFilePath = filePathParsed.join('/');
        return existsSync(configFilePath) ? configFilePath : undefined;
    }

    private isValidMode(mode: string): mode is TConfigModeType {
        return CONFIG_MODE_TUPLE.includes(mode as TConfigModeType);
    }

    private async load(configFilePath: string) {
        if (configFilePath === undefined) {
            Logger.error('[NexonConfigService] Error: Invalid config File Path');
            process.exit(1);
        }

        const configJson = JSON.parse(readFileSync(configFilePath).toString());
        const dgConfigIns = plainToInstance(NexonConfig, configJson);

        this._config = dgConfigIns;
        this._config.serviceName = process.env.service;
    }
}

export class NexonConfig {
    mode: TConfigModeType;
    serviceName = 'Server Name';
    server: Record<string, { host: string; port: number }> = {
        api: { host: '', port: 3000 },
        auth: { host: '', port: 4000 },
        event: { host: '', port: 5000 },
    };
    session: TConfigSession = {
        retry_count: 5,
        retry_interval: 1000,
    };
    database: Record<string, { global: TConfigDatabaseConnection; user: TConfigDatabaseConnection[] }> = {
        mongo: {
            global: { ip: '', port: 27017, user: '', passwd: '', db_name: '' },
            user: [],
        },
        redis: {
            global: { ip: '', port: 6379, user: '', passwd: '', db_name: '' },
            user: [],
        },
    };
    setting: Record<string, any> = {
        auth: {
            jwt_secret: '',
            expires_in: '',
            refresh_secret: '',
            refresh_expires_in: '',
            issuer: '',
        },
    };

    getSessionInfo(): { retry_count: number; retry_interval: number } {
        return this.session;
    }

    getJwtConfig(): {
        jwt_secret: string;
        expires_in: string;
        refresh_secret: string;
        refresh_expires_in: string;
        issuer: string;
    } {
        return this.setting.auth;
    }

    getRedisConfig(): {
        global: TConfigDatabaseConnection;
        user: TConfigDatabaseConnection[];
    } {
        return this.database.redis;
    }

    getMongoConfig(): {
        global: TConfigDatabaseConnection;
        user: TConfigDatabaseConnection[];
    } {
        return this.database.mongo;
    }

    getStoreConfig(): {
        callback_no: string;
        user_id: string;
        api_auth_code: string;
        api_auth_token: string;
    } {
        return this.setting.secret.giftishow;
    }

    getWebHookConfig(): {
        slack: {
            global: string;
            system: string;
            action: string;
            reward: string;
            purchase: string;
        };
    } {
        return this.setting.web_hook;
    }

    getServerConfig() {
        return this.server[this.getServerName()];
    }

    getServerInfo(exceptSelf = false) {
        if (exceptSelf) {
            return { ...this.server, [this.getServerName()]: undefined };
        }
        return { ...this.server };
    }

    getMode() {
        return this.mode;
    }

    isDevMode() {
        return this.getMode() === 'dev';
    }

    isProdMode() {
        return this.getMode() === 'prod';
    }

    getServerName() {
        return this.serviceName;
    }
}
