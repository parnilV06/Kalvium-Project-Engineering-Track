# Audit for `app.js`

This file records the refactor work needed in the current implementation before any code changes are made.

## Scope

The current `app.js` combines route definitions, request validation, in-memory data storage, business rules, and response formatting in a single file. The code works as a small demo, but it is difficult to extend, test, or reason about safely.

## Major Refactor Targets

### 1. Split responsibilities into smaller functions

- `handleAll` is doing too much: create, fetch all, fetch one, fetch by category, and delete are all handled through one branching function.
- Each action should become its own handler or service function so the route layer only wires endpoints to behavior.
- Shared validation logic should be extracted into reusable helpers instead of being repeated inside nested conditionals.

### 2. Replace unclear variable names

- `x` should be renamed to something descriptive like `nextId`.
- `d` should be renamed to `body` or `requestBody`.
- `r` should be renamed to `params`.
- `t` should be replaced by an explicit action name or removed entirely once handlers are split apart.
- `tmp`, `arr`, `i`, `cat`, `cats`, `stuff`, `handler`, and `res2` are too vague and reduce readability.

### 3. Remove deeply nested conditionals

- The create flow has several nested `if` blocks that make the validation path hard to follow.
- Validation should be flattened with early returns so each failure case is handled once and clearly.
- The delete flow has the same nesting problem and should be simplified the same way.

### 4. Centralize validation rules

- The allowed categories are duplicated in more than one place.
- The text rules are mixed into the route logic instead of living in a dedicated validator.
- Validation should check required fields, type correctness, minimum length, maximum length, and allowed category in a single predictable helper.
- Error responses should be consistent in shape and wording.

### 5. Use a proper data module or store abstraction

- `confessions` is a mutable global array and `x` is a global counter.
- The file currently acts like both an application server and a persistence layer.
- A small repository or store module should manage CRUD operations, ID generation, sorting, and filtering.
- This will make future changes like database support much easier.

### 6. Avoid mutating shared collections during reads

- `getAll` calls `sort()` directly on the live `confessions` array, which mutates the underlying data every time the endpoint runs.
- Read operations should not have side effects on shared state.
- The list should be copied before sorting so response ordering does not alter the stored array.

### 7. Improve route structure and endpoint handlers

- Route handlers currently pass a string command into one dispatcher function instead of using direct endpoint-specific handlers.
- The category route checks `req.params.cat` before calling the handler, but the handler already depends on that param.
- The delete route uses `app.route(...).delete(...)` while the other routes use direct `app.get` and `app.post`; the style is inconsistent.
- Route files should be organized so each endpoint clearly maps to one responsibility.

### 8. Standardize HTTP responses

- Some failures use `res.json`, some use `res.send`, and some use plain string messages.
- Response payloads should follow one convention, ideally structured JSON with a consistent `msg` or `error` key.
- Status codes and messages should be aligned so clients can reliably handle errors.

### 9. Replace magic values and hardcoded literals

- The delete token `supersecret123` is hardcoded in the source.
- The port `3000` is hardcoded.
- Allowed categories are hardcoded multiple times.
- These values should be moved to configuration or constants so they are easier to maintain and safer to change.

### 10. Clean up logging

- `console.log` statements are scattered through request handling.
- Logging should be structured and consistent, with enough context to help debugging without being noisy.
- Success logs like `added one info` and `deleted something` are not very useful in production and should be replaced with clearer messages or a real logger.

### 11. Remove dead or suspicious code

- The final `if (confessions.length > 500)` block runs once on startup and does not protect any runtime behavior.
- `if (info.text)` in the get-one flow is unnecessary because the object was already found and the API expects text to exist.
- Several fallback branches return generic server errors even though the issue is really input validation or control flow.

### 12. Improve naming for domain concepts

- The domain entity is a confession, but some messages and variable names do not reflect that consistently.
- Route and function names should match the domain language more clearly so the file reads like an application, not a prototype.

### 13. Separate validation from business logic

- The create handler validates text, validates category, creates the record, mutates state, logs, and responds all in one branch.
- Business rules should be separated from transport concerns so the HTTP layer stays thin.
- This will also make unit testing easier.

### 14. Add input normalization

- Category values are compared directly without normalization.
- Text is accepted as-is, with no trimming or cleanup.
- Inputs should be normalized where appropriate before validation so the API behaves predictably.

### 15. Add explicit type and existence checks

- `parseInt` is used without validating whether the result is a valid number.
- ID lookups should reject invalid numeric input early instead of letting `NaN` flow through the logic.
- Request body handling should verify that payload fields are the expected type before reading `length`.

### 16. Prepare for testing

- The current structure is hard to unit test because logic is embedded directly in the route file.
- Extracted validation helpers and store functions will allow focused tests for each behavior.
- Route handlers should become thin enough that API tests can cover them without complex setup.

## Refactor Priority Order

1. Extract validation helpers and constants.
2. Split `handleAll` into one function per endpoint.
3. Move in-memory state and CRUD operations into a separate module.
4. Replace vague variable names and nested branching.
5. Standardize responses, logging, and route organization.
6. Remove dead code and add tests after the structure is simpler.

## Notes

- This audit is intentionally limited to analysis and refactor planning.
- No runtime behavior has been changed yet.
