# AI Interaction Logs & Prompts Log

> This document contains the raw interaction history with AI assistants (Google Gemini & Claude) during the development of VeloVault on October 24, 2026.
> It documents the iterative Test-Driven Development (TDD) workflow, architectural design choices, test generation, and debugging sessions.

---

### Session 1: Project Scaffolding & Architecture Planning
**Timestamp:** Oct 24, 2026 - 08:22 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> I'm starting a full-stack coding challenge: building a Car Dealership Inventory System named "VeloVault".
> Requirements:
> - Backend: Node.js/Express with MongoDB (Mongoose ODM). In-memory DBs are disallowed for production, but in-memory DB is fine for testing.
> - Strict TDD methodology with Red-Green-Refactor cycles.
> - Authentication: JWT token-based auth for users and admins.
> - Protected endpoints for CRUD on vehicles, search/filters, purchase (decrements stock), and restock (admin-only).
> - Frontend: React 18 with Tailwind CSS and Vite.
>
> Help me outline a clean directory structure separating concerns (controllers, services, models, middleware) so that the core business logic can be unit tested without requiring HTTP mock servers.

**AI Response:**
> Recommended project structure:
> 1. Use a layered architecture: `controllers/` handles HTTP request/response validation, `services/` contains pure business logic and DB interactions, `models/` contains Mongoose schemas with validation hooks, and `middleware/` manages JWT auth and role guards.
> 2. For TDD, having `services/` separate from Express routes allows you to write isolated unit tests for vehicle purchasing, restocking constraints, and search filtering without booting Supertest every time.
> 3. Use `mongodb-memory-server` for both unit and integration tests so test suites execute fast and clean up completely between runs without needing a local MongoDB daemon running.

---

### Session 2: TDD Cycle 1 - User Model & Password Hashing
**Timestamp:** Oct 24, 2026 - 09:14 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Let's start with User authentication following TDD.
> Write unit test cases for the Mongoose `User` schema before we implement it.
> Test cases needed:
> 1. Valid user creation (username, email, password, default role 'user').
> 2. Required field validations (username, email, password).
> 3. Email format regex check.
> 4. Minimum length constraints (username >= 3 chars, password >= 6 chars).
> 5. Duplicate email rejection.
> 6. Bcrypt pre-save hook that hashes the password.
> 7. Password comparison instance method (`comparePassword`).
> 8. Don't re-hash password on saving non-password fields.
> Give me the Jest test suite using `mongodb-memory-server`.

