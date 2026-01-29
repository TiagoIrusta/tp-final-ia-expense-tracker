import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  addTransaction: (text: string, amount: number) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ addTransaction }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !amount) {
      setErrorText('Por favor, complete todos los campos.');
      return;
    }
    if (Number(amount) === 0) {
      setErrorText('Por favor, ingrese un monto válido.');
      return;
    }
    addTransaction(text, Number(amount));
    setText('');
    setAmount('');
    setErrorText('');
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-3 text-white">Agregar Movimiento</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Concepto (ej. Pizza)"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
          {errorText && (
            <p className="text-red-500 text-sm mt-1">{errorText}</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto (- gastos, + ingresos)"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
          {errorText && (
            <p className="text-red-500 text-sm mt-1">{errorText}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-transform active:scale-95 flex items-center justify-center min-w-[60px]"
        >
          <Plus size={24} />
        </button>
      </form>
    </>
  );
};

export default TransactionForm;