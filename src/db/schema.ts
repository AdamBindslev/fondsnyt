import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Foundations / Organizations
export const foundations = sqliteTable('foundations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  cvr: text('cvr'),
  websiteUrl: text('website_url').notNull(),
  type: text('type').default('Private Fond'), // 'Private Fond', 'Offentlig Pulje', 'EU Program', 'Erhvervsdrivende Fond'
  description: text('description'),
  logoUrl: text('logo_url'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Grants / Calls / Puljer
export const grants = sqliteTable('grants', {
  id: text('id').primaryKey(),
  foundationId: text('foundation_id').references(() => foundations.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  categories: text('categories', { mode: 'json' }).$type<string[]>().notNull(), // e.g. ["Kultur", "Scenekunst", "Musik"]
  targetGroups: text('target_groups', { mode: 'json' }).$type<string[]>().notNull(), // e.g. ["Foreninger", "Kunstnere", "NGOer"]
  minAmount: real('min_amount'),
  maxAmount: real('max_amount'),
  currency: text('currency').default('DKK').notNull(),
  region: text('region').default('Danmark').notNull(), // 'Danmark', 'EU', 'Nordisk', etc.
  sourceUrl: text('source_url').notNull(),
  applicationUrl: text('application_url'),
  successRateEst: text('success_rate_est'), // e.g. "Middel (ca. 25%)"
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Grant Deadlines
export const grantDeadlines = sqliteTable('grant_deadlines', {
  id: text('id').primaryKey(),
  grantId: text('grant_id').references(() => grants.id, { onDelete: 'cascade' }).notNull(),
  deadlineDate: text('deadline_date'), // ISO date string: YYYY-MM-DD
  isOngoing: integer('is_ongoing', { mode: 'boolean' }).default(false).notNull(),
  notes: text('notes'),
  quarter: text('quarter'), // e.g. "Q1", "Q2", etc.
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Monitored Web Sources (Scraping & Diff-detection)
export const monitoredSources = sqliteTable('monitored_sources', {
  id: text('id').primaryKey(),
  foundationId: text('foundation_id').references(() => foundations.id, { onDelete: 'cascade' }).notNull(),
  sourceType: text('source_type').notNull(), // 'API', 'RSS', 'HTML_DIFF'
  targetUrl: text('target_url').notNull(),
  contentSelector: text('content_selector'),
  lastContentHash: text('last_content_hash'),
  lastCheckedAt: text('last_checked_at'),
  lastStatus: text('last_status').default('OK'), // 'OK', 'CHANGED', 'ERROR'
  status: text('status').default('ACTIVE').notNull(),
  detectedChangesSummary: text('detected_changes_summary'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Fundraising Application Pipeline (Kanban / Workflow tracker)
export const fundraisingPipeline = sqliteTable('fundraising_pipeline', {
  id: text('id').primaryKey(),
  grantId: text('grant_id').references(() => grants.id, { onDelete: 'cascade' }).notNull(),
  projectTitle: text('project_title').notNull(),
  status: text('status').notNull(), // 'idea' | 'writing' | 'submitted' | 'granted' | 'rejected'
  notes: text('notes'),
  requestedAmount: real('requested_amount'),
  customDeadline: text('custom_deadline'),
  submissionDate: text('submission_date'),
  decisionDate: text('decision_date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
