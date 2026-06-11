-- 1. Check performance with the original, broken index
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
AND salary > 50000;

-- 2. Drop the ineffective index
DROP INDEX IF EXISTS idx_salary_department;

-- 3. Create the corrected index (Equality condition first, then Range condition)
CREATE INDEX idx_department_salary ON employees(department, salary);

-- 4. Verify performance improvement with the corrected index
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
AND salary > 50000;
