# Document your index fixes here

# Document your index fixes here

- **Original index:**
  ```sql
  CREATE INDEX idx_salary_department ON employees(salary, department);
  ```

- **Issue observed:**
  When executing the query:
  ```sql
  SELECT * FROM employees WHERE department = 'Sales' AND salary > 50000;
  ```
  PostgreSQL typically performs a Sequential Scan (or an inefficient Index Scan) rather than an optimal Index Scan. This is due to the **Left-Most Prefix Rule**. The original index places `salary` as the leading column. Because the query applies a range filter (`> 50000`) on `salary`, the database cannot simply jump to a specific section of the index. Instead, it must scan a broad range of salaries and evaluate the `department` condition for each one, which is highly inefficient. 

- **Fixed index:**
  We drop the inefficient index and recreate it with the correct column order, putting the column with the equality condition first:
  ```sql
  DROP INDEX idx_salary_department;
  CREATE INDEX idx_department_salary ON employees(department, salary);
  ```

- **Performance improvement:**
  With the corrected index `(department, salary)`, PostgreSQL efficiently uses an Index Scan. According to the **Left-Most Prefix Rule**, the B-Tree index can immediately navigate to the exact branch where `department = 'Sales'` (thanks to the equality condition). Once there, it can sequentially read just the contiguous blocks where `salary > 50000`. This drastically reduces the number of rows scanned, changing a full table scan into a highly targeted index seek, resulting in dramatically faster execution times on large datasets.