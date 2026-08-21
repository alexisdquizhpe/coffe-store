import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { AdminUser } from "src/modules/auth/domain/entities/admin-user.entity";
import { ADMIN_USER_REPOSITORY, IAdminUserRepository } from "src/modules/auth/domain/repositories/admin-user.repository.interface";
import { IPasswordHasher, PASSWORD_HASHER } from "src/modules/auth/domain/services/password-hasher.interface";

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userReposotory = app.get<IAdminUserRepository>(ADMIN_USER_REPOSITORY);
    const passwordHasher = app.get<IPasswordHasher>(PASSWORD_HASHER);

    const email = process.env.SEED_OWNER_EMAIL;
    const password = process.env.SEED_OWNER_PASSWORD;
    const fullName = process.env.SEED_OWNER_NAME ?? 'Endminstrator';

    if (!email || !password) {
        console.log('Error: Please provide SEED_OWNER_EMAIL, SEED_OWNER_PASSWORD and SEED_OWNER_NAME in .env file');
        await app.close();
        process.exit(1);
    }

    const existing = await userReposotory.findByEmail(email);
    if (existing) {
        console.log('User already exists');
        await app.close();
        process.exit(0);
    }

    const hashedPassword = await passwordHasher.hash(password);

    const user = AdminUser.create(email, hashedPassword, fullName, 'OWNER');

    await userReposotory.save(user);

    console.log('Seed complete: Owner user created');
    await app.close();
}

seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});