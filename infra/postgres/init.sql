-- Create the user (if not exists)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'micro_user') THEN
      CREATE ROLE micro_user WITH REPLICATION LOGIN PASSWORD 'micro_pass';
   END IF;
END
$$;

-- Create databases
CREATE DATABASE auth_db OWNER micro_user;
CREATE DATABASE stocks_db OWNER micro_user;
CREATE DATABASE portfolio_db OWNER micro_user;
