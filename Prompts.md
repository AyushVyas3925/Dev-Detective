# AI Prompts Documentation

This document records the specific technical prompts used to guide the AI assistant during the development of **Dev-Detective**.

## 🛠 Feature Implementation

### Core API Integration
> "Write an asynchronous JavaScript function to fetch GitHub user data using the `fetch` API. Handle 404 errors gracefully and return a standardized object containing the avatar, bio, and stats."
*   **Purpose**: To establish the data layer for the User Search feature.

### Dynamic UI Rendering
> "Create a template literal function `generateProfileHTML(user)` that takes the user object and returns the HTML structure for the profile card. Ensure the layout matches the provided CSS classes like `.profile-card` and `.stats-container`."
*   **Purpose**: To dynamically inject user data into the DOM without refreshing the page.

### Repository Analysis (Level 2)
> "Extend the API logic to fetch the top 5 most recently updated repositories for a user. Map these to a list of links showing the repo name, updated date (formatted as 'DD Mon YYYY'), and star count."
*   **Purpose**: To fulfill the Level 2 requirement of showing active repositories.

### Battle Mode Logic (Level 3)
> "Implement a `handleBattle(user1, user2)` function that uses `Promise.all` to fetch two profiles in parallel. Compare their total `followers + public_repos` to determine a winner, and apply a visual highlight to the winning card."
*   **Purpose**: To implement the competitive Battle Mode with efficient parallel network requests.

---

## 🎨 UI/UX Refinement

### Loading State
> "Create a CSS-only spinner animation to replace the static 'Loading...' text. Use a rotating border effect that matches the application's blue theme color."
*   **Purpose**: To enhance the user experience during asynchronous data fetches.

### Responsive Design
> "Review the `.battle-arena` CSS grid layout. Ensure that on mobile screens (max-width: 768px), the comparison cards stack vertically instead of side-by-side to prevent overflow."
*   **Purpose**: To fix layout issues on smaller devices.

---

## 🔧 Debugging & Optimization

### Local File Execution
> "Refactor the logical flow to remove ES Module imports/exports so the project can run directly via the `file://` protocol. Wrap the global scripts in IIFEs to prevent variable collisions."
*   **Purpose**: To allow the user to test the app locally without needing a Node.js server.