**AI Response:**
> Provided `tests/unit/user.model.test.js` covering all 8 validation and hashing scenarios.
> 
> *Developer Note: Ran tests -> Failed (Red: User model doesn't exist yet).*

---

### Session 3: Implementing User Model & Password Hashing
**Timestamp:** Oct 24, 2026 - 09:48 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> The test suite is failing as expected. Let's write the Mongoose `User` model to make all tests pass.
> Ensure `password` has `select: false` so it isn't accidentally returned in API queries, and use `bcrypt.genSalt(10)` in the pre-save middleware.

**AI Response:**
> Provided `src/models/User.js` with schema validations, pre-save hook, and `comparePassword` method.
> 
> *Developer Note: Ran tests -> All 14 tests in `user.model.test.js` passed (Green).*

---

### Session 4: TDD Cycle 2 - Vehicle Model & Constraints
**Timestamp:** Oct 24, 2026 - 10:30 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Now let's move to the Vehicle model.
> Each vehicle must have: make, model, year (1900-2030), category ('sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'wagon'), price (>= 0), quantity (>= 0, default 0), optional description and imageUrl.
> Write the test suite first in `tests/unit/vehicle.model.test.js` covering:
> - Valid vehicle creation
> - Required field assertions
> - Category enum restriction
> - Price & quantity non-negative checks
> - Year boundary tests
> - Compound indexes for make/model and category search performance.

**AI Response:**
> Provided unit test specifications for `Vehicle` model.
> 
> *Developer Note: Ran tests -> Failed (Red: Vehicle model missing).*

---

### Session 5: Implementing Vehicle Model
**Timestamp:** Oct 24, 2026 - 11:05 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Generate `src/models/Vehicle.js` to satisfy the tests. Make sure indexes on `{ make: 1, model: 1 }` and `{ category: 1 }` are declared for search performance.

**AI Response:**
> Provided `Vehicle.js` implementation.
> 
> *Developer Note: Ran tests -> All 14 tests in `vehicle.model.test.js` passed (Green).*

---

### Session 6: TDD Cycle 3 - AuthService & JWT Generation
**Timestamp:** Oct 24, 2026 - 11:45 AM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Let's test and build the business logic layer for authentication (`AuthService`).
> I need unit tests for:
> - `register`: creates user, hashes password, returns sanitized user object without password, plus a signed JWT. Rejects duplicate emails and duplicate usernames with 409 error.
> - `login`: validates email and password, rejects non-existent email with 401, rejects wrong password with 401, returns token and sanitized user.
> Give me the test cases first.

**AI Response:**
> Provided `tests/unit/authService.test.js`.
> 
> *Developer Note: Ran tests -> Failed (Red: authService and generateToken missing).*

---

### Session 7: Implementing AuthService & Token Utility
**Timestamp:** Oct 24, 2026 - 12:20 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Now implement `src/utils/generateToken.js` with `jsonwebtoken` and `src/services/authService.js` to make the unit tests pass.

**AI Response:**
> Provided `generateToken.js` and `authService.js`.
> 
> *Developer Note: Ran tests -> All 10 tests in `authService.test.js` passed (Green).*

---

### Session 8: TDD Cycle 4 - VehicleService (CRUD, Search, Purchase & Restock)
**Timestamp:** Oct 24, 2026 - 02:10 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> The most critical core requirements are in `VehicleService`:
> 1. `createVehicle(data)`
> 2. `getAllVehicles(page, limit)` with pagination metadata (totalPages, totalItems, currentPage)
> 3. `searchVehicles({ make, model, category, minPrice, maxPrice })` with case-insensitive regex for make and model, exact category matching, and price range filter
> 4. `getVehicleById(id)` with 404 handling
> 5. `updateVehicle(id, data)`
> 6. `deleteVehicle(id)`
> 7. `purchaseVehicle(id, quantity)`: decreases vehicle quantity, throws 400 if stock is insufficient, throws 404 if not found
> 8. `restockVehicle(id, quantity)`: increases vehicle quantity, requires positive quantity, throws 404 if not found.
> 
> Please write comprehensive unit tests in `tests/unit/vehicleService.test.js` covering all success and error paths.

**AI Response:**
> Provided full unit test suite with 20 distinct assertions.
> 
> *Developer Note: Ran tests -> Failed (Red: VehicleService missing).*

---

### Session 9: Implementing VehicleService
**Timestamp:** Oct 24, 2026 - 02:55 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Implement `src/services/vehicleService.js` to satisfy all test cases. Ensure atomic stock decrement/increment operations.

**AI Response:**
> Implemented `vehicleService.js`.
> 
> *Developer Note: Ran tests -> All 20 tests in `vehicleService.test.js` passed (Green).*

---

### Session 10: TDD Cycle 5 - API Integration Tests with Supertest
**Timestamp:** Oct 24, 2026 - 04:15 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Let's test the HTTP routing, request validation middleware (`express-validator`), and JWT protection middleware.
> Write integration tests for:
> - `POST /api/auth/register` and `POST /api/auth/login` (validation errors, happy path)
> - `POST /api/vehicles` (401 without auth, 201 with auth)
> - `GET /api/vehicles` & `GET /api/vehicles/search`
> - `PUT /api/vehicles/:id`
> - `DELETE /api/vehicles/:id` (403 for normal user, 200 for admin)
> - `POST /api/vehicles/:id/purchase` (quantity reduction, out of stock 400)
> - `POST /api/vehicles/:id/restock` (admin only, 403 for user, 200 for admin)
> - Health check & 404 route handling.

**AI Response:**
> Generated `tests/integration/auth.test.js` and `tests/integration/vehicle.test.js`.
> 
> *Developer Note: Ran tests -> Failed (Red: Routes and controllers not implemented).*

---

### Session 11: Implementing Controllers, Routes, and Middleware
**Timestamp:** Oct 24, 2026 - 05:00 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Implement:
> 1. `middleware/auth.js`: `authenticate` (JWT verification) and `authorizeAdmin` (checks `req.user.role === 'admin'`).
> 2. `middleware/validate.js`: standard error response formatter for `express-validator`.
> 3. `controllers/authController.js` and `controllers/vehicleController.js`.
> 4. `routes/authRoutes.js` and `routes/vehicleRoutes.js`.
> 5. Express `app.js` with cors, morgan, json body parsing, and error handling.

**AI Response:**
> Generated all controller, route, and middleware files.
> 
> *Developer Note: Ran tests -> All 24 integration tests passed (Green). Total: 68 tests passing across unit and integration suites.*

---

### Session 12: Frontend Architecture & Auth Context
**Timestamp:** Oct 24, 2026 - 06:30 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Let's transition to the React frontend.
> Requirements:
> - Vite + React 18 + Tailwind CSS.
> - Client-side token storage in `localStorage`.
> - Axios instance with auto Bearer token injection and 401 interceptor that clears session and redirects to `/login`.
> - `AuthContext` providing `user`, `login`, `register`, `logout`.
> - Toast notifications via `react-hot-toast`.
> Provide the Axios service and the Auth Context provider.

**AI Response:**
> Provided `src/services/api.js` and `src/context/AuthContext.jsx`.

---

### Session 13: UI Components - VehicleCard, SearchBar, VehicleForm
**Timestamp:** Oct 24, 2026 - 07:25 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Build the UI components:
> 1. `VehicleCard`: Show car details, price formatted with currency, category tag with badge styling, stock level, and a "Purchase" button. When quantity === 0, display an "OUT OF STOCK" overlay and disable the button.
> 2. `SearchBar`: Search input by make, toggleable advanced filters for model, category dropdown, minPrice, and maxPrice.
> 3. `VehicleForm`: Modal form for adding/editing a vehicle with all required fields.

**AI Response:**
> Generated `VehicleCard.jsx`, `SearchBar.jsx`, and `VehicleForm.jsx`.

---

### Session 14: Pages - Login, Register, Dashboard, and Admin Panel
**Timestamp:** Oct 24, 2026 - 08:40 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Generate the main application views:
> 1. `LoginPage` & `RegisterPage` with sleek split-screen layout and Lucide icons.
> 2. `DashboardPage` displaying inventory grid, pagination controls, search bar integration, and handlePurchase action.
> 3. `AdminPage` with table view of vehicles, stock status indicators, inline quick-restock input, edit modal trigger, and delete confirmation dialog.
> 4. `Navbar` displaying links according to role (Admin panel only visible to admins).

**AI Response:**
> Generated all page components and wiring in `App.jsx`.

---

### Session 15: Final Polish, README & Verification
**Timestamp:** Oct 24, 2026 - 09:35 PM  
**Tool:** Gemini 1.5 Pro  

**Developer Prompt:**
> Provide a comprehensive README.md including:
> - Project overview and architecture diagram/structure
> - Detailed installation & local execution instructions
> - Full REST API documentation table with auth requirements
> - Testing guidelines and coverage breakdown
> - Mandatory "My AI Usage" section detailing tools, workflows, and reflections.

**AI Response:**
> Generated complete `README.md`.
