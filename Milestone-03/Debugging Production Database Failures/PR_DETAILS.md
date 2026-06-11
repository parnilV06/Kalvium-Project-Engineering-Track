# Pull Request Details

Please use the exact title and description below when creating your Pull Request on GitHub. The reviewer explicitly requested this.

### Title
```text
fix: OrderFlow production database bugs — root cause analysis + schema constraints
```

### Description
```markdown
## Summary of Database Fixes

This PR resolves three major production database anomalies via strict schema-level constraints without needing to modify backend application code logic. 

- **Bug 1 (Orphaned Records)**: Prevented orders from being created with non-existent `customer_id`s.
- **Bug 2 (Negative Inventory)**: Prevented products from having negative `inventory_count` values.
- **Bug 3 (Duplicate Payments)**: Prevented duplicate payment records (e.g. pending/completed collisions) for a single order.

## Commit Structure
As per requirements, the commits are strictly ordered:
1. `docs: DEBUG-REPORT with reproduction queries ONLY` - Committed the report **BEFORE** any schema changes, containing reproduction queries that demonstrate the wrong data.
2. `fix: apply schema constraints to resolve bugs` - Applied the constraints to `schema.sql`.
3. `docs: complete DEBUG-REPORT.md with root causes and validations` - Finished documenting the trace, root cause, and validation.

## Constraints Added
- Added a `FOREIGN KEY` constraint (`REFERENCES customers(id)`) to `orders.customer_id`.
- Added a `CHECK` constraint (`CHECK(inventory_count >= 0)`) to `products.inventory_count`.
- Added a `UNIQUE` constraint to `payments.order_id`.

## Why These Fixes Are Correct
Rather than relying on application-level error handling which can be circumvented via direct database access or race conditions, we are shifting the responsibility to the PostgreSQL database layer. This ensures that any data entering these tables complies with absolute integrity checks, preventing any invalid state permanently. Valid traffic passes through completely unrestricted, while malformed data instantly fails with clear constraint errors.

## Documentation
Please refer to the detailed debugging log including data-flow traces, reproduction queries, and constraint validations here: [DEBUG-REPORT.md](./DEBUG-REPORT.md)
```
