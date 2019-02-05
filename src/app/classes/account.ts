import { Role } from './role';
import { User } from './user';

export class Account {
    accountId?: number;
    userId?: number;
    name: string;
    lastname: string;
    email: string;
    timezone?: string;
    roleId: number;
    user?: User;
    role?: Role;
}
