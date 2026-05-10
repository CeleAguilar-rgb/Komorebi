import { motion } from 'framer-motion';
import { Heart, Camera, Mail } from 'lucide-react';
import "../styles/Navbar.css"

const Navbar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: <Heart size={24} /> },
    { id: 'timeline', icon: <Camera size={24} /> },
    { id: 'letters', icon: <Mail size={24} /> },
  ];

  return (
    <nav className="nav-container">
      <div className="nav-dock">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="icon-wrapper">{item.icon}</span>

            {activeTab === item.id && (
              <motion.div 
                layoutId="pill"
                className="active-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;