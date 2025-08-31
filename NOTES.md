# SupplySight Dashboard - Development Notes

## Development Decisions & Trade-offs

### Frontend Architecture

- **Vite**: Faster than CRA, trade-off: less mature ecosystem

### State Management

- **Apollo Client**: Better GraphQL integration, trade-off: larger bundle
- **Local state**: useState for filters/pagination, Apollo cache for server state
- **Trade-off**: Some state duplication between components

### Backend Design

- **PostgreSQL**: Production-ready, trade-off: complex setup

## What I'd Improve With More Time

### 1. Code Organization

- Break down ProductTable.tsx into smaller components

### 2. Performance

- Add proper loading states and skeleton screens

### 3. User Experience

- Add form validation
- Implement toast notifications