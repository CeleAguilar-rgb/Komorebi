import { useState } from "react";
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
} from "lucide-react";
import "../styles/Timeline.css";

const Timeline = () => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const [moments] = useState([
    {
      id: 1,
      date: "14 Feb 2024",
      title: "Picnic bajo los Cerezos",
      location: "Parque Central",
      description:
        "Fue el día que decidimos adoptar a 'Mochi'. Realmente mágico ver cómo caían los pétalos mientras reíamos.",
      mood: "✨ Mágico",
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
        },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      ],
    },
    {
      id: 2,
      date: "20 Dic 2023",
      title: "Nuestra Primera Navidad",
      location: "Cabaña en el Bosque",
      description:
        "Hicimos chocolate caliente y vimos películas toda la noche bajo las mantas.",
      mood: "🏠 Acogedor",
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1544819667-97505c312431?q=80&w=800",
        },
      ],
    },
     {
      id: 3,
      date: "20 Dic 2023",
      title: "Nuestra Primera Navidad",
      location: "Cabaña en el Bosque",
      description:
        "Hicimos chocolate caliente y vimos películas toda la noche bajo las mantas.",
      mood: "🏠 Acogedor",
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1544819667-97505c312431?q=80&w=800",
        },
      ],
    }, {
      id: 4,
      date: "20 Dic 2023",
      title: "Nuestra Primera Navidad",
      location: "Cabaña en el Bosque",
      description:
        "Hicimos chocolate caliente y vimos películas toda la noche bajo las mantas.",
      mood: "🏠 Acogedor",
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1544819667-97505c312431?q=80&w=800",
        },
      ],
    },
  ]);

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

      <button className="add-btn-float" onClick={() => setShowAddModal(true)}>
        <Plus size={32} />
      </button>

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
                <div className="upload-box">
                  <Camera size={40} />
                  <p>Seleccionar fotos y videos</p>
                </div>

                <div className="inputs-box">
                  <input
                    type="text"
                    placeholder="¿Cómo se llama este momento?"
                  />
                  <div className="row-inputs">
                    <input
                      type="text"
                      placeholder="Fecha"
                      onFocus={(e) => (e.target.type = "date")}
                    />
                    <input type="text" placeholder="Lugar" />
                  </div>
                  <textarea
                    placeholder="Cuéntame toda la historia..."
                    rows="4"
                  />
                  <div className="row-inputs">
                    <select>
                      <option>¿Cómo te sientes?</option>
                      <option>✨ Mágico</option>
                      <option>💖 Enamorada</option>
                      <option>😂 Divertido</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="btn-save">Guardar en Komorebi</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
