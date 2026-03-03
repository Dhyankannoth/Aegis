import React, { useState, useEffect } from 'react';
import {
    Activity,
    Video,
    ShieldAlert,
    ShieldCheck,
    Search,
    User,
    AlertTriangle,
    Eye,
    MoreHorizontal,
    Wifi,
    WifiOff,
    BookOpen,
    CheckCircle2
} from 'lucide-react';
import { questionnaire } from '../data/questionnaire';

const AdminSidebar = ({ activeTab, onTabChange }) => (
    <aside style={{ width: '260px', backgroundColor: '#fcfcfc', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px' }}>
            <ShieldCheck size={28} fill="#1b263b" color="white" />
            <span style={{ fontWeight: 800, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#1b263b' }}>AEGIS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'auto' }}>
            <SidebarLink
                icon={<Activity size={20} />}
                label="Oversight"
                active={activeTab === 'oversight'}
                onClick={() => onTabChange('oversight')}
            />
            <SidebarLink
                icon={<BookOpen size={20} />}
                label="Answer Key"
                active={activeTab === 'key'}
                onClick={() => onTabChange('key')}
            />
        </nav>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#666', marginBottom: '15px' }}>System Health</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 600, color: '#27ae60' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27ae60' }}></div> Engine Online
            </div>
        </div>
    </aside>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: active ? '#fff' : 'transparent',
            boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
            color: active ? '#1b263b' : '#666',
            fontWeight: active ? 700 : 500,
            cursor: 'pointer',
            transition: '0.2s'
        }}
    >
        {icon} <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('oversight');
    const [liveData, setLiveData] = useState({
        status: 'SECURE',
        alerts: [],
        isConnected: false
    });

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000');

        socket.onopen = () => setLiveData(prev => ({ ...prev, isConnected: true }));
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLiveData(prev => ({
                ...prev,
                status: data.status,
                alerts: data.alerts
            }));
        };
        socket.onclose = () => setLiveData(prev => ({ ...prev, isConnected: false }));

        return () => socket.close();
    }, []);

    return (
        <div style={{ height: '100vh', display: 'flex', backgroundColor: '#fdfdfd', overflow: 'hidden' }}>
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input
                            type="text"
                            placeholder="Find candidate..."
                            style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '10px', border: '1px solid #eee', background: 'white', fontSize: '0.85rem', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 800, color: liveData.isConnected ? '#2ecc71' : '#e74c3c' }}>
                            {liveData.isConnected ? <Wifi size={14} /> : <WifiOff size={14} />} {liveData.isConnected ? 'STREAM CONNECTED' : 'STREAM OFFLINE'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1b263b' }}>Dr. Sarah Chen</div>
                                <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>System Administrator</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 0 0 1px #eee' }}>
                                <img src="https://i.pravatar.cc/150?u=sarah" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'oversight' ? (
                    <OversightView liveData={liveData} />
                ) : (
                    <AnswerKeyView />
                )}
            </main>
        </div>
    );
};

const OversightView = ({ liveData }) => (
    <>
        <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.8rem', fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700, color: '#1b263b', margin: 0 }}>Oversight Overview</h1>
            <p style={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}>Live monitoring for active examination modules.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '30px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid #f5f5f5' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#1b263b', margin: 0 }}>
                        <Video size={18} color="#2980b9" /> Active Sessions
                    </h3>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f5f5f5' }}>
                            <th style={tableHeaderStyle}>Candidate</th>
                            <th style={tableHeaderStyle}>Module</th>
                            <th style={tableHeaderStyle}>Integrity</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MonitoringRow
                            name="Alexander Thorne"
                            module="Cybersecurity Ethics"
                            risk={liveData.status === 'SECURE' ? 'LOW RISK' : 'FLAGGED'}
                            riskColor={liveData.status === 'SECURE' ? '#27ae60' : '#e74c3c'}
                            alert={liveData.status === 'FLAGGED'}
                        />
                        <MonitoringRow name="Alicia Moore" module="Cloud Infra" risk="LOW" riskColor="#27ae60" />
                        <MonitoringRow name="Robert King" module="Cloud Infra" risk="LOW" riskColor="#27ae60" />
                    </tbody>
                </table>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', border: '1px solid #f0f0f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1b263b', marginBottom: '30px', margin: 0 }}>Live Incident Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {liveData.alerts.length > 0 ? (
                        liveData.alerts.map((alert, idx) => (
                            <IncidentItem
                                key={idx}
                                icon={<ShieldAlert size={14} color="#e74c3c" />}
                                bgColor="#fff5f5"
                                title={alert}
                                detail="A. Thorne • Just now"
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <ShieldCheck size={40} color="#2ecc71" style={{ opacity: 0.3, marginBottom: '15px' }} />
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>No active incidents</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
);

const AnswerKeyView = () => (
    <>
        <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.8rem', fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700, color: '#1b263b', margin: 0 }}>Answer Key Repository</h1>
            <p style={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}>Confidential reference for module validation.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questionnaire.map((q) => (
                <div key={q.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ color: '#888', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>Question {q.id} • {q.partTitle}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1b263b', marginBottom: '20px' }}>{q.text}</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.options.map((opt, i) => (
                            <div key={i} style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: i === q.correctAnswer ? '1.5px solid #27ae60' : '1px solid #eee',
                                backgroundColor: i === q.correctAnswer ? '#f0fff4' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                color: i === q.correctAnswer ? '#27ae60' : '#666',
                                fontWeight: i === q.correctAnswer ? 700 : 500
                            }}>
                                {i === q.correctAnswer ? <CheckCircle2 size={16} /> : <div style={{ width: '16px' }} />}
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </>
);

const tableHeaderStyle = { padding: '20px 25px', fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 800, letterSpacing: '1px' };

const MonitoringRow = ({ name, module, risk, riskColor, alert }) => (
    <tr style={{ borderBottom: '1px solid #f9f9f9', backgroundColor: alert ? '#fff8f8' : 'transparent' }}>
        <td style={{ padding: '25px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1b263b' }}>{name}</div>
        </td>
        <td style={{ padding: '25px', fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>{module}</td>
        <td style={{ padding: '25px' }}>
            <span style={{
                backgroundColor: `${riskColor}15`,
                color: riskColor,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {alert && <ShieldAlert size={12} />} {risk}
            </span>
        </td>
        <td style={{ padding: '25px' }}>
            <div style={{ display: 'flex', gap: '15px', color: '#1b263b' }}>
                <Eye size={18} style={{ cursor: 'pointer' }} />
                <MoreHorizontal size={18} style={{ cursor: 'pointer' }} />
            </div>
        </td>
    </tr>
);

const IncidentItem = ({ icon, bgColor, title, detail }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1b263b', marginBottom: '2px' }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600 }}>{detail}</div>
        </div>
    </div>
);

export default AdminDashboard;
