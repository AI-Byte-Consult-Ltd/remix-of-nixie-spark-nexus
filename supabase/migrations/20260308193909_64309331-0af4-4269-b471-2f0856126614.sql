
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.support_inquiries;

-- Create a tighter policy that validates required fields are not empty
CREATE POLICY "Anyone can submit inquiries with valid data"
ON public.support_inquiries
FOR INSERT
TO public
WITH CHECK (
  name IS NOT NULL AND name <> '' AND
  email IS NOT NULL AND email <> '' AND
  inquiry IS NOT NULL AND inquiry <> ''
);
