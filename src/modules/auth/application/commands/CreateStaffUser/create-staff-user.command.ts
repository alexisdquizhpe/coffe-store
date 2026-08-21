export class CreateStaffUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly fullName: string,
    ) { }
}