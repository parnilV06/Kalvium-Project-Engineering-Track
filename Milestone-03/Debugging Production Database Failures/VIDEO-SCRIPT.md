# Video Recording Script & Guide

The reviewer noted that your video submission missed critical elements. You MUST show the **reproduction query results** (the wrong data) and explain the **root causes**.

Here is a step-by-step guide and script to record your video submission:

## Step 1: Preparation
1. Open your terminal and connect to your local PostgreSQL database (or whichever tool you use like pgAdmin or DBeaver).
2. Have `DEBUG-REPORT.md` and `schema.sql` open in your code editor.

## Step 2: Recording (Follow this Script)

**(Start Recording)**

**1. Introduction**
> "Hi, this is my submission for the Database Debugging challenge. Today I'll walk through three production database bugs, demonstrate the bad data, explain the root causes, and show how I fixed them using schema-level constraints."

**2. Bug 1: Orphaned Records**
> "The first bug involves orphaned records in the orders table."
*(Switch to your terminal/SQL tool and run the Bug 1 Reproduction Query from DEBUG-REPORT.md)*
> "As you can see from this query result, we have orders with customer IDs like 9999 that do not exist in the customers table, resulting in a null customer name."
> "The root cause is that the `orders` table was missing a `FOREIGN KEY` constraint on the `customer_id` column."
*(Switch to your code editor and show `schema.sql`)*
> "I fixed this by adding `REFERENCES customers(id)` to the column definition, which prevents any invalid customer IDs from being inserted."

**3. Bug 2: Negative Inventory**
> "The second bug allows products to have negative inventory."
*(Switch back to SQL tool and run the Bug 2 Reproduction Query)*
> "Running this query shows products like 'Wireless Mouse' with an inventory count of -3."
> "The root cause here is the absence of a `CHECK` constraint. The application was decrementing inventory without validating the final number."
*(Switch to code editor and show `schema.sql`)*
> "I fixed this by adding a `CHECK(inventory_count >= 0)` constraint directly on the `products` table, ensuring the database rejects negative stock entirely."

**4. Bug 3: Duplicate Payments**
> "The final bug involves duplicate payments for a single order."
*(Switch to SQL tool and run the Bug 3 Reproduction Query)*
> "This query groups payments by order ID, and we can see an order with two payment records: one pending and one completed."
> "The root cause is that the `payments` table was missing a `UNIQUE` constraint on the `order_id` column."
*(Switch to code editor and show `schema.sql`)*
> "To fix this, I added the `UNIQUE` keyword to the `order_id` column in `schema.sql`. Now, attempting to insert a second payment for the same order will throw a constraint violation error."

**5. Conclusion**
> "By implementing these constraints directly at the database schema level, we guarantee data integrity regardless of application bugs or race conditions. All fixes and validation results are fully documented in the `DEBUG-REPORT.md` file. Thank you!"

**(Stop Recording)**
