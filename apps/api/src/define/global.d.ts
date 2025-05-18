import { UserSession } from '@module/module/type/session.type';

declare global {
    namespace Express {
        interface Request {
            session: UserSession;
        }
    }
}
