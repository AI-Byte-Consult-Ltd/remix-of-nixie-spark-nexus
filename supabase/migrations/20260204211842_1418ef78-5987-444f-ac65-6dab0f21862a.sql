-- Create table for support inquiries
CREATE TABLE public.support_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.support_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries (public contact form)
CREATE POLICY "Anyone can submit inquiries" 
ON public.support_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_support_inquiries_updated_at
BEFORE UPDATE ON public.support_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();