import React from 'react';
import { Shield, Clock, HelpCircle, Settings } from 'lucide-react';

const ExamHeader = ({ moduleName, timerValue }) => {
    return (
        <header style={{
            backgroundColor: 'var(--bg-exam-header)',
            color: 'white',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Shield size={24} fill="white" />
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>AEGIS</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Module</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{moduleName}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Timer */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Clock size={16} />
                    <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px' }}>
                        {timerValue}
                    </span>
                </div>

                <HelpCircle size={20} style={{ cursor: 'pointer', opacity: 0.8 }} />
                <Settings size={20} style={{ cursor: 'pointer', opacity: 0.8 }} />

                <button style={{
                    backgroundColor: 'white',
                    color: 'var(--bg-exam-header)',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                }}>
                    Finish Exam
                </button>
            </div>
        </header>
    );
};

export default ExamHeader;
