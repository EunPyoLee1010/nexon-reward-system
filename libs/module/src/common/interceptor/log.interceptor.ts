import { UserSession } from '@module/module/type/session.type';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as Rx from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class NexonHttpLogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<Request>();

        return next.handle().pipe(
            Rx.map((value) => {
                this.createLogMessage(req.session);
                return value;
            }),
        );
    }

    createLogMessage(session: UserSession) {
        const responseTime = new Date();
        const elapsedTime = responseTime.getTime() - session.requestTime.getTime();

        const req = session.req;
        const res = session.getRes();

        const resData = this.toString(res);

        const msgFormat = {
            userId: session.userId,
            elapsedTime: `${elapsedTime}ms`,
            method: req.method,
            url: req.originalUrl,
            query: this.toString(req.query),
            body: this.toString(req.body),
            res: resData.length > 10000 ? '' : resData,
        };

        const message = Object.entries(msgFormat)
            .filter(([k, v]) => v)
            .map(([k, v]) => `${k}=${v}`)
            .join(' ');

        Logger.verbose(message);
    }

    private toString(param: any) {
        if (typeof param === 'string') return param;
        if (typeof param === 'object') return JSON.stringify(param);
        if (typeof param === 'boolean') return param ? 'true' : 'false';

        try {
            return param.toString();
        } catch (e) {
            return undefined;
        }
    }
}
