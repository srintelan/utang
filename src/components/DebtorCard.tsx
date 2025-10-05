import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Calendar } from 'lucide-react';
import { Debtor } from '../types/debt';
import { calculateTotalDebt, calculateTotalPayments, calculateRemainingDebt, calculatePaymentPercentage, formatCurrency, formatDateLong } from '../utils/calculations';

interface DebtorCardProps {
  debtor: Debtor;
  onAddDebt: (debtorId: string, description: string, amount: number) => void;
  onAddPayment: (debtorId: string, amount: number, notes?: string) => void;
  onDeleteDebtor: (debtorId: string) => void;
  onDeleteDebt: (debtorId: string, debtId: string) => void;
  onDeletePayment: (debtorId: string, paymentId: string) => void;
}

export const DebtorCard = ({ debtor, onAddDebt, onAddPayment, onDeleteDebtor, onDeleteDebt, onDeletePayment }: DebtorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [debtDescription, setDebtDescription] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const totalDebt = calculateTotalDebt(debtor);
  const totalPaid = calculateTotalPayments(debtor);
  const remaining = calculateRemainingDebt(debtor);
  const percentage = calculatePaymentPercentage(debtor);

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (debtDescription && debtAmount) {
      onAddDebt(debtor.id, debtDescription, parseFloat(debtAmount));
      setDebtDescription('');
      setDebtAmount('');
      setShowDebtForm(false);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount) {
      onAddPayment(debtor.id, parseFloat(paymentAmount), paymentNotes);
      setPaymentAmount('');
      setPaymentNotes('');
      setShowPaymentForm(false);
    }
  };

  // Helper function untuk format tanggal dengan fallback
  const safeFormatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      return formatDateLong(dateString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Format tanggal tidak valid';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{debtor.name}</h3>
          <button
            onClick={() => onDeleteDebtor(debtor.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Hapus Debtor"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Hutang:</span>
            <span className="font-semibold text-red-600">{formatCurrency(totalDebt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Dibayar:</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sisa Hutang:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(remaining)}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress Pembayaran</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setShowDebtForm(!showDebtForm)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            <Plus size={16} />
            Tambah Hutang
          </button>
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            <Plus size={16} />
            Bayar
          </button>
        </div>

        {showDebtForm && (
          <form onSubmit={handleAddDebt} className="bg-red-50 p-3 rounded-md mb-3 space-y-2">
            <input
              type="text"
              value={debtDescription}
              onChange={(e) => setDebtDescription(e.target.value)}
              placeholder="Deskripsi hutang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
            <input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
              placeholder="Jumlah"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
              min="0"
              step="0.01"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowDebtForm(false)}
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {showPaymentForm && (
          <form onSubmit={handleAddPayment} className="bg-green-50 p-3 rounded-md mb-3 space-y-2">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Jumlah pembayaran"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
              min="0"
              step="0.01"
            />
            <input
              type="text"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Catatan (opsional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={18} />
              Sembunyikan Detail
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              Lihat Detail ({debtor.debts?.length || 0} hutang, {debtor.payments?.length || 0} pembayaran)
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Daftar Hutang:</h4>
              {!debtor.debts || debtor.debts.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Belum ada hutang</p>
              ) : (
                <div className="space-y-2">
                  {debtor.debts.map((debt) => (
                    <div key={debt.id} className="bg-red-50 p-3 rounded border border-red-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{debt.description || 'Tanpa deskripsi'}</p>
                          <p className="text-red-600 font-semibold text-lg">{formatCurrency(debt.amount || 0)}</p>
                        </div>
                        <button
                          onClick={() => onDeleteDebt(debtor.id, debt.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {debt.date && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar size={12} />
                          <span>{safeFormatDate(debt.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Riwayat Pembayaran:</h4>
              {!debtor.payments || debtor.payments.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Belum ada pembayaran</p>
              ) : (
                <div className="space-y-2">
                  {debtor.payments.map((payment) => (
                    <div key={payment.id} className="bg-green-50 p-3 rounded border border-green-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-green-600 font-semibold text-lg">{formatCurrency(payment.amount || 0)}</p>
                          {payment.notes && <p className="text-xs text-gray-600 italic mt-1">{payment.notes}</p>}
                        </div>
                        <button
                          onClick={() => onDeletePayment(debtor.id, payment.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {payment.date && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar size={12} />
                          <span>{safeFormatDate(payment.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
