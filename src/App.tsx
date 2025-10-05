import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useSupabaseDebt } from './hooks/useSupabaseDebt';
import { calculateGlobalStats } from './utils/calculations';
import { StatisticsPanel } from './components/StatisticsPanel';
import { AddDebtorForm } from './components/AddDebtorForm';
import { DebtorCard } from './components/DebtorCard';

function App() {
  const {
    debtors,
    addDebtor,
    addDebt,
    addPayment,
    deleteDebtor,
    deleteDebt,
    deletePayment,
  } = useSupabaseDebt();

  

  const [searchTerm, setSearchTerm] = useState('');

  const stats = calculateGlobalStats(debtors);

  const filteredDebtors = debtors.filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Sistem Pencatatan Hutang</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Kelola dan lacak semua hutang dengan mudah dan terorganisir
          </p>
        </div>

        <StatisticsPanel
          totalDebtors={stats.totalDebtors}
          totalDebt={stats.totalDebt}
          totalPaid={stats.totalPaid}
          totalRemaining={stats.totalRemaining}
          overallPercentage={stats.overallPercentage}
        />

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari debitur..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="mb-6">
          <AddDebtorForm onAdd={addDebtor} />
        </div>

        {filteredDebtors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? 'Tidak ada debitur yang cocok dengan pencarian'
                : 'Belum ada debitur. Tambahkan debitur baru untuk memulai!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDebtors.map((debtor) => (
              <DebtorCard
                key={debtor.id}
                debtor={debtor}
                onAddDebt={addDebt}
                onAddPayment={addPayment}
                onDeleteDebtor={deleteDebtor}
                onDeleteDebt={deleteDebt}
                onDeletePayment={deletePayment}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data disimpan secara lokal di browser Anda</p>
        </div>
      </div>
    </div>
  );
}

export default App;
