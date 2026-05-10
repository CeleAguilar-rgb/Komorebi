import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, X, Heart } from 'lucide-react';
import '../styles/LoginManager.css';

const LoginManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Escuchar si ya estamos logeadas
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert("Credenciales incorrectas. Revisa el correo y la clave. ✨");
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE (Esquina Superior Derecha) */}
      <motion.button 
        className="lock-button-float"
        onClick={user ? () => signOut(auth) : () => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {user ? <Unlock size={24} /> : <Lock size={24} />}
      </motion.button>

      {/* MODAL DE LOGIN */}
      <AnimatePresence>
        {isOpen && (
          <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <motion.div 
              className="login-modal-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-x" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>

              <div className="login-header">
                <Heart fill="var(--cherry-blossom)" color="var(--cherry-blossom)" />
                <h3>Entrada al Buzón</h3>
                <p>Solo para nosotras dos</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <input 
                  type="email" 
                  placeholder="Correo mágico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn-save">Entrar ✨</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginManager;