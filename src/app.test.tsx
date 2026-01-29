import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('lucide-react', () => ({
  Wallet: () => <div data-testid="icon" />,
  TrendingUp: () => <div data-testid="icon" />,
  TrendingDown: () => <div data-testid="icon" />,
  Plus: () => <div data-testid="icon-plus" />,
  Trash2: () => <div data-testid="icon" />,
  AlertCircle: () => <div data-testid="icon" />
}));

describe('Expense Tracker App', () => {

  it('Debería mostrar el título EcoTracker y el Balance', () => {
    render(<App />);
    expect(screen.getByText('EcoTracker')).toBeInTheDocument();
    expect(screen.getByText('Balance Total')).toBeInTheDocument();
  });

  // --- CORRECCIÓN AQUÍ ---
  it('Debería mostrar error rojo si el formulario está vacío', () => {
    render(<App />);
    
    const buttons = screen.getAllByRole('button');
    const addButton = buttons[buttons.length - 1];
    
    fireEvent.click(addButton);
    
    // CAMBIO: Usamos "getAllByText" porque el mensaje aparece 2 veces
    const errors = screen.getAllByText('Por favor, complete todos los campos.');
    
    // Verificamos que hayamos encontrado al menos uno
    expect(errors.length).toBeGreaterThan(0);
    // Y verificamos que el primero esté visible
    expect(errors[0]).toBeInTheDocument();
  });
  // -----------------------

  it('Debería permitir escribir en los inputs', () => {
    render(<App />);
    const conceptInput = screen.getByPlaceholderText(/Concepto/i);
    const amountInput = screen.getByPlaceholderText(/Monto/i);
    
    fireEvent.change(conceptInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    
    expect(conceptInput).toHaveValue('Test');
    expect(amountInput).toHaveValue(100);
  });
});