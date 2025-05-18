import { Request, Response } from 'express';

export class ResponseData {
    private server: any = {};
    private content: any = {};
    private resource: any = {};
    private error: any = {};

    constructor() {
        this.server.time = new Date();
    }

    setEndpoint(path: string) {
        this.server.path = path;
        return this;
    }

    getContent<T>() {
        return this.content as T;
    }

    setContent(data: any) {
        this.content = { ...data };
        return this;
    }

    getError() {
        return this.error;
    }

    setError(error: any) {
        this.error = { ...(this.error ?? {}), ...error };
        return this;
    }

    getJsonData() {
        return { server: this.server, content: this.content, resource: this.resource, error: this.error };
    }
}

export class UserSession {
    userId: string;
    userInfo: any;
    requestTime: Date;
    res_data: ResponseData;

    constructor(readonly req: Request, readonly res: Response) {
        this.requestTime = new Date();
        this.res_data = new ResponseData();
    }

    static create(req: Request, res: Response) {
        const session = new UserSession(req, res);
        req.session = session;
        return session;
    }

    static get(req: Request) {
        return req.session;
    }

    getRes() {
        return this.res_data;
    }

    getJsonData() {
        return this.res_data.getJsonData();
    }
}
