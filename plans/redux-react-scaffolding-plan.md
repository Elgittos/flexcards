## Plan: Redux + React Project Scaffolding

Setting up a modern Redux Toolkit + React project with Vite, RTK Query for API handling, and Tailwind CSS for styling. Following 2026 best practices with feature-based organization.

**Configuration Choices:**
- Language: JavaScript
- State Management: Redux Toolkit with RTK Query
- Routing: None (can add React Router later)
- Styling: Tailwind CSS
- Testing: None initially

**Phases: 3 phases**

1. **Phase 1: Create Directory Structure and Configuration Files**
    - **Objective:** Set up the complete directory tree and essential configuration files (package.json, vite.config, tailwind.config, .gitignore, etc.)
    - **Files/Functions to Modify/Create:**
        - package.json (dependencies and scripts)
        - vite.config.js
        - tailwind.config.js
        - postcss.config.js
        - .gitignore
        - .env.example
        - eslint.config.js
        - Directory structure: src/app/, src/features/, src/components/common/, src/components/layout/, src/hooks/, src/pages/, src/services/, src/utils/, src/constants/, public/
    - **Tests to Write:** N/A (configuration files don't require tests)
    - **Steps:**
        1. Create root-level configuration files with appropriate content
        2. Create src/ directory with all subdirectories
        3. Create public/ directory
        4. Verify directory structure is complete

2. **Phase 2: Create Core Application Files**
    - **Objective:** Set up the Redux store with RTK Query, React entry point, and basic app structure with Tailwind
    - **Files/Functions to Modify/Create:**
        - public/index.html
        - src/main.jsx
        - src/App.jsx
        - src/index.css (with Tailwind directives)
        - src/app/store.js
        - src/hooks/useAppDispatch.js
        - src/hooks/useAppSelector.js
    - **Tests to Write:** N/A (scaffolding task)
    - **Steps:**
        1. Create HTML entry point in public/
        2. Create React app entry point (main.jsx) with Redux Provider
        3. Create basic App component with Tailwind classes
        4. Create Redux store configuration
        5. Create custom hooks for typed Redux usage
        6. Add Tailwind CSS directives to index.css

3. **Phase 3: Create Example Feature Slice with RTK Query**
    - **Objective:** Provide working examples of Redux Toolkit slice and RTK Query API slice for reference
    - **Files/Functions to Modify/Create:**
        - src/features/example/exampleSlice.js
        - src/app/api/apiSlice.js (RTK Query base API)
        - Update src/app/store.js to include example reducer and RTK Query middleware
        - Create placeholder README.md files in key directories
    - **Tests to Write:** N/A (scaffolding task)
    - **Steps:**
        1. Create RTK Query base API slice configuration
        2. Create example feature directory with standard slice
        3. Wire example reducer and RTK Query into store
        4. Add README files explaining directory purposes
        5. Verify complete structure is in place
