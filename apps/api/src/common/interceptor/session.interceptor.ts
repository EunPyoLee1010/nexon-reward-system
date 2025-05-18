import { NexonConfigService } from '@module/module/core/config/config.service';
import { CacheService } from '@module/module/core/redis/redis.service';
import { NEXON_EXCEPTION_ERROR } from '@module/module/define/error.constant';
import { ResponseData } from '@module/module/type/session.type';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as Rx from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
    private readonly retryCount: number;
    private readonly retryInterval: number;
    constructor(private readonly config: NexonConfigService, private readonly cache: CacheService) {
        const { retry_count, retry_interval } = this.config.getConfig().getSessionInfo();
        this.retryCount = retry_count;
        this.retryInterval = retry_interval;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return Rx.from(this.handle(context, next));
    }

    async handle(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<Request>();
        const userId = req.session.userId;

        const lockKey = this.cache.getUserLockKey(userId);
        const userLockResult = await this.lock(lockKey);
        if (!userLockResult) {
            req.session.getRes().setError(NEXON_EXCEPTION_ERROR.USER_SESSION_ERROR);
            return req.session.getJsonData();
        }

        try {
            const response = next.handle().pipe(
                Rx.map((data) => {
                    if (data instanceof ResponseData) {
                        return data.getJsonData();
                    }

                    req.session.getRes().setError(NEXON_EXCEPTION_ERROR.getNexonErrorFromCode(HttpStatus.INTERNAL_SERVER_ERROR));
                    if (this.config.getConfig().isDevMode()) {
                        req.session.getRes().setError({ dev_msg: '서버 응답 값에 문제가 발생했습니다.' });
                    }
                    return req.session.getJsonData();
                }),
            );

            return await Rx.lastValueFrom(response);
        } catch (e) {
            Logger.error(e);
            const statusCode = e instanceof HttpException ? e.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
            req.session.getRes().setError(NEXON_EXCEPTION_ERROR.getNexonErrorFromCode(statusCode));

            if (this.config.getConfig().isDevMode()) {
                const message = (e as Error).message;
                req.session.getRes().setError({ dev_msg: message });
            }

            return req.session.getJsonData();
        } finally {
            await this.unlock(lockKey);
        }
    }

    async lock(lockKey: string) {
        for (let i = 0; i < this.retryCount; i++) {
            const result = await this.cache.nxset(lockKey, 1);
            if (result) return true;
            await this.sleep(this.retryInterval);
        }

        return false;
    }

    async unlock(lockKey: string) {
        await this.cache.del(lockKey);
    }

    async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
