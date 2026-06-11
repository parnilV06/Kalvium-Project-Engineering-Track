# Observations

## 1. Problems in Original Schema

The original FocusForge schema for `users`, `projects`, and `tasks` had no integrity constraints beyond basic table definitions. As a result, the database allowed incomplete records, duplicate user emails, invalid task priorities, and tasks linked to projects that did not exist. This made the data vulnerable to inconsistency and unreliable application behavior.

## 2. Constraints Added (with Explanation)

- `NOT NULL` on `users.name`, `users.email`, `projects.project_name`, and `tasks.title` to ensure required fields are always present.
- `UNIQUE` on `users.email` to prevent duplicate accounts using the same email address.
- `CHECK` on `tasks.priority` to restrict values to the valid range of 1 to 5.
- `FOREIGN KEY` on `tasks.project_id` referencing `projects.id` to guarantee that every task belongs to an existing project.

## 3. Results After Fix (What Is Rejected vs Accepted)

After the constraints were added, valid rows from the sample data are accepted, while invalid rows are rejected by PostgreSQL. Rows with missing required values fail `NOT NULL` checks, repeated emails fail the `UNIQUE` constraint, invalid priority values fail the `CHECK` constraint, and tasks pointing to non-existent projects fail the foreign key constraint.

## 4. Key Learnings

Database constraints are the first line of defense for data quality. Enforcing integrity at the schema level prevents bad data from entering the system, reduces application-side validation errors, and keeps relationships between tables consistent over time.
