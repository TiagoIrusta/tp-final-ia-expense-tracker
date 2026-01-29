import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Auth from './components/Auth';
import BalanceCard from './components/BalanceCard';
import { Wallet, LogOut, Pencil, Trash2, Plus, Save } from 'lucide-react'; // Agregamos iconos

interface Transaction {
  id: number;
  text: string;
  amount: number;
  user_id: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Estados para el formulario y edición
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); // ID que estamos editando

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchTransactions();
  }, [session]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTransactions(data);
  };

  // Función combinada: Crear o Actualizar
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !amount || !session) return;

    if (editingId) {
      // --- LOGICA DE UPDATE (Editar) ---
      const { error } = await supabase
        .from('transactions')
        .update({ text, amount: parseFloat(amount) })
        .eq('id', editingId);

      if (!error) {
        setTransactions(transactions.map(t => 
          t.id === editingId ? { ...t, text, amount: parseFloat(amount) } : t
        ));
        setEditingId(null); // Dejar de editar
      }
    } else {
      // --- LOGICA DE CREATE (Crear) ---
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ text, amount: parseFloat(amount), user_id: session.user.id }])
        .select();

      if (!error && data) {
        setTransactions([data[0], ...transactions]);
      }
    }
    // Limpiar form
    setText('');
    setAmount('');
  };

  // Función para cargar datos en el form
  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setText(t.text);
    setAmount(t.amount.toString());
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  const total = transactions.reduce((acc, item) => acc + item.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, item) => acc + item.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, item) => acc + item.amount, 0);

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-blue-500" /> EcoTracker
          </h2>
          <button onClick={() => supabase.auth.signOut()} className="text-xs text-red-400 border border-red-900 bg-red-900/20 px-3 py-1 rounded-full flex gap-1 hover:bg-red-900/40">
            <LogOut size={14}/> Salir
          </button>
        </div>

        <BalanceCard totalBalance={total} income={income} expense={expense} />

        {/* Formulario integrado (sirve para Crear y Editar) */}
        <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
          {editingId ? 'Editar Movimiento' : 'Agregar Movimiento'}
        </h3>
        <form onSubmit={handleSaveTransaction} className="flex flex-col gap-3 mb-6">
          <input 
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500"
            placeholder="Concepto" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500"
              placeholder="Monto" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
            <button 
              type="submit"
              className={`text-white p-3 rounded-lg font-bold flex items-center justify-center min-w-[60px] ${editingId ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {editingId ? <Save size={20} /> : <Plus size={20} />}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={() => { setEditingId(null); setText(''); setAmount(''); }}
                className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg"
              >
                X
              </button>
            )}
          </div>
        </form>

        {/* Lista manual (para incluir botón de editar) */}
        <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Historial</h3>
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {transactions.map((t) => (
            <li key={t.id} className={`flex justify-between items-center bg-gray-700/50 p-3 rounded-lg border-l-4 ${t.amount > 0 ? 'border-green-500' : 'border-red-500'} group`}>
              <div className="flex flex-col">
                <span className="font-medium">{t.text}</span>
                <span className="text-xs text-gray-400">${Math.abs(t.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Botón EDITAR */}
                <button onClick={() => startEditing(t)} className="text-gray-400 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={16} />
                </button>
                {/* Botón BORRAR */}
                <button onClick={() => deleteTransaction(t.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;