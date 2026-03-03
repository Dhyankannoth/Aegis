import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertCircle, Play } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, examTitle }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{
                            position: 'relative',
                            width: '500px',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '40px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            zIndex: 1001
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: '#fff4e6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                <ShieldAlert size={40} color="#f39c12" />
                            </div>

                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1b263b', marginBottom: '12px' }}>Confirm Assessment</h2>
                            <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.5, marginBottom: '30px' }}>
                                You are about to start the <strong style={{ color: '#1b263b' }}>{examTitle}</strong>.
                                The AI proctoring will begin immediately. Ensure your camera is properly positioned.
                            </p>

                            <div style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '16px',
                                padding: '20px',
                                width: '100%',
                                textAlign: 'left',
                                marginBottom: '30px',
                                border: '1px solid #eee'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <AlertCircle size={16} color="#1b263b" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b263b' }}>Important Note</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}> Once started, the timer cannot be paused. Closing the session may result in disqualification.</p>
                            </div>

                            <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        background: 'white',
                                        fontWeight: 700,
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    style={{
                                        flex: 2,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#1b263b',
                                        fontWeight: 700,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Play size={18} fill="white" /> START ASSESSMENT
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
