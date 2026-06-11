# OrderFlow Production Database Debug Report

## Bug 1: Orphaned Records
- **Symptom**: Orders joined with customers return NULL for the customer name if the customer_id does not exist in the customers table.
- **Reproduction Query**:
```sql
SELECT o.id AS order_id, o.customer_id, c.name AS customer_name 
FROM orders o 
LEFT JOIN customers c ON o.customer_id = c.id 
WHERE c.id IS NULL;
```
- **Wrong Data Result**:
```
 order_id | customer_id | customer_name 
----------+-------------+---------------
        3 |        9999 | 
        4 |        9999 | 
(2 rows)
```
- **Data Flow Trace**: The wrong data comes from `orders.customer_id`. This row was inserted via the `POST /orders` route. The schema allowed this because the `customer_id` column lacked a `FOREIGN KEY` constraint.
- **Root Cause**: Table `orders`, Column `customer_id` is missing a `FOREIGN KEY` constraint referencing `customers(id)`.
- **Fix Applied**:
```sql
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
```
*(In the provided schema.sql, we applied the fix directly during table creation)*
- **Validation**:
Query to check if we can insert an orphaned order:
```sql
INSERT INTO orders (customer_id, status, total) VALUES (9999, 'pending', 50.00);
```
Result:
```
ERROR:  insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(9999) is not present in table "customers".
```

## Bug 2: Invalid Data (Negative Inventory)
- **Symptom**: Products can have negative inventory counts.
- **Reproduction Query**:
```sql
SELECT id, name, sku, inventory_count 
FROM products 
WHERE inventory_count < 0;
```
- **Wrong Data Result**:
```
 id |       name       |   sku   | inventory_count 
----+------------------+---------+-----------------
  2 | Wireless Mouse   | SKU-002 |              -3
  3 | USB-C Cable (1m) | SKU-003 |              -5
(2 rows)
```
- **Data Flow Trace**: The wrong data comes from `products.inventory_count`. This row was updated via the `PATCH /products/:id/inventory` route. The schema allowed this because `products.inventory_count` was missing a `CHECK` constraint.
- **Root Cause**: Table `products`, Column `inventory_count` is missing a `CHECK` constraint to ensure the count is >= 0.
- **Fix Applied**:
```sql
ALTER TABLE products ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_count >= 0);
```
*(In the provided schema.sql, we applied the fix directly during table creation)*
- **Validation**:
Query to check if we can update a product to negative inventory:
```sql
UPDATE products SET inventory_count = -5 WHERE id = 1;
```
Result:
```
ERROR:  new row for relation "products" violates check constraint "products_inventory_count_check"
DETAIL:  Failing row contains (1, Keyboard, SKU-001, -5, 89.99).
```

## Bug 3: Duplicate Payments
- **Symptom**: A single order can have multiple payment records.
- **Reproduction Query**:
```sql
SELECT order_id, COUNT(*) as payment_count, string_agg(status, ', ') as statuses 
FROM payments 
GROUP BY order_id 
HAVING COUNT(*) > 1;
```
- **Wrong Data Result**:
```
 order_id | payment_count |      statuses      
----------+---------------+--------------------
        1 |             2 | pending, completed
(1 row)
```
- **Data Flow Trace**: The wrong data comes from `payments.order_id`. This row was inserted via the `POST /payments` route. The schema allowed this because `payments.order_id` is missing a `UNIQUE` constraint.
- **Root Cause**: Table `payments`, Column `order_id` is missing a `UNIQUE` constraint.
- **Fix Applied**:
```sql
ALTER TABLE payments ADD CONSTRAINT unique_payment_order UNIQUE (order_id);
```
*(In the provided schema.sql, we applied the fix directly during table creation)*
- **Validation**:
Query to check if we can add a duplicate payment for the same order:
```sql
INSERT INTO payments (order_id, amount, status) VALUES (1, 10.00, 'pending');
INSERT INTO payments (order_id, amount, status) VALUES (1, 10.00, 'completed');
```
Result:
```
ERROR:  duplicate key value violates unique constraint "payments_order_id_key"
DETAIL:  Key (order_id)=(1) already exists.
```
