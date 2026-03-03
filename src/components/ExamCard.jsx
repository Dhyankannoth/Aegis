import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ShieldCheck, AlertCircle } from 'lucide-react';

const ExamCard = ({ title, duration, questions, proctored, onStart }) => {
    return (
        <motion.div
            className="glass-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
            whileHover={{ scale: 1.02 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                    background: proctored ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: proctored ? '#10b981' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {proctored ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                    {proctored ? 'AI Proctored' : 'Standard'}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>#EXAM-294</div>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }} className="font-heading">{title}</h3>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={16} /> {duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Users size={16} /> {questions} Qs
                </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onStart}>
                Begin Examination
            </button>

            <div style={{
                position: 'absolute',
                bottom: '-10px',
                right: '-10px',
                opacity: 0.05,
                transform: 'rotate(-15deg)'
            }}>
                <ShieldCheck size={80} />
            </div>
        </motion.div>
    );
};

export default ExamCard;
