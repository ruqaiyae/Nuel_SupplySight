# Database Setup for SupplySight

This directory contains the database setup files for the SupplySight application.

## Files

- **`schema.sql`** - Database schema (tables, indexes, constraints)
- **`data.sql`** - Sample data to populate the database
- **`import.sh`** - Automated database setup script

## Quick Setup

### Prerequisites

- PostgreSQL installed and running
- `psql` command-line tool available
- Database user with appropriate permissions

### Option 1: Automated Setup (Recommended)

```bash
# Make the script executable (if not already)
chmod +x import.sh

# Run the setup script
./import.sh

# Or with custom database parameters
DB_NAME=myapp DB_USER=myuser ./import.sh
```

### Option 2: Manual Setup

```bash
# Create database
createdb supplysight

# Import schema
psql -d supplysight -f schema.sql

# Import sample data
psql -d supplysight -f data.sql
```

## Environment Variables

You can customize the database connection by setting these environment variables:

- `DB_NAME` - Database name (default: "supplysight")
- `DB_USER` - Database user (default: "postgres")
- `DB_HOST` - Database host (default: "localhost")
- `DB_PORT` - Database port (default: "5432")

## Testing Connection

After setup, test the database connection:

```bash
cd ../server
npx ts-node src/test-db.ts
```

## Troubleshooting

- **Permission denied**: Ensure your database user has CREATE DATABASE privileges
- **Connection refused**: Check if PostgreSQL is running and accessible
- **psql not found**: Install PostgreSQL client tools for your OS

## Development Workflow

1. **First time**: Run `./import.sh` to set up the database
2. **Schema changes**: Update `schema.sql` and re-run the import script
3. **Data changes**: Update `data.sql` and re-run the import script
4. **Server**: Start the server with `npm run dev` (it will connect to existing database)
