import { useState, useEffect } from 'react';
import { Debtor, Debt, Payment } from '../types/debt';

const STORAGE_KEY = 'debt_tracking_data';

export const useDebtStorage = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDebtors(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  const saveDebtors = (updatedDebtors: Debtor[]) => {
    setDebtors(updatedDebtors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDebtors));
  };

  const addDebtor = (name: string) => {
    const newDebtor: Debtor = {
      id: crypto.randomUUID(),
      name,
      debts: [],
      payments: [],
      createdAt: new Date().toISOString(),
    };
    saveDebtors([...debtors, newDebtor]);
  };

  const addDebt = (debtorId: string, description: string, amount: number) => {
    const updatedDebtors = debtors.map(debtor => {
      if (debtor.id === debtorId) {
        const newDebt: Debt = {
          id: crypto.randomUUID(),
          description,
          amount,
        };
        return { ...debtor, debts: [...debtor.debts, newDebt] };
      }
      return debtor;
    });
    saveDebtors(updatedDebtors);
  };

  const addPayment = (debtorId: string, amount: number, notes?: string) => {
    const updatedDebtors = debtors.map(debtor => {
      if (debtor.id === debtorId) {
        const newPayment: Payment = {
          id: crypto.randomUUID(),
          amount,
          date: new Date().toISOString(),
          notes,
        };
        return { ...debtor, payments: [...debtor.payments, newPayment] };
      }
      return debtor;
    });
    saveDebtors(updatedDebtors);
  };

  const deleteDebtor = (debtorId: string) => {
    saveDebtors(debtors.filter(d => d.id !== debtorId));
  };

  const deleteDebt = (debtorId: string, debtId: string) => {
    const updatedDebtors = debtors.map(debtor => {
      if (debtor.id === debtorId) {
        return { ...debtor, debts: debtor.debts.filter(d => d.id !== debtId) };
      }
      return debtor;
    });
    saveDebtors(updatedDebtors);
  };

  const deletePayment = (debtorId: string, paymentId: string) => {
    const updatedDebtors = debtors.map(debtor => {
      if (debtor.id === debtorId) {
        return { ...debtor, payments: debtor.payments.filter(p => p.id !== paymentId) };
      }
      return debtor;
    });
    saveDebtors(updatedDebtors);
  };

  return {
    debtors,
    addDebtor,
    addDebt,
    addPayment,
    deleteDebtor,
    deleteDebt,
    deletePayment,
  };
};
