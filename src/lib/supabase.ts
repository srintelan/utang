// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key Supabase Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface Database {
  public: {
    Tables: {
      debtors: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          user_id?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          debtor_id: string;
          description: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          debtor_id: string;
          description: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          debtor_id?: string;
          description?: string;
          amount?: number;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          debtor_id: string;
          amount: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          debtor_id: string;
          amount: number;
          date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          debtor_id?: string;
          amount?: number;
          date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}