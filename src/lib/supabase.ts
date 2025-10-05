// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key Supabase Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iivfobacquzfbxesxffn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdmZvYmFjcXV6ZmJ4ZXN4ZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjkxMTksImV4cCI6MjA3NTI0NTExOX0.romQs2uPwVBlUqnLua5GxhjGmYowaxHWMR-9mg1l0XY';

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