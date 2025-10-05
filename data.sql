-- Create debtors table
CREATE TABLE debtors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Enable Row Level Security
ALTER TABLE debtors ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for debtors table
CREATE POLICY "Users can view their own debtors"
  ON debtors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debtors"
  ON debtors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debtors"
  ON debtors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debtors"
  ON debtors FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for debts table
CREATE POLICY "Users can view debts of their debtors"
  ON debts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = debts.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert debts for their debtors"
  ON debts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = debts.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update debts of their debtors"
  ON debts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = debts.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete debts of their debtors"
  ON debts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = debts.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

-- Create policies for payments table
CREATE POLICY "Users can view payments of their debtors"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = payments.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for their debtors"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = payments.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments of their debtors"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = payments.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments of their debtors"
  ON payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM debtors
      WHERE debtors.id = payments.debtor_id
      AND debtors.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_debtors_user_id ON debtors(user_id);
CREATE INDEX idx_debts_debtor_id ON debts(debtor_id);
CREATE INDEX idx_payments_debtor_id ON payments(debtor_id);