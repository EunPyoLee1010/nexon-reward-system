import { HttpStatus } from '@nestjs/common';

export class NexonError {
    readonly status_code: number;
    readonly name: string;
    readonly message: string;

    constructor(code: number, name: string, message: string) {
        this.status_code = code;
        this.name = name;
        this.message = message;
    }
}

export class NexonExceptionError {
    readonly NOT_FOUND_ERROR = new NexonError(404, 'Not Found', '찾을 수 없는 URL 입니다.');
    readonly BAD_REQUEST_ERROR = new NexonError(400, 'Bad Request', '잘못된 요청입니다.');
    readonly USER_SESSION_ERROR = new NexonError(400, 'User Session Error', '유저의 이전 세션 요청이 아직 끝나지 않았습니다.');
    readonly FOBBIDDEN_ERROR = new NexonError(403, 'Forbidden', '권한이 없습니다.');
    readonly INTERNAL_SERVER_ERROR = new NexonError(500, 'Server Error', '서버 내부 에러 발생');

    getNexonErrorFromCode(statusCode: HttpStatus) {
        switch (statusCode) {
            case HttpStatus.BAD_REQUEST:
                return this.BAD_REQUEST_ERROR;
            case HttpStatus.FORBIDDEN:
                return this.FOBBIDDEN_ERROR;
            case HttpStatus.NOT_FOUND:
                return this.NOT_FOUND_ERROR;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return this.INTERNAL_SERVER_ERROR;
        }
    }
}

export const NEXON_EXCEPTION_ERROR = new NexonExceptionError();
