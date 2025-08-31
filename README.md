# SupplySight - GraphQL Supply Chain Management

A modern supply chain management application built with GraphQL, React, and TypeScript.

## Features

- **Product Management**: Track inventory, SKUs, and demand across warehouses
- **Warehouse Management**: Monitor warehouse locations and capacities
- **Real-time KPIs**: Track stock levels and demand trends
- **GraphQL API**: Flexible data querying and mutations
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express, Apollo Server, GraphQL
- **Frontend**: React 19, TypeScript, Apollo Client, Tailwind CSS
- **Database**: PostgreSQL with proper indexing and ACID compliance

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the GraphQL server:**

   ```bash
   npm run dev:server
   ```

   Server will start at: http://localhost:4000/graphql

3. **Start the React client:**

   ```bash
   npm run dev:client
   ```

   Client will start at: http://localhost:5173

4. **Or run both simultaneously:**
   ```bash
   npm run dev
   ```

## GraphQL Schema

### Types

```graphql
type Warehouse {
  code: ID!
  name: String!
  city: String!
  country: String!
}

type Product {
  id: ID!
  name: String!
  sku: String!
  warehouse: String!
  stock: Int!
  demand: Int!
}

type KPI {
  date: String!
  stock: Int!
  demand: Int!
}
```

### Queries

- `products(search: String, status: String, warehouse: String)`: Get filtered products
- `warehouses`: Get all warehouses
- `kpis(range: String!)`: Get KPIs for specified time range

### Mutations

- `updateDemand(id: ID!, demand: Int!)`: Update product demand
- `transferStock(id: ID!, from: String!, to: String!, qty: Int!)`: Transfer stock between warehouses

## Sample Queries

### Get all products

```graphql
query {
  products {
    id
    name
    sku
    warehouse
    stock
    demand
  }
}
```

### Get low stock products

```graphql
query {
  products(status: "low_stock") {
    id
    name
    stock
    demand
  }
}
```

### Update product demand

```graphql
mutation {
  updateDemand(id: "P-1001", demand: 150) {
    id
    name
    demand
  }
}
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── apollo-client.ts # Apollo Client configuration
│   │   └── main.tsx       # Application entry point
│   └── package.json
├── server/                 # GraphQL backend
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   ├── schema.ts      # GraphQL schema
│   │   ├── resolvers.ts   # GraphQL resolvers
│   │   └── types.ts       # TypeScript types
│   └── package.json
└── database/               # Database schemas and data
    ├── schema.sql         # Database schema
    └── data.sql           # Sample data
```

## Development

### Adding New Features

1. **Update GraphQL Schema**: Modify `server/src/schema.ts`
2. **Implement Resolvers**: Add logic in `server/src/resolvers.ts`
3. **Update Frontend**: Modify React components in `client/src/`
4. **Test Queries**: Use GraphQL Playground at `/graphql`

### Database Integration

The current implementation uses in-memory data. To integrate with a real database:

1. Update `server/src/resolvers.ts` to use database queries
2. Add database connection logic in `server/src/index.ts`
3. Update environment variables for database credentials

## API Endpoints

- **GraphQL**: `POST /graphql` - Main GraphQL endpoint
- **Health Check**: Available through Apollo Server

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=4000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
