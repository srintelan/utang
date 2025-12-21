import * as XLSX from 'xlsx';
import { Debtor } from '../types/debt';
import { calculateTotalDebt, calculateTotalPayments, calculateRemainingDebt, calculatePaymentPercentage, formatCurrency, formatDateLong } from './calculations';

export const exportToExcel = (debtors: Debtor[]) => {
  const workbook = XLSX.utils.book_new();

  const summaryData = [
    ['LAPORAN HUTANG'],
    ['Tanggal Export:', new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })],
    [],
    ['Total Debitur:', debtors.length],
    ['Total Hutang:', formatCurrency(debtors.reduce((sum, d) => sum + calculateTotalDebt(d), 0))],
    ['Total Dibayar:', formatCurrency(debtors.reduce((sum, d) => sum + calculateTotalPayments(d), 0))],
    ['Sisa Hutang:', formatCurrency(debtors.reduce((sum, d) => sum + calculateRemainingDebt(d), 0))],
    [],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

  const debtorSummaryData = [
    ['Nama Debitur', 'Total Hutang', 'Total Dibayar', 'Sisa Hutang', 'Progress (%)', 'Tanggal Dibuat']
  ];

  debtors.forEach(debtor => {
    const totalDebt = calculateTotalDebt(debtor);
    const totalPaid = calculateTotalPayments(debtor);
    const remaining = calculateRemainingDebt(debtor);
    const percentage = calculatePaymentPercentage(debtor);

    debtorSummaryData.push([
      debtor.name,
      totalDebt,
      totalPaid,
      remaining,
      percentage.toFixed(2),
      new Date(debtor.createdAt).toLocaleDateString('id-ID')
    ]);
  });

  const debtorSummarySheet = XLSX.utils.aoa_to_sheet(debtorSummaryData);
  XLSX.utils.book_append_sheet(workbook, debtorSummarySheet, 'Ringkasan Per Debitur');

  debtors.forEach(debtor => {
    const sheetName = debtor.name.substring(0, 30);
    const debtorData = [
      [`Debitur: ${debtor.name}`],
      [`Total Hutang: ${formatCurrency(calculateTotalDebt(debtor))}`],
      [`Total Dibayar: ${formatCurrency(calculateTotalPayments(debtor))}`],
      [`Sisa Hutang: ${formatCurrency(calculateRemainingDebt(debtor))}`],
      [],
      ['DAFTAR HUTANG'],
      ['Tanggal', 'Deskripsi', 'Jumlah']
    ];

    debtor.debts.forEach(debt => {
      debtorData.push([
        debt.date ? new Date(debt.date).toLocaleDateString('id-ID') : '-',
        debt.description,
        debt.amount
      ]);
    });

    debtorData.push([]);
    debtorData.push(['RIWAYAT PEMBAYARAN']);
    debtorData.push(['Tanggal', 'Jumlah', 'Catatan']);

    debtor.payments.forEach(payment => {
      debtorData.push([
        payment.date ? new Date(payment.date).toLocaleDateString('id-ID') : '-',
        payment.amount,
        payment.notes || '-'
      ]);
    });

    const debtorSheet = XLSX.utils.aoa_to_sheet(debtorData);

    try {
      XLSX.utils.book_append_sheet(workbook, debtorSheet, sheetName);
    } catch (error) {
      console.error(`Error creating sheet for ${debtor.name}:`, error);
    }
  });

  const allDebtsData = [
    ['Tanggal', 'Debitur', 'Deskripsi', 'Jumlah']
  ];

  debtors.forEach(debtor => {
    debtor.debts.forEach(debt => {
      allDebtsData.push([
        debt.date ? new Date(debt.date).toLocaleDateString('id-ID') : '-',
        debtor.name,
        debt.description,
        debt.amount
      ]);
    });
  });

  const allDebtsSheet = XLSX.utils.aoa_to_sheet(allDebtsData);
  XLSX.utils.book_append_sheet(workbook, allDebtsSheet, 'Semua Hutang');

  const allPaymentsData = [
    ['Tanggal', 'Debitur', 'Jumlah', 'Catatan']
  ];

  debtors.forEach(debtor => {
    debtor.payments.forEach(payment => {
      allPaymentsData.push([
        payment.date ? new Date(payment.date).toLocaleDateString('id-ID') : '-',
        debtor.name,
        payment.amount,
        payment.notes || '-'
      ]);
    });
  });

  const allPaymentsSheet = XLSX.utils.aoa_to_sheet(allPaymentsData);
  XLSX.utils.book_append_sheet(workbook, allPaymentsSheet, 'Semua Pembayaran');

  const fileName = `Laporan_Hutang_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
