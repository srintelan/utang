export interface Debt {
  id: string;
  description: string;
  amount: number;
  date: string; // Tambahkan field date
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Debtor {
  id: string;
  name: string;
  debts: Debt[];
  payments: Payment[];
  createdAt: string;
}
