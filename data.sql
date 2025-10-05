-- HAPUS SEMUA TABLE LAMA (HATI-HATI: Data akan hilang!)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS debts CASCADE;
DROP TABLE IF EXISTS debtors CASCADE;

-- BUAT ULANG TABLES TANPA FOREIGN KEY KE AUTH.USERS
-- Create debtors table (tanpa foreign key ke auth.users)
CREATE TABLE debtors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT DEFAULT 'default_user'
);

-- Create debts table
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_id UUID REFERENCES debtors(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_id UUID REFERENCES debtors(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security untuk development
ALTER TABLE debtors DISABLE ROW LEVEL SECURITY;
ALTER TABLE debts DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Create indexes untuk performance
CREATE INDEX idx_debtors_user_id ON debtors(user_id);
CREATE INDEX idx_debts_debtor_id ON debts(debtor_id);
CREATE INDEX idx_payments_debtor_id ON payments(debtor_id);

-- Verifikasi tables sudah dibuat
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('debtors', 'debts', 'payments');