import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { CreateApplicationDto } from './create-application.dto';
import { applications, jobs, users } from 'src/database/database-schema';
import { DrizzleService } from 'src/database/drizzle.service';
import { and, eq, count } from 'drizzle-orm';
import { UpdateStatusDto } from './update-status.dto';
import { uploadPdfToCloudinary } from '../utils/cloudinary';
  @Injectable()
  export class ApplicationsService {
    constructor(
      private readonly drizzle: DrizzleService, // Replace with actual database service type
    ) {}
    async applyToJob(dto: CreateApplicationDto, file: Express.Multer.File, userId: string) {
      if (!file) {
        throw new BadRequestException('Resume file is required');
      }
  
      // Check duplicate
      const existing = await this.drizzle.db.query.applications.findFirst({
        where: and(eq(applications.jobId, dto.jobId), eq(applications.applicantId, userId)),
      });
      if (existing) {
        throw new BadRequestException('You already applied to this job');
      }
  
      // Upload resume
      const resumeUrl = await uploadPdfToCloudinary(file);
  
      const [application] = await this.drizzle.db.insert(applications).values({
        jobId: dto.jobId,
        applicantId: userId,
        resumeLink: resumeUrl,
        coverLetter: dto.coverLetter || '',
      }).returning();
  
      return application;
    }
  
    async getMyApplications(userId: string, page: number, limit: number) {
      const offset = (page - 1) * limit;
  
      const result = await this.drizzle.db
        .select({
          jobTitle: jobs.title,
          companyName: users.name,
          status: applications.status,
          appliedAt: applications.appliedAt,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(users, eq(jobs.createdBy, users.id))
        .where(eq(applications.applicantId, userId))
        .limit(limit)
        .offset(offset);
  
      const total = await this.drizzle.db
        .select({ count: count() })
        .from(applications)
        .where(eq(applications.applicantId, userId));
  
      return {
        success: true,
        message: 'Applications fetched successfully',
        object: result,
        pageNumber: page,
        pageSize: limit,
        totalSize: total[0].count,
        errors: null,
      };
    }
  
    async getApplicationsForJob(jobId: string, companyId: string, page: number, limit: number) {
      const job = await this.drizzle.db.query.jobs.findFirst({
        where: eq(jobs.id, jobId),
      });
  
      if (!job || job.createdBy !== companyId) {
        throw new ForbiddenException('Unauthorized access');
      }
  
      const offset = (page - 1) * limit;
  
      const result = await this.drizzle.db
        .select({
          applicantName: users.name,
          resumeLink: applications.resumeLink,
          coverLetter: applications.coverLetter,
          status: applications.status,
          appliedAt: applications.appliedAt,
        })
        .from(applications)
        .innerJoin(users, eq(applications.applicantId, users.id))
        .where(eq(applications.jobId, jobId))
        .limit(limit)
        .offset(offset);
  
      const total = await this.drizzle.db
        .select({ count: count() })
        .from(applications)
        .where(eq(applications.jobId, jobId));
  
      return {
        success: true,
        message: 'Applicants fetched successfully',
        object: result,
        pageNumber: page,
        pageSize: limit,
        totalSize: total[0].count,
        errors: null,
      };
    }
  
    async updateApplicationStatus(dto: UpdateStatusDto, companyId: string) {
      const app = await this.drizzle.db.query.applications.findFirst({
        where: eq(applications.id, dto.applicationId),
      });
  
      if (!app) throw new NotFoundException('Application not found');
  
      if (!app.jobId) throw new NotFoundException('Application jobId is null');
  
      const job = await this.drizzle.db.query.jobs.findFirst({
        where: eq(jobs.id, app.jobId),
      });
  
      if (!job || job.createdBy !== companyId) {
        throw new ForbiddenException('Unauthorized');
      }
  
      const [updated] = await this.drizzle.db
        .update(applications)
        .set({ status: dto.status })
        .where(eq(applications.id, dto.applicationId))
        .returning();
  
      return updated;
    }
  }
  