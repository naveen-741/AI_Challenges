# Issues and Solutions Documentation

## 1. Testing Library Compatibility

**Issue:**

- The project uses React 17, but the latest `@testing-library/react` expects React 18+.

**Solution:**

- Installed a compatible version (`@testing-library/react@12.1.5`) to match React 17.

---

## 2. Dynamic Import Coverage in `reportWebVitals.js`

**Issue:**

- Jest cannot easily cover code inside dynamic imports (`import('web-vitals')`).
- The `instanceof Function` check in the implementation caused issues with Jest mocks.

**Solutions Attempted:**

- Mocked the importer and web-vitals functions in tests.
- Used both Jest mocks and plain functions for callbacks.
- Added async handling and microtask flushing in tests.
- Tried refactoring the implementation for easier testing (but reverted to original as per requirements).

**Outcome:**

- Could not achieve 100% coverage for this file without changing the implementation.
- Documented this as a known limitation and best practice is to use `typeof fn === 'function'` for testability.

---

## 3. Entry File (`index.js`) Coverage

**Issue:**

- Jest does not instrument `ReactDOM.render` and DOM mounting in a Node environment.

**Solution:**

- Mocked `document.getElementById` and `ReactDOM.render` in the test.
- Required the file after setting up mocks to ensure coverage.

---

## 4. General Test Coverage

**Issue:**

- Some files (like `reportWebVitals.js`) are hard to cover due to their structure and environment.

**Solution:**

- Wrote comprehensive tests for all business logic and UI components.
- Added smoke tests for entry points.
- Accepted that some boilerplate files may not reach 100% coverage in standard setups.

---

This document summarizes the main issues encountered and the solutions or workarounds applied during the project.
