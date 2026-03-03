import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SplineScene from './components/SplineScene';
import ExamInterface from './pages/ExamInterface';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConfirmationModal from './components/dashboard/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'dashboard', 'exam'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerInSeconds, setTimerInSeconds] = useState(6322); // 01:45:22 in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerInSeconds > 0) {
      interval = setInterval(() => {
        setTimerInSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerInSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerInSeconds]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setIsModalOpen(false);
    setView('exam');
    setIsTimerRunning(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'white' }}>
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'black' }}
          >
            <SplineScene />
            <Navbar
              onEnterPortal={() => setView('dashboard')}
              onAdminPortal={() => setView('admin')}
            />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100vw', height: '100vh' }}
          >
            <Dashboard onStartExam={() => setIsModalOpen(true)} />
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100vw', height: '100vh' }}
          >
            <AdminDashboard />
          </motion.div>
        )}

        {view === 'exam' && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
          >
            <ExamInterface
              timerValue={formatTime(timerInSeconds)}
              onExit={() => {
                setView('dashboard');
                setIsTimerRunning(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={startExam}
        examTitle="Advanced Cybersecurity Ethics"
      />
    </div>
  );
}

export default App;
