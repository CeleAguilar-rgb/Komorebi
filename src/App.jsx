import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./views/Home.jsx";
import Timeline from "./views/Timeline.jsx";
import Letters from "./views/Letters.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import LoginManager from './components/LoginManager';

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="app-container">
      <main className="main-content">
        <LoginManager />
        {activeTab === "home" && <Home />}

        {activeTab === "timeline" && <Timeline />}

        {activeTab === "letters" && <Letters />}
      </main>
      <MusicPlayer />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
