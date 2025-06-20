import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateJobDto } from './create-job.dto';
import { jobs } from 'src/database/database-schema';
import { UpdateJobDto } from './update-job.dto';
import { DrizzleService } from 'src/database/drizzle.service';

@Injectable()
export class JobsService {
    constructor(
    private readonly drizzle: DrizzleService, // Replace with actual database service type
    ) {}
  async create(createJobDto: CreateJobDto, userId: string) {
    const [job] = await this.drizzle.db
      .insert(jobs)
      .values({
        ...createJobDto,
        createdBy: userId,
      })
      .returning();

    return job;
  }

  async findMyJobs(userId: string) {
    return this.drizzle.db.query.jobs.findMany({
      where: eq(jobs.createdBy, userId),
      orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
    });
  }

  async findOne(id: string) {
    const job = await this.drizzle.db.query.jobs.findFirst({
      where: eq(jobs.id, id),
    });

    if (!job) throw new NotFoundException('Job not found');

    return job;
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.findOne(id);

    if (job.createdBy !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    const [updated] = await this.drizzle.db
      .update(jobs)
      .set(dto)
      .where(eq(jobs.id, id))
      .returning();

    return updated;
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);

    if (job.createdBy !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    await this.drizzle.db.delete(jobs).where(eq(jobs.id, id));

    return { message: 'Job deleted successfully' };
  }
}
