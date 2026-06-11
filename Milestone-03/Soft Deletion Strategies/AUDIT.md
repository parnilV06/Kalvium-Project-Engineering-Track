# Security & Architecture Audit

[Table: users]
- Missing tenant_id → allows cross-tenant data leaks. All users from all organizations are in the same pool with no isolation.
- salary exposed → sensitive financial data visible to all roles.
- password_hash exposed → severe security vulnerability, exposed in API responses.

[Table: projects]
- Missing tenant_id → allows cross-tenant data leaks. Projects are visible globally.
- budget exposed → sensitive financial data visible to all roles.

[Table: billing_details]
- Missing tenant_id → allows cross-tenant data leaks.
- card_last4 and expiry_date exposed → sensitive payment data visible to all roles.

[API: /users]
- Returns all users regardless of tenant.
- Returns sensitive fields (salary, password_hash).
- No Role-Based Access Control (RBAC).

[API: /projects]
- Returns all projects regardless of tenant.
- Returns sensitive fields (budget).
- No Role-Based Access Control (RBAC).

## Sensitive Fields

[salary]
- Sensitive financial data for employees.
- Admin → allowed
- Manager → restricted
- User → restricted

[password_hash]
- Internal authentication data.
- Admin → restricted (never expose)
- Manager → restricted (never expose)
- User → restricted (never expose)

[budget]
- Sensitive financial data for projects.
- Admin → allowed
- Manager → allowed
- User → restricted

[card_last4, expiry_date, billing_address]
- Sensitive payment data.
- Admin → allowed
- Manager → restricted
- User → restricted (only for own billing data, if supported)
