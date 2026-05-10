import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { motion, AnimatePresence } from "framer-motion";
import { PenLine, X, Heart, Send } from "lucide-react";
import "../styles/Letters.css";

const Letters = () => {
  //Usuario
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [letters, setLetters] = useState([]);
  const [newLetter, setNewLetter] = useState({
    title: "",
    content: "",
    signature: "",
  });
  useEffect(() => {
    const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLetters(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveLetter = async () => {
    if (!newLetter.title || !newLetter.content)
      return alert("¡Escribe algo primero! 🌸");

    try {
      await addDoc(collection(db, "letters"), {
        ...newLetter,
        date: new Date().toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        createdAt: new Date(),
      });
      setNewLetter({ title: "", content: "", signature: "" }); // Limpiar
      setShowWriteModal(false);
    } catch (error) {
      console.error("Error guardando carta:", error);
    }
  };

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showWriteModal, setShowWriteModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="letters-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="letters-header">
        <h2>Buzón de Destellos</h2>
        <p>Palabras que el viento no se lleva</p>
      </header>

      <motion.div className="letters-grid" variants={containerVariants}>
        {letters.map((letter) => (
          <motion.div
            key={letter.id}
            className="envelope-wrapper"
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => setSelectedLetter(letter)}
          >
            <div className="envelope">
              <div className="envelope-flap"></div>
              <div className="envelope-body">
                <div className="heart-seal">
                  <Heart
                    size={18}
                    fill="var(--cherry-dark)"
                    color="var(--cherry-dark)"
                  />
                </div>
                <div className="envelope-text">
                  <span className="env-date">{letter.date}</span>
                  <p className="env-title">{letter.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {user && (
        <motion.button
          className="add-btn-float"
          onClick={() => setShowWriteModal(true)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <PenLine size={30} />
        </motion.button>
      )}
      <AnimatePresence>
        {selectedLetter && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              className="letter-paper-modal"
              initial={{ y: 100, opacity: 0, rotate: -3 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 100, opacity: 0, rotate: 3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-x"
                onClick={() => setSelectedLetter(null)}
              >
                <X size={24} />
              </button>

              <div className="paper-content">
                <div className="paper-header">
                  <span>{selectedLetter.date}</span>
                </div>
                <div className="paper-body">{selectedLetter.content}</div>
                <div className="paper-footer">{selectedLetter.signature}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWriteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowWriteModal(false)}
          >
            <motion.div
              className="write-letter-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-x"
                onClick={() => setShowWriteModal(false)}
              >
                <X size={24} />
              </button>

              <div className="write-form-header">
                <h3>Nueva Carta</h3>
                <p>Escribe desde el corazón</p>
              </div>

              <div className="write-form-body">
                <input
                  type="text"
                  placeholder="Título del momento (ej. Nuestra tarde...)"
                  className="write-input-title"
                  value={newLetter.title}
                  onChange={(e) =>
                    setNewLetter({ ...newLetter, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Escribe tu carta aquí..."
                  className="write-textarea"
                  rows="8"
                  value={newLetter.content}
                  onChange={(e) =>
                    setNewLetter({ ...newLetter, content: e.target.value })
                  }
                ></textarea>

                <div className="write-form-footer">
                  <input
                    type="text"
                    placeholder="Firma (Tu nombre)"
                    className="write-input-sig"
                    value={newLetter.signature}
                    onChange={(e) =>
                      setNewLetter({ ...newLetter, signature: e.target.value })
                    }
                  />

                  <motion.button
                    className="send-letter-btn"
                    onClick={handleSaveLetter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} /> Guardar Carta
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Letters;
