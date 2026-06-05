# Technical Decisions

## Database Choice
**Decision:** SQLite with Prisma ORM.
**Rationale:** For a coding assignment, SQLite is excellent as it requires no external setup (zero-conf) while providing full SQL capabilities. Prisma was chosen for its strong type-safety, easy migrations, and developer productivity.

## Authentication Strategy
**Decision:** JWT (JSON Web Token) Authentication.
**Rationale:** Standard for stateless APIs. It allows for secure communication without server-side sessions, which aligns with modern backend practices.

## Project Structure
**Decision:** Service-Controller-Route pattern.
**Rationale:** This separation of concerns ensures that business logic (services) is independent of the transport layer (controllers/routes), making the code more testable and maintainable.

## AI Integration
**Decision:** Groq SDK with Mixtral-8x7b.
**Rationale:** Groq provides high-performance inference. Mixtral-8x7b is a capable model for extracting insights and following JSON output formats.

## Validation and Error Handling
**Decision:** Zod for schema validation and a centralized Express error handler.
**Rationale:** Zod provides runtime validation that is perfectly synced with TypeScript types. A centralized error handler ensures consistent API responses and proper logging of failures.

## Scheduled Jobs
**Decision:** node-cron.
**Rationale:** Simple and effective for running background tasks within the Node.js process without requiring a separate worker service.

## External Integration
**Decision:** Slack Webhook.
**Rationale:** Provides a real-world integration for delivering notifications. It is widely used and demonstrates the ability to interact with third-party APIs.
