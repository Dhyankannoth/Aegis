import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section style={{
            padding: '120px 20px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <div className="status-pulse"></div>
                Next-Gen AI Proctoring Available
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    letterSpacing: '-2px'
                }}
            >
                Integrity Powered by <br />
                <span style={{
                    background: 'linear-gradient(to right, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Artificial Intelligence</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.2rem',
                    maxWidth: '700px',
                    marginBottom: '40px',
                    lineHeight: 1.6
                }}
            >
                Secure, scalable, and intelligent exam proctoring solution for modern education environments. Ensure 100% compliance with zero friction.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', gap: '20px' }}
            >
                <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                    Explore Portal <ArrowRight size={20} />
                </button>
                <button className="glass-card" style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.05)'
                }}>
                    Watch Demo <Play size={20} fill="white" />
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                    marginTop: '80px',
                    display: 'flex',
                    gap: '40px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.9rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="var(--primary)" /> Real-time Monitoring</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="var(--primary)" /> Face Recognition</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="var(--primary)" /> Behavior Analysis</div>
            </motion.div>
        </section>
    );
};

export default Hero;
