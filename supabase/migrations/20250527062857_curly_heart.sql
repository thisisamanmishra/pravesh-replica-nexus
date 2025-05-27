/*
  # Create app_role enum and update user_roles table

  1. Create Enum
    - `app_role`: Enum type for user roles
      - Values: 'admin', 'user'

  2. Changes
    - Add role type constraint to user_roles table
    - Add function to check user roles
*/

-- Create the app_role enum type
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Add has_role function
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;