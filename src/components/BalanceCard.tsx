import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  income: number;
  expense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ totalBalance, income, expense }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg mb-6 text-center">
      <h3 className="text-sm uppercase tracking-wider opacity-80 mb-1 text-white">
        Balance Total
      </h3>
      <h1 className="text-4xl font-extrabold text-white">${totalBalance.toFixed(2)}</h1>
      
      <div className="flex justify-between mt-4 px-4">
        <div className="text-left">
          <span className="flex items-center gap-1 text-green-200 text-sm">
            <TrendingUp size={16} /> Ingresos
          </span>
          <p className="font-bold text-lg text-white">+${income.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <span className="flex items-center gap-1 text-red-200 text-sm justify-end">
            <TrendingDown size={16} /> Gastos
          </span>
          <p className="font-bold text-lg text-white">-${Math.abs(expense).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;