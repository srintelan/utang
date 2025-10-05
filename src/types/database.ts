export interface Database {
  public: {
    Tables: {
      debtors: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          debtor_id: string;
          description: string;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          debtor_id: string;
          description: string;
          amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          debtor_id?: string;
          description?: string;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          debtor_id: string;
          amount: number;
          payment_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          debtor_id: string;
          amount: number;
          payment_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          debtor_id?: string;
          amount?: number;
          payment_date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
