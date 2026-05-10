import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2 } from "lucide-react";
import musicaDeFondo from "../assets/Song.mp3";
import "../styles/MusicPlayer.css";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        setIsPlaying(false);
        console.log(
          "Autoplay bloqueado por el navegador, esperando interacción.",
        );
      });
    }
  }, []);
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-container">
      <audio ref={audioRef} src={musicaDeFondo} loop />

      <motion.div
        className="music-player-simple"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          className={`play-btn-only ${isPlaying ? "is-playing" : ""}`}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
