# Dev Confessions

An anonymous confession app for developers to share their bugs, deadline stress, imposter syndrome, and vibe-coding sessions.

## Endpoints

- GET {API_BASE_PATH}
- POST {API_BASE_PATH}
- GET {API_BASE_PATH}/:id
- GET {API_BASE_PATH}/category/:cat
- DELETE {API_BASE_PATH}/:id

## Run with:

1. `npm install`
2. Copy `.env.example` to `.env` and set the values you need
3. `npm start`

## Environment

- `API_BASE_PATH` controls the confession API prefix
- `PORT` controls the server port
- `DELETE_TOKEN` is required for delete requests
