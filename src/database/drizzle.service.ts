import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import { CONNECTION_POOL } from './database.module-definition';
import { databaseSchema } from './database-schema';

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof databaseSchema>;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.db = drizzle(this.pool, { schema: databaseSchema });
  }
}
