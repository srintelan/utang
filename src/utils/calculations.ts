import { Debtor } from '../types/debt';

export const calculateTotalDebt = (debtor: Debtor): number => {
  return debtor.debts.reduce((sum, debt) => sum + debt.amount, 0);
};

export const calculateTotalPayments = (debtor: Debtor): number => {
  return debtor.payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const calculateRemainingDebt = (debtor: Debtor): number => {
  return calculateTotalDebt(debtor) - calculateTotalPayments(debtor);
};

export const calculatePaymentPercentage = (debtor: Debtor): number => {
  const total = calculateTotalDebt(debtor);
  if (total === 0) return 0;
  const paid = calculateTotalPayments(debtor);
  return (paid / total) * 100;
};

export const calculateGlobalStats = (debtors: Debtor[]) => {
  const totalDebtors = debtors.length;
  const totalDebt = debtors.reduce((sum, d) => sum + calculateTotalDebt(d), 0);
  const totalPaid = debtors.reduce((sum, d) => sum + calculateTotalPayments(d), 0);
  const totalRemaining = totalDebt - totalPaid;
  const overallPercentage = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

  return {
    totalDebtors,
    totalDebt,
    totalPaid,
    totalRemaining,
    overallPercentage,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateLong = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// FORMAT 4: Sangat Detail dengan Timezone
// Output: "Senin, 7 Oktober 2025 pukul 15.30.45 WIB"
export const formatDateVeryLong = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false,
  }).format(date);
};
