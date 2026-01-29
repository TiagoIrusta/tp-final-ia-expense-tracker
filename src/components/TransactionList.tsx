import React from 'react';
import { Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  deleteTransaction: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, deleteTransaction }) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2 text-white">
        Historial
      </h3>
      <ul className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={`flex justify-between items-center bg-gray-700/50 p-3 rounded-lg border-l-4 ${
              transaction.amount < 0 ? "border-red-500" : "border-green-500"
            } hover:bg-gray-700 transition-colors group`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-white">{transaction.text}</span>
              <span className="text-xs text-gray-400">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`font-bold ${
                transaction.amount < 0 ? "text-red-400" : "text-green-400"
              }`}>
                {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount)}
              </span>
              
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TransactionList;