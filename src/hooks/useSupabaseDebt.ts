// src/hooks/useSupabaseDebt.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Debtor } from '../types/debt';

export const useSupabaseDebt = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all debtors with their debts and payments
  const fetchDebtors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch debtors
      const { data: debtorsData, error: debtorsError } = await supabase
        .from('debtors')
        .select('*')
        .order('created_at', { ascending: false });

      if (debtorsError) throw debtorsError;

      if (!debtorsData || debtorsData.length === 0) {
        setDebtors([]);
        setLoading(false);
        return;
      }

      // Fetch all debts
      const { data: debtsData, error: debtsError } = await supabase
        .from('debts')
        .select('*')
        .order('created_at', { ascending: true });

      if (debtsError) throw debtsError;

      // Fetch all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Combine data
      const combinedDebtors: Debtor[] = debtorsData.map(debtor => ({
        id: debtor.id,
        name: debtor.name,
        createdAt: debtor.created_at,
        debts: (debtsData || [])
          .filter(debt => debt.debtor_id === debtor.id)
          .map(debt => ({
            id: debt.id,
            description: debt.description,
            amount: debt.amount,
          })),
        payments: (paymentsData || [])
          .filter(payment => payment.debtor_id === debtor.id)
          .map(payment => ({
            id: payment.id,
            amount: payment.amount,
            date: payment.date,
            notes: payment.notes || undefined,
          })),
      }));

      setDebtors(combinedDebtors);
    } catch (err) {
      console.error('Error fetching debtors:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  const addDebtor = async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('debtors')
        .insert([{ name, user_id: user.id }]);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error adding debtor:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addDebt = async (debtorId: string, description: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('debts')
        .insert([{ debtor_id: debtorId, description, amount }]);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error adding debt:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addPayment = async (debtorId: string, amount: number, notes?: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{ 
          debtor_id: debtorId, 
          amount, 
          notes: notes || null,
          date: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error adding payment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteDebtor = async (debtorId: string) => {
    try {
      const { error } = await supabase
        .from('debtors')
        .delete()
        .eq('id', debtorId);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error deleting debtor:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteDebt = async (debtorId: string, debtId: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error deleting debt:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deletePayment = async (debtorId: string, paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;
      await fetchDebtors();
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    debtors,
    loading,
    error,
    addDebtor,
    addDebt,
    addPayment,
    deleteDebtor,
    deleteDebt,
    deletePayment,
    refreshData: fetchDebtors,
  };
};
