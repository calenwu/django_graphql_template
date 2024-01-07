#!/bin/ash
export PGPASSWORD=${POSTGRES_PASSWORD}
export POSTGRES_USER=${POSTGRES_USER}
pg_dumpall -h postgres -U $POSTGRES_USER > /pg_data/backups$(date +\%Y\%m\%d\%H\%M\%S).dump