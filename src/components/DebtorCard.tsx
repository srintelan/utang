const DebtorCard = ({ 
  debtor, 
  onAddDebt, 
  onAddPayment, 
  onDeleteDebtor, 
  onDeleteDebt, 
  onDeletePayment 
}: {
  debtor: Debtor;
  onAddDebt: (debtorId: string, description: string, amount: number) => void;
  onAddPayment: (debtorId: string, amount: number, notes?: string) => void;
  onDeleteDebtor: (debtorId: string) => void;
  onDeleteDebt: (debtorId: string, debtId: string) => void;
  onDeletePayment: (debtorId: string, paymentId: string) => void;
}) => {
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
          onClick={() => setIsE
