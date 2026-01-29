import { useState } from 'react';
import { Wallet } from 'lucide-react';

// CORRECCIÓN 1: Quitamos las llaves { } porque tus archivos usan "export default"
import BalanceCard from './components/BalanceCard'; 
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, text: "Sueldo", amount: 1500 },
    { id: 2, text: "Alquiler", amount: -400 },
    { id: 3, text: "Supermercado", amount: -150 },
  ]);

  const addTransaction = (text: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      text,
      amount,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const total = transactions.reduce((acc, item) => acc + item.amount, 0);
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, item) => acc + item.amount, 0);
  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-blue-500" /> EcoTracker
          </h2>
          <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
            Dev Mode
          </span>
        </div>

        {/* CORRECCIÓN 2: Usamos los nombres de props que esperan tus componentes */}
        <BalanceCard 
            totalBalance={total} 
            income={income} 
            expense={expense} 
        />
        
        <TransactionList 
          transactions={transactions} 
          deleteTransaction={deleteTransaction} 
        />
        
        <TransactionForm addTransaction={addTransaction} />

      </div>
    </div>
  );
}

export default App;