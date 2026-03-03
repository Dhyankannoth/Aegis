import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onEnterPortal, onAdminPortal }) => {
  return (
    <nav style={{
      width: '100%',
      position: 'fixed',
      top: '0',
      left: '0',
      padding: '30px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      {/* Brand Logo */}
      <div className="content-layer pointer-events-auto">
        <a href="/" className="nav-logo" style={{ textDecoration: 'none', color: 'black' }}>AEGIS</a>
      </div>

      {/* Navigation Links */}
      <div className="content-layer pointer-events-auto" style={{
        display: 'flex',
        gap: '40px',
        padding: '12px 40px',
        borderRadius: '100px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#dashboard">Dashboard</NavLink>
        <NavLink href="#about">About</NavLink>
      </div>

      {/* CTA Button */}
      <div className="content-layer pointer-events-auto" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button
          onClick={onAdminPortal}
          style={{
            background: 'transparent',
            color: 'black',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          Admin Portal
        </button>
        <button
          onClick={onEnterPortal}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          Enter Portal
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => (
  <motion.a
    href={href}
    whileHover={{ color: '#555', y: -2 }}
    style={{
      color: 'black',
      textDecoration: 'none',
      fontSize: '0.8rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      transition: 'all 0.3s'
    }}
  >
    {children}
  </motion.a>
);

export default Navbar;
