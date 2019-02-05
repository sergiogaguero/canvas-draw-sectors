import { Language } from './language';

export class User {
    userId: number;
    tenantId: number;
    email: string;
    language?: Language;
    langId?: number;
    emailVerified: boolean;
}
