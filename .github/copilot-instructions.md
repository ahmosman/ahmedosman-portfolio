# Copilot Instructions for ahmedosman-portfolio

## Project Overview

- This is a Vue 3 single-page application (SPA) built with Vite.
- The main entry point is `src/main.js`, which mounts the root `App.vue` component.
- The UI is organized into pages under `src/components/pages/` (e.g., `CityAboutPage.vue`, `CityProjectsPage.vue`).
- Shared UI and logic are in `src/components/` and `src/stores/` (Pinia store, e.g., `counter.js`).
- Static assets (CSS, SVGs) are in `src/assets/`.
- Data for the website is stored in `src/data/` (Git submodule).

## Key Workflows

- **Install dependencies:** `npm install`
- **Start dev server (hot reload):** `npm run dev`
- **Build for production:** `npm run build`
- **Lint code:** `npm run lint`

## Patterns & Conventions

- **Component Structure:**
  - Pages are Vue SFCs in `src/components/pages/`.
  - Use PascalCase for component filenames and registration.
  - Shared components go in `src/components/`.
- **State Management:**
  - Use Pinia stores in `src/stores/` for global state.
- **Assets:**
  - Place global styles in `src/assets/base.css`.
  - SVGs and images are in `src/assets/svg/`.
- **Routing:**
  - If routing is present, it will be configured in `src/main.js` or a `router` directory (not found in current structure).
- **Code Comments:**
  - **All comments in the codebase MUST be written in English.**
  - Use clear, descriptive English for all inline comments, JSDoc, and CSS comments.
  - This ensures consistency and maintainability across the project.

## Integration & External Dependencies

- Uses Vite for build/dev server.
- Uses ESLint for linting (see `eslint.config.js`).
- No backend/API integration found in this codebase.

## Examples

- To add a new page, create a Vue SFC in `src/components/pages/` and register it in the main app or router.
- To add global state, create a new store in `src/stores/` and import it where needed.

## References

- [Vite Config](vite.config.js)
- [ESLint Config](eslint.config.js)
- [README.md](../README.md)

---

**For AI agents:**

- Follow the file structure and naming conventions above.
- Prefer composition API in Vue components.
- Keep logic modular and reusable.
- When in doubt, check similar files in the same directory for patterns.
