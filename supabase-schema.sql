-- =====================================================
-- CULT OF ATHENA BLADES - DATABASE SCHEMA
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor
-- This will create all tables, storage buckets, and RLS policies
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (true);

-- Admin full access for categories
CREATE POLICY "Enable all access for authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for products
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- Admin full access for products
CREATE POLICY "Enable all access for authenticated users" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for published blog posts
CREATE POLICY "Enable read access for published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Admin full access for blog posts
CREATE POLICY "Enable all access for authenticated users" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for approved reviews
CREATE POLICY "Enable read access for approved reviews" ON reviews
  FOR SELECT USING (approved = true);

-- Public can create reviews
CREATE POLICY "Enable insert access for all users" ON reviews
  FOR INSERT WITH CHECK (true);

-- Admin full access for reviews
CREATE POLICY "Enable all access for authenticated users" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Public can create orders
CREATE POLICY "Enable insert access for all users" ON orders
  FOR INSERT WITH CHECK (true);

-- Admin full access for orders
CREATE POLICY "Enable all access for authenticated users" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin full access for order items
CREATE POLICY "Enable all access for authenticated users" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Public can create contact submissions
CREATE POLICY "Enable insert access for all users" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admin full access for contact submissions
CREATE POLICY "Enable all access for authenticated users" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('categories', 'categories', true),
  ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Public read access for products images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload products images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Storage policies for categories bucket
CREATE POLICY "Public read access for categories images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'categories');

CREATE POLICY "Authenticated users can upload categories images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- Storage policies for blog bucket
CREATE POLICY "Public read access for blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog' AND auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Swords', 'swords', 'Medieval and historical swords'),
  ('Katanas', 'katanas', 'Authentic Japanese craftsmanship'),
  ('Daggers', 'daggers', 'Precision and elegance combined')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================
-- All tables, policies, and storage buckets are now set up.
-- You can now create an admin user through Supabase Auth.
-- =====================================================

