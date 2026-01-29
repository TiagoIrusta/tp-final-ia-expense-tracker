import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { supabase } from './supabaseClient'; // Importamos la conexión
import BalanceCard from './components/BalanceCard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

function App() {
  // Inicializamos vacío porque ahora cargaremos los datos de la nube
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ☁️ 1. LEER: Cargar datos al iniciar la app
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    // Pedimos todo a la tabla 'transactions' ordenado por fecha
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando:', error);
    } else {
      setTransactions(data || []);
    }
  };

  // ☁️ 2. CREAR: Guardar en la nube
  const addTransaction = async (text: string, amount: number) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ text, amount }])
      .select(); // .select() es importante para que nos devuelva el ID nuevo

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else if (data) {
      // Agregamos el nuevo dato a la lista local para que se vea rápido
      setTransactions([data[0], ...transactions]);
    }
  };

  // ☁️ 3. BORRAR: Eliminar de la nube
  const deleteTransaction = async (id: number) => {
    // Primero borramos en la base de datos
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al borrar');
    } else {
      // Si salió bien, actualizamos la pantalla
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Cálculos (igual que antes)
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