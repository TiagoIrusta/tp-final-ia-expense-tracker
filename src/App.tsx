import { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';; // Importamos el tipo de sesión
import Auth from './components/Auth'; // Importamos tu nuevo componente
import BalanceCard from './components/BalanceCard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Escuchar cambios en la sesión (Login/Logout)
  useEffect(() => {
    // Revisar si ya hay una sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Suscribirse a cambios futuros
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Cargar datos solo si el usuario está autenticado
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setTransactions(data || []);
    }
  };

  const addTransaction = async (text: string, amount: number) => {
    // Agregamos el user_id para que el gasto pertenezca al usuario logueado
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ 
        text, 
        amount, 
        user_id: session?.user.id // Vinculamos el gasto al usuario
      }])
      .select();

    if (!error && data) {
      setTransactions([data[0], ...transactions]);
    }
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Cálculos de balance
  const total = transactions.reduce((acc, item) => acc + item.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((acc, item) => acc + item.amount, 0);
  const expense = transactions.filter((t) => t.amount < 0).reduce((acc, item) => acc + item.amount, 0);

  // --- LÓGICA DE RENDERIZADO ---
  
  // Si no hay sesión, mostramos la pantalla de Auth
  if (!session) {
    return <Auth />;
  }

  // Si hay sesión, mostramos la App completa
  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-blue-500" /> EcoTracker
          </h2>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1 text-xs text-red-400 bg-red-900/20 border border-red-900/50 px-3 py-1 rounded-full hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>

        <div className="mb-4 text-center">
          <span className="text-xs text-gray-500">Sesión iniciada: {session.user.email}</span>
        </div>

        <BalanceCard totalBalance={total} income={income} expense={expense} />
        <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
        <TransactionForm addTransaction={addTransaction} />

      </div>
    </div>
  );
}

export default App;