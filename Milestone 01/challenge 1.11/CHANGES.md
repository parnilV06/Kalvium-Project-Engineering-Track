# Variable Renaming Changes

| Old Name | New Name | Why |
|---|---|---|
| app | expressApp | makes it clear this variable is the Express application instance |
| x | nextId | describes that the value is used to generate the next confession id |
| t | action | tells the reader this parameter controls which handler path runs |
| d | confessionData | explains that the variable contains incoming confession request data |
| r | routeParams | shows that the value comes from the route parameters |
| categories | allowedCategories | makes the purpose explicit: only these categories are accepted |
| tmp | newConfession | describes the object being created before it is stored |
| arr | sortedConfessions | describes both the type and the order of the data being returned |
| result | responsePayload | clarifies that the object is what gets sent back in the response |
| i | confessionId | makes it clear the number is the confession identifier being looked up |
| info | confession | uses the domain name directly for the found record |
| cat | categoryName | makes the variable meaning obvious in the category route |
| cats | allowedCategories | describes the list as the accepted category values |
| stuff | filteredConfessions | shows that the array contains matching confessions after filtering |
| handler | confessionIndex | explains that the value is the index of the matching confession in the array |
| res2 | deletedConfessions | makes it clear the value is the array returned by splice after deletion |
| startStr | startupMessage | describes the string as the message printed when the server starts |
| x | confession | replaces the vague filter callback parameter with the actual domain object |

# Function Splitting Changes

### handleAll() split into:
- validateConfessionInput() - validates the request body before any create operation
- createConfession() - performs the single confession creation and store write
- getAllConfessions() - returns a sorted copy of the full confession list
- getConfessionId() - converts route params into a numeric confession id
- getConfessionById() - finds one confession by id
- getConfessionsByCategory() - filters confessions for one category
- deleteConfessionById() - removes one confession from the in-memory list
- handleCreateConfession() - coordinates create validation and response formatting
- handleGetAllConfessions() - coordinates the list response
- handleGetConfessionById() - coordinates the single-record lookup response
- handleGetConfessionsByCategory() - coordinates the category-filter response
- handleDeleteConfession() - coordinates delete authorization, lookup, and response
Why: the original function mixed request validation, lookup, mutation, and response handling. Splitting it makes each function single-purpose and easier to test independently.

# MVC Folder Structure Changes

### app.js reorganized into:
- routes/confessionRoutes.js - receives HTTP requests and delegates immediately to controllers
- controllers/confessionController.js - extracts request data, calls services, and sends responses
- services/confessionService.js - contains validation, in-memory state, and business logic
Why: the original file mixed routing, orchestration, and business rules. Separating the layers keeps each job isolated and removes business logic from routes.

### Additional structural change:
- app.js - reduced to Express app setup, JSON middleware, route mounting, and server startup
Why: the entry file should stay thin so the MVC layers own the application behavior.

# Environment Variable Changes

### Hardcoded values moved into environment configuration:
- API_BASE_PATH - controls the mounted confession API prefix
- PORT - controls the server listen port
- DELETE_TOKEN - controls the secret required for delete requests
Why: these values were previously hardcoded in source. Moving them into `.env` keeps configuration out of code and makes deployment-specific values easier to manage.

### New files added:
- .env - local runtime values for the app
- .env.example - placeholder template for required environment variables
Why: the example file documents the required config shape without exposing real values.

### Dependency update:
- dotenv - added so app.js can load `.env` values into process.env at runtime
- package-lock.json - refreshed to capture the installed dependency tree
Why: the runtime needs a loader for local environment files, and the lockfile keeps that dependency versioned.

### Documentation update:
- README.md - updated run instructions and endpoint notes to reference `.env` configuration instead of hardcoded port details
Why: the docs should match the new environment-driven setup so the challenge is runnable without guessing values.

# Inline Comment Changes

### Maintainability comments added:
- app.js - documented why runtime config is loaded from environment variables
- controllers/confessionController.js - documented why validation, authorization, and id normalization happen at the edge
- services/confessionService.js - documented why the allowed categories stay centralized, why state stays in memory, and why reads use a sorted copy
Why: the code already shows what each block does; these comments explain the reason each block exists so the code is easier to maintain and extend.
