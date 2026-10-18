# Security Specification for Vegina Bangladesh

## 1. Data Invariants
- Users can read and write only their own user profile document (`/users/{userId}`).
- An order can only be created by an authenticated user matching `incoming().userId == request.auth.uid` or an admin.
- Order updates can only be executed by the customer (e.g. canceling while pending) or by the store administrator (`connect.nasimul@gmail.com`).
- Wishlist items can only be read, created, or deleted by their owner (`userId == request.auth.uid`).
- Admin role has full oversight over orders for management, delivery tracking, and status transitions.

## 2. Dirty Dozen Payloads & Invariants
1. Unauthorized user attempting to read another customer's private address / phone info -> REJECTED.
2. Unauthenticated write to `/orders/{orderId}` -> REJECTED.
3. User attempting to create an order on behalf of another UID -> REJECTED.
4. User attempting to forge an admin role inside `/users/{userId}` -> REJECTED.
5. Injected payload with enormous string ID > 128 characters -> REJECTED.
6. Malformed items payload or oversized order data -> REJECTED.
7. Attempting to delete another user's wishlist items -> REJECTED.
8. Modifying immutable order ownerId after creation -> REJECTED.
9. Non-admin attempting to mark order as delivered without authorization -> REJECTED.
10. Attempting to write unverified email as admin -> REJECTED.
11. Blanket unconstrained list query across entire customer base -> REJECTED.
12. Attempting to poison document path with invalid symbols -> REJECTED.
