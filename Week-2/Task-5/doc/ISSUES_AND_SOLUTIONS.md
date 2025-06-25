# Issues and Solutions

This document tracks major issues encountered during the development of the 3D Model Viewer app and their solutions.

---

## 1. Tailwind/PostCSS Configuration Errors

**Issue:**

- Tailwind and PostCSS config files were created in the wrong directory, causing build errors and missing styles.
- Errors about plugin compatibility and Tailwind CSS not being applied.

**Solution:**

- Deleted misplaced config files and recreated them in the correct directory.
- Reinstalled correct dependencies, updated PostCSS config, and ensured Tailwind config and CSS files were correct.
- Verified content paths and plugin names.

---

## 2. Camera Reset Button Not Working

**Issue:**

- The camera reset button did not reset the OrbitControls view as expected.

**Solution:**

- Wired up the OrbitControls `reset` method to the reset button handler.

---

## 3. Wireframe Toggle Not Fully Functional

**Issue:**

- Toggling wireframe mode did not update all model materials as expected.

**Solution:**

- Updated the code to set the `wireframe` property on all materials in the model's mesh hierarchy.

---

## 4. Animation Selection/Playback Not Working

**Issue:**

- Animation dropdown was present, but animations did not play or were not listed.
- GLTF animations array was empty or not attached to the model scene.

**Solution:**

- Explicitly attached the GLTF animations array to the model scene.
- Ensured the correct root was passed to `useAnimations` and the UI allowed animation selection.

---

## 5. Dark Mode Toggle Not Updating UI

**Issue:**

- Toggling dark mode did not update the UI colors.

**Solution:**

- Fixed by toggling the `dark` class on the `html` element and ensuring Tailwind dark mode classes were used.

---

## 6. Wireframe Toggle UI

**Issue:**

- No UI for toggling wireframe mode per model.

**Solution:**

- Added a checkbox in the sidebar for each model to toggle wireframe mode.

---

## 7. No Animation Available Message

**Issue:**

- If a model had no animations, the UI was unclear.

**Solution:**

- Displayed "No Animation Available" if a model has no animations.

---

## 8. Console Logs Cleanup

**Issue:**

- Debug console logs cluttered the codebase.

**Solution:**

- Removed all unnecessary console logs from the codebase.

---

## 9. Models Not Updating on Upload

**Issue:**

- Uploading new models did not update the sidebar list or show the correct metadata.

**Solution:**

- Fixed the upload logic to store the actual File object with its URL and use it in the model loader, ensuring new uploads are always reflected in the models list with correct metadata.

---

## 10. Add New Light UI Hidden/Not Expanding

**Issue:**

- The "Add New Light" UI was hidden or clipped due to insufficient max height on the light controls section.

**Solution:**

- Increased the expanded max height for the light controls section to ensure the form and all lights are visible.

---

## 11. Mobile Responsiveness

**Issue:**

- The sidebar used a fixed width and layout was not responsive, causing overflow or poor usability on mobile.

**Solution:**

- Made the sidebar responsive: it overlays and is toggleable on mobile, and remains fixed-width on desktop. The main layout uses flexbox and full viewport height for better stacking and usability on small screens.

---
