interface Debt {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

interface Debtor {
  id: string;
  name: string;
  debts: Debt[];
  payments: Payment[];
  createdAt: string;
}
