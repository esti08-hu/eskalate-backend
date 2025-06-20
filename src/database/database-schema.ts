import {
    pgTable,
    uuid,
    text,
    timestamp,
    varchar,
  } from 'drizzle-orm/pg-core';
  
  
  export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique(),
    password: varchar('password', { length: 255 }),
    role: varchar('role'),
  });
  
  export const jobs = pgTable('jobs', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }),
    description: text('description'),
    location: varchar('location', { length: 255 }),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
  });
  
  export const applications = pgTable('applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    applicantId: uuid('applicant_id').references(() => users.id),
    jobId: uuid('job_id').references(() => jobs.id),
    resumeLink: varchar('resume_link', { length: 1024 }),
    coverLetter: varchar('cover_letter', { length: 200 }),
    status: varchar('status').default('Applied'),
    appliedAt: timestamp('applied_at').defaultNow(),
  });
  
export const databaseSchema = {
  users,
  jobs,
  applications,
};