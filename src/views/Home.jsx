import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import "../styles//Home.css";

const SakuraPetal = ({ id }) => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomDelay = useMemo(() => Math.random() * 5, []);
  const randomDuration = useMemo(() => Math.random() * 6 + 4, []);
  const randomScale = useMemo(() => Math.random() * 0.5 + 0.5, []);

  return (
    <motion.div
      key={id}
      className="sakura-petal"
      initial={{
        opacity: 0,
        y: "-10vh",
        x: `${randomX}vw`,
        rotate: 0,
        scale: randomScale,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: "110vh",
        rotate: [0, 180, 360, 720],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({});

  const anniversaryDate = useMemo(() => new Date("2025-05-12T00:00:00"), []);

  const calculateTime = useMemo(
    () => () => {
      const now = new Date();
      const difference = now - anniversaryDate;

      if (difference < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    },
    [anniversaryDate],
  );

  useEffect(() => {
    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTime]);

  const petals = Array.from({ length: 25 }, (_, i) => i);

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="sakura-rain">
        {petals.map((id) => (
          <SakuraPetal key={id} id={id} />
        ))}
      </div>

      <motion.div
        className="cherry-tree-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.1, duration: 1.5 }}
      />

      <div className="hero-content">
        <h1 className="main-title">Komorebi</h1>
        <p className="subtitle">Nuestra historia en pixeles</p>

        {timeLeft.days !== undefined && (
          <div className="counter-grid">
            <div className="counter-item">
              <span className="number">{timeLeft.days}</span>
              <span className="label">Días</span>
            </div>
            <div className="counter-item">
              <span className="number">{timeLeft.hours}</span>
              <span className="label">Hrs</span>
            </div>
            <div className="counter-item">
              <span className="number">{timeLeft.minutes}</span>
              <span className="label">Min</span>
            </div>
            <div className="counter-item">
              <span className="number">{timeLeft.seconds}</span>
              <span className="label">Seg</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
