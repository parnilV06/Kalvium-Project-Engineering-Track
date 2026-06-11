# Security Architecture and Access Control

## 1. Sensitive Fields
The following fields are considered sensitive and have strict access controls:
- **`users.salary`**: Sensitive financial data. Accessible only by `admin` users or the user themselves (if permitted by business logic).
- **`users.password_hash`**: Internal authentication data. Never exposed via API to any role.
- **`projects.budget`**: Sensitive financial data for projects. Accessible only by `admin` and `manager` roles. Hidden from `employee`.
- **`billing_details.card_last4`, `billing_details.expiry_date`, `billing_details.billing_address`**: Sensitive payment data. Restricted to `admin` or the user who owns the data.

## 2. Tenant Isolation Strategy
- **`tenant_id` Foreign Keys**: Added `tenant_id` to all tables (`users`, `projects`, `billing_details`) mapping to the `tenants` table.
- **Query Filtering**: Every query executed in the API layer must enforce tenant isolation by appending `WHERE tenant_id = req.user.tenantId`. This guarantees that queries are physically restricted to the caller's tenant.
- **Indexing**: Database indexes on `tenant_id` columns ensure that the engine efficiently filters rows at the lowest level, improving both performance and security by speeding up the restrictive scans.

## 3. Cross-Tenant Risks
- **Risk**: A user in Tenant A updates a foreign key (e.g., `user_id` in `billing_details`) to reference a user in Tenant B.
- **Prevention**: We implemented a composite foreign key constraint `FOREIGN KEY (tenant_id, user_id) REFERENCES users(tenant_id, id)`. This ensures that a `billing_details` row can only reference a `user` that belongs to the exact same tenant, physically preventing cross-tenant data referencing.

## 4. RBAC Design
Role-Based Access Control determines what data within the isolated tenant is visible to the user:
- **Admin**: Has full data access within their tenant (can view salaries, project budgets).
- **Manager**: Has restricted access. Cannot view user salaries, but can view project budgets.
- **User (Employee)**: Has the most restricted access. Cannot view other users' salaries, cannot view project budgets. Can only access their own sensitive data.
