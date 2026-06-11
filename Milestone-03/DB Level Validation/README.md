# FocusForge DB Validation

## Project Overview

FocusForge DB Validation is a PostgreSQL schema exercise for a productivity app with `users`, `projects`, and `tasks` tables. The goal was to harden the database so it only accepts valid, consistent records.

## Problem Solved

The original schema allowed incomplete rows, duplicate user emails, invalid task priorities, and tasks that referenced projects that did not exist. These issues were fixed by moving validation into the database layer.

## Constraints Implemented

- `NOT NULL` on `users.name`, `users.email`, `projects.project_name`, and `tasks.title`
- `UNIQUE` on `users.email`
- `CHECK` on `tasks.priority` to enforce values between 1 and 5
- `FOREIGN KEY` on `tasks.project_id` referencing `projects.id`

## How to Run

Run the scripts from `psql` in this order:

```sql
\i schema/schema.sql
\i schema/sample_data.sql
\i schema/invalid_data.sql
```

## Results

Valid sample data is accepted. Invalid rows are rejected by PostgreSQL with constraint violations for missing required values, duplicate emails, invalid priorities, and orphan tasks.
