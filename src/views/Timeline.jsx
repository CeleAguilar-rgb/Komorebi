import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  Plus,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Film,
  Smile,
  Loader2,
} from "lucide-react";
import "../styles/Timeline.css";

const Timeline = () => {
  //Usuario
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Estados de UI
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados de Datos
  const [moments, setMoments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    mood: "✨ Mágico",
  });

  // Cambios en tiempo real
  useEffect(() => {
    const q = query(collection(db, "timeline"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMoments(docs);
    });
    return () => unsubscribe();
  }, []);

  // GUardado
  const handleSaveMemory = async () => {
    if (selectedFiles.length === 0)
      return alert("¡Sube al menos una foto o video! 🌸");
    if (!formData.title) return alert("Ponle un título a este momento ✨");

    setIsUploading(true);

    try {
      const mediaUrls = [];

      // Subir cada archivo al Storage
      for (const file of selectedFiles) {
        const fileRef = ref(storage, `timeline/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        mediaUrls.push({
          url: url,
          type: file.type.includes("video") ? "video" : "image",
        });
      }

      // Guardar registro en Firestore
      await addDoc(collection(db, "timeline"), {
        ...formData,
        media: mediaUrls,
        date: new Date().toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        createdAt: new Date(),
      });

      // Resetear todo
      setFormData({
        title: "",
        location: "",
        description: "",
        mood: "✨ Mágico",
      });
      setSelectedFiles([]);
      setIsUploading(false);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Algo falló al subir :( Intenta de nuevo");
      setIsUploading(false);
    }
  };

  const nextMedia = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) =>
      prev === selectedMemory.media.length - 1 ? 0 : prev + 1,
    );
  };
  const prevMedia = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) =>
      prev === 0 ? selectedMemory.media.length - 1 : prev - 1,
    );
  };

  return (
    <div className="timeline-page">
      <header className="timeline-header">
        <h2>Nuestra Historia</h2>
        <p>Cada pétalo es un recuerdo</p>
      </header>

      <div className="zigzag-container">
        <div className="center-line"></div>

        {moments.map((moment, index) => (
          <motion.div
            key={moment.id}
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => {
              setSelectedMemory(moment);
              setCurrentMediaIndex(0);
            }}
          >
            <div className="item-content">
              <div className="item-image-wrapper">
                <img src={moment.media[0].url} alt={moment.title} />
                {moment.media.length > 1 && (
                  <span className="media-count">
                    +{moment.media.length - 1}
                  </span>
                )}
              </div>
              <div className="item-info">
                <h3>{moment.title}</h3>
                <span className="item-date">{moment.date}</span>
              </div>
            </div>

            <div className="connector-dot">
              <Heart size={14} fill="currentColor" />
            </div>
          </motion.div>
        ))}
      </div>
      {user && (
        <button className="add-btn-float" onClick={() => setShowAddModal(true)}>
          <Plus size={32} />
        </button>
      )}
      {/* Modal detalle */}
      <AnimatePresence>
        {selectedMemory && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-x"
                onClick={() => setSelectedMemory(null)}
              >
                <X />
              </button>

              <div className="carousel-section">
                <div className="carousel-display">
                  {selectedMemory.media[currentMediaIndex].type === "video" ? (
                    <video
                      src={selectedMemory.media[currentMediaIndex].url}
                      controls
                    />
                  ) : (
                    <img src={selectedMemory.media[currentMediaIndex].url} />
                  )}
                </div>

                {selectedMemory.media.length > 1 && (
                  <>
                    <button className="arrow left" onClick={prevMedia}>
                      <ChevronLeft />
                    </button>
                    <button className="arrow right" onClick={nextMedia}>
                      <ChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="detail-info">
                <div className="meta-tags">
                  <span>
                    <Calendar size={14} /> {selectedMemory.date}
                  </span>
                  <span>
                    <MapPin size={14} /> {selectedMemory.location}
                  </span>
                </div>
                <h2>{selectedMemory.title}</h2>
                <p>{selectedMemory.description}</p>
                <div className="mood-tag">{selectedMemory.mood}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Añdir */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div
              className="modal-card add-form"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-x"
                onClick={() => setShowAddModal(false)}
              >
                <X />
              </button>
              <h3>Nuevo Recuerdo</h3>

              <div className="form-grid">
                <div
                  className="upload-box"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  {selectedFiles.length > 0 ? (
                    <div className="upload-status">
                      <Film size={32} />
                      <p>{selectedFiles.length} archivos listos</p>
                    </div>
                  ) : (
                    <>
                      <Camera size={40} />
                      <p>Seleccionar fotos y videos</p>
                    </>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    hidden
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  />
                </div>

                <div className="inputs-box">
                  <input
                    type="text"
                    placeholder="¿Cómo se llama este momento?"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <div className="row-inputs">
                    <input
                      type="text"
                      placeholder="Fecha"
                      onFocus={(e) => (e.target.type = "date")}
                    />
                    <input
                      type="text"
                      placeholder="Lugar"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <textarea
                    placeholder="Cuéntame toda la historia..."
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="row-inputs">
                    <select
                      value={formData.mood}
                      onChange={(e) =>
                        setFormData({ ...formData, mood: e.target.value })
                      }
                    >
                      <option value="✨ Mágico">✨ Mágico</option>
                      <option value="💖 Enamorada">💖 Enamorada</option>
                      <option value="😂 Divertido">😂 Divertido</option>
                      <option value="🏠 Acogedor">🏠 Acogedor</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="btn-save"
                onClick={handleSaveMemory}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex-center">
                    <Loader2 className="animate-spin" size={18} /> Subiendo...
                  </span>
                ) : (
                  "Guardar en Komorebi"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
