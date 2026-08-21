import { randomUUID } from "crypto";
import { InvalidEmailException } from "../execptions/auth.exceptions";

export type AdminRole = 'OWNER' | 'STAFF';

export interface AdminUserProps {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: AdminRole;
    isActive: boolean;
}

export class AdminUser {

    private constructor(private props: AdminUserProps) { }

    static create(email: string, passwordHash: string, fullName: string, role: AdminRole): AdminUser {
        if (!this.validateEmail(email)) throw new InvalidEmailException(email);

        return new AdminUser({
            id: randomUUID(),
            email: email.toLocaleLowerCase().trim(),
            passwordHash,
            fullName,
            role,
            isActive: true
        });
    }

    static fromPersistence(props: AdminUserProps): AdminUser {
        return new AdminUser(props);
    }

    get id(): string {
        return this.props.id;
    }

    get email(): string {
        return this.props.email;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get fullName(): string {
        return this.props.fullName;
    }

    get role(): AdminRole {
        return this.props.role;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    changeEmail(email: string) {
        if (!AdminUser.validateEmail(email)) throw new InvalidEmailException(email);
        this.props.email = email.toLocaleLowerCase().trim();
    }

    changePassword(passwordHash: string) {
        this.props.passwordHash = passwordHash;
    }

    changeRole(role: AdminRole) {
        this.props.role = role;
    }

    changeActive(isActive: boolean) {
        this.props.isActive = isActive;
    }

    private static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

}

