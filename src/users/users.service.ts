import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PasswordService } from 'src/auth/password.service';
import { databaseSchema } from 'src/database/database-schema';
import { DrizzleService } from 'src/database/drizzle.service';

@Injectable()
export class UsersService {
    constructor(
    private readonly drizzle: DrizzleService,
    private readonly passwordService: PasswordService,
    ) {}

    async getUserByEmail(email: string): Promise<any> {
        return this.drizzle.db.query.users.findFirst({
          where: eq(databaseSchema.users.email, email),
        });
      }

    async createUser(userDto: any): Promise<any> {
        const hashedPassword = await this.passwordService.hashPassword(userDto.password);
        const newUser = {
            ...userDto,
            password: hashedPassword,
        };
        return this.drizzle.db.insert(databaseSchema.users).values(newUser).returning();
    }
    
}
