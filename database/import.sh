#!/bin/bash

# Database import script for SupplySight
# This script sets up the database schema and imports sample data

set -e  # Exit on any error

# Database connection parameters
DB_NAME=${DB_NAME:-"supplysight"}
DB_USER=${DB_USER:-"postgres"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo "🚀 Setting up SupplySight database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found. Please install PostgreSQL client tools."
    exit 1
fi

# Create database if it doesn't exist
echo "📊 Creating database '$DB_NAME' if it doesn't exist..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists or creation failed"

# Import schema
echo "🏗️  Importing database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "database/schema.sql"

# Import sample data
echo "📥 Importing sample data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "database/data.sql"

echo "✅ Database setup complete!"
echo "📊 Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo "🌐 Host: $DB_HOST:$DB_PORT"

# Verify setup by counting products
echo "🔍 Verifying setup..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as product_count FROM products;"
