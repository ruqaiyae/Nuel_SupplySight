# SupplySight Server

GraphQL server for SupplySight with PostgreSQL integration.

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the server directory with your database configuration:

   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=supplysight
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=4000
   NODE_ENV=development
   ```

3. **Create PostgreSQL database:**

   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE supplysight;

   # Exit psql
   \q
   ```

4. **Initialize database schema and data:**

   ```bash
   npm run init-db
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following tables:

- `warehouses` - Warehouse information
- `products` - Product inventory and demand data
- `kpis` - Historical key performance indicators

## API Endpoints

- GraphQL endpoint: `http://localhost:4000/graphql`
- GraphQL Playground: `http://localhost:4000/graphql` (in development)

## Development

- **Build:** `npm run build`
- **Start production:** `npm start`
- **Database initialization:** `npm run init-db`

## Environment Variables

| Variable      | Description         | Default       |
| ------------- | ------------------- | ------------- |
| `DB_USER`     | PostgreSQL username | `postgres`    |
| `DB_HOST`     | PostgreSQL host     | `localhost`   |
| `DB_NAME`     | Database name       | `supplysight` |
| `DB_PASSWORD` | PostgreSQL password | `password`    |
| `DB_PORT`     | PostgreSQL port     | `5432`        |
| `PORT`        | Server port         | `4000`        |
| `NODE_ENV`    | Environment         | `development` |
