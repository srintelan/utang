import { Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface StatisticsPanelProps {
  totalDebtors: number;
  totalDebt: number;
  totalPaid: number;
  totalRemaining: number;
  overallPercentage: number;
}

export const StatisticsPanel = ({
  totalDebtors,
  totalDebt,
  totalPaid,
  totalRemaining,
  overallPercentage,
}: StatisticsPanelProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <DollarSign size={28} />
        Ringkasan Total Hutang
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Debitur</p>
              <p className="text-2xl font-bold">{totalDebtors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/30 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Hutang</p>
              <p className="text-xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/30 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Dibayar</p>
              <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/30 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Sisa Hutang</p>
              <p className="text-xl font-bold">{formatCurrency(totalRemaining)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress Pembayaran Keseluruhan</span>
          <span className="text-lg font-bold">{overallPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-xs opacity-75">
          {totalDebt > 0 ? (
            <span>
              Sudah dibayar {formatCurrency(totalPaid)} dari {formatCurrency(totalDebt)}
            </span>
          ) : (
            <span>Belum ada data hutang</span>
          )}
        </div>
      </div>
    </div>
  );
};
