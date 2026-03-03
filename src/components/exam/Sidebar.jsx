import React from 'react';
import { Expand, ShieldAlert, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

const Sidebar = ({ proctoringStatus, videoRef, isConnected, questions, onSelectQuestion }) => {
    const { face_count, status, alerts } = proctoringStatus || { face_count: 0, status: 'UNKNOWN', alerts: [] };

    return (
        <aside style={{
            width: '280px',
            backgroundColor: '#fcfcfc',
            height: 'calc(100vh - 64px)',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
        }}>
            {/* AI Video Feed */}
            <div style={{
                width: '100%',
                aspectRatio: '16/10',
                backgroundColor: '#000',
                borderRadius: '12px',
                position: 'relative',
                marginBottom: '25px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: status === 'FLAGGED' ? '2px solid #e74c3c' : '2px solid transparent'
            }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />

                {/* Overlay Indicators */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: isConnected ? '#2ecc71' : '#95a5a6',
                        boxShadow: isConnected ? '0 0 8px #2ecc71' : 'none'
                    }}></div>
                    <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {isConnected ? 'Live AI Active' : 'Connecting...'}
                    </span>
                </div>

                {status === 'FLAGGED' && (
                    <div style={{ position: 'absolute', inset: 0, border: '4px solid #e74c3c', pointerEvents: 'none', animation: 'pulse 2s infinite' }}></div>
                )}

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.55rem', color: '#00ffcc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        IDENTITY VERIFIED
                    </div>
                </div>
            </div>

            {/* Proctoring Alerts */}
            {alerts && alerts.length > 0 && (
                <div style={{
                    backgroundColor: '#fff5f5',
                    border: '1px solid #feb2b2',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c53030', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <ShieldAlert size={14} /> Integrity Alert
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {alerts.map((alert, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', color: '#742a2a', fontWeight: 600 }}>• {alert}</div>
                        ))}
                    </div>
                </div>
            )}

            {/* Question Matrix */}
            <div style={{ marginBottom: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a' }}>Question Matrix</span>
                    <span style={{
                        backgroundColor: '#1b263b',
                        color: 'white',
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700
                    }}>
                        {Math.round((questions.filter(q => q.status === 'completed').length / questions.length) * 100)}% Done
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            onClick={() => onSelectQuestion(q.id)}
                            style={{
                                aspectRatio: '1',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: '0.2s',
                                backgroundColor: q.status === 'completed' ? '#1b263b' : 'white',
                                color: q.status === 'completed' ? 'white' : q.status === 'flagged' ? '#e74c3c' : '#6c757d',
                                border: q.current ? '2px solid black' : q.status === 'flagged' ? '2px solid #e74c3c' : '1px solid #dee2e6',
                                transform: q.current ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            <span>{q.id}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Status Indicators */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#6c757d', display: 'block', marginBottom: '15px' }}>Environment Status</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <StatusItem icon={isConnected ? <Wifi size={14} color="#2ecc71" /> : <WifiOff size={14} color="#e74c3c" />} label="Connection" value={isConnected ? "Active" : "Offline"} />
                    <StatusItem icon={<ShieldCheck size={14} color={status === 'SECURE' ? "#2ecc71" : "#e74c3c"} />} label="Integrity" value={status} />
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
            `}</style>
        </aside>
    );
};

const StatusItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', fontWeight: 600, color: '#495057' }}>
            {icon} {label}
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1b263b' }}>{value}</span>
    </div>
);

export default Sidebar;
