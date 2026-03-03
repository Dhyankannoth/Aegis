import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Eye, UserCheck, Maximize2 } from 'lucide-react';

const ProctoringOverlay = () => {
    const [status, setStatus] = useState('Secure');
    const [logs, setLogs] = useState(['Face authentication successful', 'Proctoring active']);

    // Simulate AI detections
    useEffect(() => {
        const intervals = [
            setTimeout(() => {
                setStatus('Warning');
                setLogs(prev => ['Multiple persons detected', ...prev]);
            }, 10000),
            setTimeout(() => {
                setStatus('Secure');
                setLogs(prev => ['Environment cleared', ...prev]);
            }, 15000),
            setTimeout(() => {
                setStatus('Caution');
                setLogs(prev => ['Eye tracking deviation detected', ...prev]);
            }, 25000)
        ];
        return () => intervals.forEach(clearTimeout);
    }, []);

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', width: '280px', zIndex: 1000 }}>
            {/* Webcam View */}
            <motion.div
                className="glass-card"
                style={{ overflow: 'hidden', padding: '10px', marginBottom: '15px', border: status === 'Warning' ? '2px solid #ef4444' : status === 'Caution' ? '2px solid #f59e0b' : '1px solid var(--border-glass)' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                    <Webcam
                        audio={false}
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={12} /> Live Feed
                        </div>
                    </div>

                    <AnimatePresence>
                        {status !== 'Secure' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, border: status === 'Warning' ? '4px solid rgba(239, 68, 68, 0.4)' : '4px solid rgba(245, 158, 11, 0.4)', pointerEvents: 'none' }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="status-pulse" style={{ background: status === 'Secure' ? '#10b981' : status === 'Warning' ? '#ef4444' : '#f59e0b' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status: {status}</span>
                    </div>
                    <Shield size={16} color={status === 'Secure' ? '#10b981' : status === 'Warning' ? '#ef4444' : '#f59e0b'} />
                </div>
            </motion.div>

            {/* AI Intelligence Logs */}
            <motion.div
                className="glass-card"
                style={{ padding: '15px', maxHeight: '200px', overflowY: 'auto' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={14} /> AI Activity Logs
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {logs.map((log, i) => (
                        <div key={i} style={{ fontSize: '0.75rem', color: i === 0 ? 'var(--text-main)' : 'var(--text-dim)', borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ProctoringOverlay;
