import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let error;
    
    if (isLogin) {
      // Intentar Iniciar Sesión
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    } else {
      // Intentar Registrarse
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
    }

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">EcoTracker</h1>
          <p className="text-gray-400">
            {isLogin ? 'Inicia sesión para ver tus gastos' : 'Crea una cuenta nueva'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
            <input
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              isLogin ? <LogIn size={20} /> : <UserPlus size={20} />
            )}
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button
            className="text-blue-400 hover:text-blue-300 font-bold ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}