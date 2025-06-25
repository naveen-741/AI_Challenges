# Issues Faced and Solutions Implemented

## 1. Category Validation

**Issue:**

- Users could add tasks with invalid categories, leading to inconsistent data.

**Solution:**

- Implemented a set of allowed categories and validated input against this set in both JS and Python. Raised an error if the category was invalid.

---

## 2. Task Lookup by ID

**Issue:**

- Completing a task required finding it by ID. Using a list/array for storage meant O(n) lookup, which could be slow for large datasets.

**Solution:**

- For moderate data sizes, kept the list/array approach for simplicity. Noted that for larger datasets, a dictionary/object keyed by ID would be more efficient.

---

## 3. Timestamp/ID Generation

**Issue:**

- Ensuring unique task IDs, especially when tasks are created in rapid succession.

**Solution:**

- Used `Date.now()` in JS and `int(datetime.now().timestamp() * 1000)` in Python to generate millisecond-precision IDs, minimizing collision risk.

---

## 4. Error Handling

**Issue:**

- Need for clear error messages and robust handling of invalid operations (e.g., completing a non-existent task).

**Solution:**

- Used `throw new Error` in JS and `raise ValueError` in Python with descriptive messages for all invalid operations.

---

## 5. Consistent Output for Testing

**Issue:**

- Ensuring that both JS and Python implementations produced functionally identical outputs for statistics and task queries.

**Solution:**

- Carefully matched the structure and logic of both implementations, and compared outputs during testing to ensure consistency.

---

## 6. Performance Testing

**Issue:**

- Needed to ensure that the implementation was efficient for typical use cases (e.g., 1000 tasks).

**Solution:**

- Added performance tests in both languages to measure time for adding tasks and generating statistics, confirming acceptable performance.
