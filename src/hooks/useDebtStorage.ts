import { useState, useEffect } from 'react';
import { Debtor, Debt, Payment } from '../types/debt';
import { supabase } from '../lib/supabase';

export const useDebtStorage = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDebtors = async () => {
    try {
      setLoading(true);

      const { data: debtorsData, error: debtorsError } = await supabase
        .from('debtors')
        .select('*')
        .order('created_at', { ascending: false });

      if (debtorsError) throw debtorsError;

      const debtorsWithDetails = await Promise.all(
        (debtorsData || []).map(async (debtor) => {
          const { data: debtsData } = await supabase
            .from('debts')
            .select('*')
            .eq('debtor_id', debtor.id)
            .order('created_at', { ascending: false });

          const { data: paymentsData } = await supabase
            .from('payments')
            .select('*')
            .eq('debtor_id', debtor.id)
            .order('payment_date', { ascending: false });

          return {
            id: debtor.id,
            name: debtor.name,
            createdAt: debtor.created_at,
            debts: (debtsData || []).map((debt) => ({
              id: debt.id,
              description: debt.description,
              amount: parseFloat(debt.amount as any),
            })),
            payments: (paymentsData || []).map((payment) => ({
              id: payment.id,
              amount: parseFloat(payment.amount as any),
              date: payment.payment_date,
              notes: payment.notes || undefined,
            })),
          };
        })
      );

      setDebtors(debtorsWithDetails);
    } catch (error) {
      console.error('Error loading debtors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebtors();
  }, []);

  const addDebtor = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('debtors')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newDebtor: Debtor = {
          id: data.id,
          name: data.name,
          debts: [],
          payments: [],
          createdAt: data.created_at,
        };
        setDebtors([newDebtor, ...debtors]);
      }
    } catch (error) {
      console.error('Error adding debtor:', error);
    }
  };

  const addDebt = async (debtorId: string, description: string, amount: number) => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .insert([{ debtor_id: debtorId, description, amount }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newDebt: Debt = {
          id: data.id,
          description: data.description,
          amount: parseFloat(data.amount as any),
        };

        setDebtors(
          debtors.map((debtor) =>
            debtor.id === debtorId
              ? { ...debtor, debts: [newDebt, ...debtor.debts] }
              : debtor
          )
        );
      }
    } catch (error) {
      console.error('Error adding debt:', error);
    }
  };

  const addPayment = async (debtorId: string, amount: number, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{ debtor_id: debtorId, amount, notes: notes || null }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPayment: Payment = {
          id: data.id,
          amount: parseFloat(data.amount as any),
          date: data.payment_date,
          notes: data.notes || undefined,
        };

        setDebtors(
          debtors.map((debtor) =>
            debtor.id === debtorId
              ? { ...debtor, payments: [newPayment, ...debtor.payments] }
              : debtor
          )
        );
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const deleteDebtor = async (debtorId: string) => {
    try {
      const { error } = await supabase
        .from('debtors')
        .delete()
        .eq('id', debtorId);

      if (error) throw error;

      setDebtors(debtors.filter((d) => d.id !== debtorId));
    } catch (error) {
      console.error('Error deleting debtor:', error);
    }
  };

  const deleteDebt = async (debtorId: string, debtId: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId);

      if (error) throw error;

      setDebtors(
        debtors.map((debtor) =>
          debtor.id === debtorId
            ? { ...debtor, debts: debtor.debts.filter((d) => d.id !== debtId) }
            : debtor
        )
      );
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  const deletePayment = async (debtorId: string, paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      setDebtors(
        debtors.map((debtor) =>
          debtor.id === debtorId
            ? { ...debtor, payments: debtor.payments.filter((p) => p.id !== paymentId) }
            : debtor
        )
      );
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return {
    debtors,
    loading,
    addDebtor,
    addDebt,
    addPayment,
    deleteDebtor,
    deleteDebt,
    deletePayment,
  };
};
