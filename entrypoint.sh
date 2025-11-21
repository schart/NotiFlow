#!/bin/sh

# Wait for Postgres to be ready, using its service name 'postgres'
until nc -z postgres 5432; do
  echo "Waiting for Postgres..."
  sleep 2
done

echo "Postgres is up - running migrations"

# 1. Apply Prisma migrations to create tables
npx prisma migrate deploy --preview-feature

# 2. Generate Prisma client (This is required for the application code)
npx prisma generate

# Start your app (worker + main)
exec "$@"