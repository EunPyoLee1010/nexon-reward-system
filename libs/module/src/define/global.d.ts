import { UserSession } from '../type/session.type';

declare global {
    namespace Express {
        interface Request {
            session: UserSession;
        }
    }
}
