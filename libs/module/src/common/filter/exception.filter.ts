import { NexonConfig } from '@module/module/core/config/config.service';
import { NEXON_EXCEPTION_ERROR } from '@module/module/define/error.constant';
import { UserSession } from '@module/module/type/session.type';
import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

export class NexonExceptionFilter implements ExceptionFilter {
    constructor(private readonly config: NexonConfig) {}

    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const req = context.getRequest<Request>();
        const res = context.getResponse<Response>();

        const response = req.session.getRes();
        const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        response.setError(NEXON_EXCEPTION_ERROR.getNexonErrorFromCode(statusCode));

        if (this.config.isDevMode()) {
            response.setError({ dev_msg: exception.message });
        }

        Logger.error(`${exception.message}\n${exception.stack}`);
        this.createLogMessage(req.session);

        return res.json(response.getJsonData());
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
