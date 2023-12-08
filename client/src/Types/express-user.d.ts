import { PopulatedUser } from './User';

declare global {
    namespace Express {
        interface User extends PopulatedUser {}
    }
}
