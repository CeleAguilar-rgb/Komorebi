import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, X, Heart, Send } from "lucide-react";
import "../styles/Letters.css";

const Letters = () => {
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

  const [letters] = useState([
    {
      id: 1,
      date: "10 de Agosto, 2023",
      title: "El inicio de todo",
      content:
        "Todavía me acuerdo de cómo estaba el cielo ese día. No sabía que mi vida estaba a punto de cambiar por completo. Gracias por aparecer y llenar todo de color.",
      signature: "Con amor, Celeste",
    },
    {
      id: 2,
      date: "25 de Diciembre, 2023",
      title: "Nuestra primera Navidad",
      content:
        "Ver las luces de la ciudad contigo fue el mejor regalo. No necesito nada más si estás tú al lado del arbolito.",
      signature: "Tu persona favorita",
    },
  ]);

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


      <motion.button
        className="add-btn-float"
        onClick={() => setShowWriteModal(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <PenLine size={30} />
      </motion.button>

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
                />
                <textarea
                  placeholder="Escribe tu carta aquí..."
                  className="write-textarea"
                  rows="8"
                ></textarea>
                <div className="write-form-footer">
                  <input
                    type="text"
                    placeholder="Firma (Tu nombre)"
                    className="write-input-sig"
                  />
                  <motion.button
                    className="send-letter-btn"
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
