# Concurrency Explainer

**Your name:** parnil
**Date:** 2026-04-30

---

## The Root Cause — Why Check-Then-Insert Fails

A race condition occurs when multiple processes or threads access and manipulate shared data concurrently, and the outcome depends on the execution order. In this endpoint's context, the flaw is caused by a check-then-insert pattern (also known as Time-of-Check to Time-of-Use or TOCTOU). 

When checking with `findFirst()` before creating with `create()`, there's a gap between the check and the insert. If two requests arrive at the exact same millisecond, both requests will run `findFirst()`. Since the database hasn't processed any insert yet, both will see that the seat is available. They will both proceed to the `create()` step and successfully insert a booking for the same seat, leading to double bookings. The application has no way of guaranteeing that the state hasn't changed between the check and the insert.

---

## Why the Unique Constraint Fixes It

Moving the check from the application layer to the database level (by adding a `@@unique` constraint on the `seatId` and `showId` combination) closes the race condition because database constraints are atomic. 

Application-layer checking cannot solve this issue natively because it runs outside the database's locking mechanism, relying on sequential steps that are vulnerable to concurrent execution. A database, on the other hand, enforces constraints atomically when writing data. It ensures that the unique index is checked precisely at the moment of insertion and rejects duplicate entries with an error. No matter how many concurrent requests are made, only the first one to reach the database will succeed, and the rest will fail.

---

## Why Rate Limiting Alone Is Not Enough

Adding `express-rate-limit` without the `@@unique` constraint would still allow double bookings because rate limiting only restricts the number of requests from a single IP address over a specific period. 

Consider a scenario where two different users, Alice and Bob, each with their own IP address, try to book the exact same seat at the same time. Since they are coming from different IP addresses, the rate limiter won't block either request. Both requests will reach the check-then-insert logic concurrently, pass the `findFirst()` check, and result in two bookings for the same seat. Even if the same user triggered it, two simultaneous requests from one IP might hit the backend before the rate limiter properly updates its internal counters, allowing both through. Rate limiting is a defense against abuse, not a safeguard for data integrity.

---

## What P2002 Means and Why 409

Prisma error code P2002 signifies that a "Unique constraint failed" on the database level. It means the application attempted to insert or update a record that would violate a unique constraint defined in the schema.

The HTTP status `409 Conflict` is the correct response because it indicates that the request could not be processed due to a conflict with the current state of the resource (in this case, the seat is already booked). It is not a `400 Bad Request` because the request syntax and payload are perfectly valid. It is also not a `500 Internal Server Error` because the server hasn't crashed or encountered an unexpected internal failure; rather, it's operating exactly as designed by actively enforcing business rules and preventing conflicting data from being saved.
