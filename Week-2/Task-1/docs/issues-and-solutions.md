# Issues and Solutions: User Management Service API

## 1. Prisma Client Initialization Error

**Issue:**

```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

**Solution:**

- The Prisma client was being generated in a custom path (`generated/prisma`) but imported as `@prisma/client`.
- Fixed by removing the custom `output` path in `schema.prisma` and running `npx prisma generate` to generate the client in the default `node_modules/@prisma/client` location.

---

## 2. TypeScript Error with JWT Sign

**Issue:**

```
No overload matches this call... Argument of type 'string' is not assignable to parameter of type 'null'.
```

**Solution:**

- The `expiresIn` option in `jwt.sign` was not typed correctly for the latest `jsonwebtoken` version.
- Fixed by updating the function signature and casting `expiresIn` to `any` to satisfy the type checker.

---

## 3. Swagger-jsdoc TypeScript Error

**Issue:**

```
Could not find a declaration file for module 'swagger-jsdoc'.
```

**Solution:**

- Installed the official types: `npm install --save-dev @types/swagger-jsdoc`.

---

## 4. Error Handling for Non-existent Users (Update/Delete)

**Issue:**

- When updating or deleting a user that does not exist, the API would throw an unhandled error.
  **Solution:**
- Wrapped the Prisma update and delete calls in try/catch blocks in the service layer.
- If the error code is `P2025` (record not found), return `null` so the controller can respond with a `404 User not found` message.

---

## 5. Swagger Documentation Integration

**Issue:**

- No API documentation was available for the endpoints.
  **Solution:**
- Added `swagger-ui-express` and `swagger-jsdoc` for automatic API documentation.
- Added JSDoc comments to route files for endpoint documentation.

---

## 6. TypeScript Type Issues with Swagger-jsdoc

**Issue:**

- TypeScript complained about missing types for `swagger-jsdoc`.
  **Solution:**
- Installed `@types/swagger-jsdoc` to resolve the error.

---

## 7. Prisma Migration and Client Generation

**Issue:**

- After updating the Prisma schema, the client was not regenerated, causing runtime errors.
  **Solution:**
- Always run `npx prisma generate` after modifying the schema.

---

## 8. General Dependency and Type Issues

**Issue:**

- TypeScript errors due to missing type definitions for Express, JWT, etc.
  **Solution:**
- Installed all necessary `@types/*` packages as dev dependencies.

---

## 9. Jest Test Suite Not Running TypeScript

**Issue:**

```
Jest encountered an unexpected token... Jest failed to parse a file.
```

**Solution:**

- Jest was not configured to handle TypeScript files.
- Fixed by installing `ts-jest` and adding a `jest.config.js` with `preset: 'ts-jest'`.

---

## 10. Jest Test Suite Must Contain At Least One Test

**Issue:**

```
Your test suite must contain at least one test.
```

**Solution:**

- The test file was empty. Added actual test cases to the file.

---

## 11. Increasing Test Coverage

**Issue:**

- Only basic CRUD tests were present for the user service.

**Solution:**

- Added tests for duplicate email, non-existent user (get, update, delete), and edge cases to improve coverage.

---

For any new issues, follow a similar approach: read the error, check documentation, and ensure dependencies and types are up to date.
