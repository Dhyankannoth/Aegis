import React from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    TrendingUp,
    CheckCircle2,
    Award,
    Activity,
    User
} from 'lucide-react';

const Sidebar = () => (
    <aside style={{ width: '260px', backgroundColor: '#fcfcfc', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px' }}>
            <ShieldCheck size={28} fill="#1b263b" color="white" />
            <span style={{ fontWeight: 800, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#1b263b' }}>AEGIS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'auto' }}>
            <SidebarLink icon={<LayoutDashboard size={20} />} label="My Portal" active />
        </nav>

        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '30px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#666', marginBottom: '15px', letterSpacing: '1px' }}>Quick Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <StatItem icon={<TrendingUp size={14} color="#27ae60" />} label="Average Score" value="92.4%" />
                <StatItem icon={<CheckCircle2 size={14} color="#2980b9" />} label="Exams Taken" value="14" />
            </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#666', marginBottom: '15px' }}>System Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <StatusIndicator color="#2ed573" label="Proctor AI Active" />
                <StatusIndicator color="#2ed573" label="Network Secure" />
            </div>
        </div>
    </aside>
);

const SidebarLink = ({ icon, label, active }) => (
    <div style={{
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
    }}>
        {icon} <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
);

const StatItem = ({ icon, label, value }) => (
    <div>
        <div style={{ fontSize: '0.7rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>{icon} {label}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1b263b' }}>{value}</div>
    </div>
);

const StatusIndicator = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 600, color: '#666' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}></div> {label}
    </div>
);

const Dashboard = ({ onStartExam }) => {
    return (
        <div style={{ height: '100vh', display: 'flex', backgroundColor: '#fdfdfd', overflow: 'hidden' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1b263b' }}>Alexander Thorne</div>
                            <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>ID: PV-2940</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 0 0 1px #eee' }}>
                            <User size={20} color="#1b263b" />
                        </div>
                    </div>
                    <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #eee', background: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Sign Out</button>
                </header>

                {/* Active Exam Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', fontWeight: 700, color: '#1b263b', margin: 0, fontStyle: 'italic' }}>Pending Assessment</h2>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', marginBottom: '60px', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <div style={{ backgroundColor: '#e2f9f0', color: '#27ae60', padding: '6px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27ae60' }}></div> Ready to Start
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase' }}>Allotted Time</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1b263b', fontFamily: 'monospace' }}>01 : 45 : 22</div>
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1b263b', marginBottom: '10px' }}>Advanced Cybersecurity Ethics</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '40px' }}>Final Assessment. AI Proctoring will be active. Please ensure a stable connection.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#1b263b' }}><LayoutDashboard size={14} /> 60 Questions</div>
                        </div>
                        <button
                            onClick={onStartExam}
                            style={{ backgroundColor: '#1b263b', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            Start Assessment
                        </button>
                    </div>
                </div>

                {/* History Section */}
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', fontWeight: 700, color: '#1b263b', marginBottom: '40px', fontStyle: 'italic' }}>Historical Results</h2>
                <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '0px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>
                                <th style={tableHeaderStyle}>Assessment</th>
                                <th style={tableHeaderStyle}>Date</th>
                                <th style={tableHeaderStyle}>Score</th>
                                <th style={tableHeaderStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <HistoryRow title="Quantum Cryptography Basics" date="Oct 12, 2023" score="96%" status="PASSED" />
                            <HistoryRow title="Risk Management Frameworks" date="Sep 28, 2023" score="88%" status="COMPLETED" />
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const tableHeaderStyle = { padding: '25px', fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 800, letterSpacing: '1px' };

const HistoryRow = ({ title, date, score, status }) => (
    <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
        <td style={{ padding: '25px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b263b' }}>{title}</div>
        </td>
        <td style={{ padding: '25px', color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>{date}</td>
        <td style={{ padding: '25px', fontSize: '1.2rem', fontWeight: 800, color: '#1b263b' }}>{score}</td>
        <td style={{ padding: '25px' }}>
            <span style={{
                backgroundColor: status === 'PASSED' ? '#e2f9f0' : '#f0f2f5',
                color: status === 'PASSED' ? '#27ae60' : '#666',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {status === 'PASSED' && <ShieldCheck size={12} />} {status}
            </span>
        </td>
    </tr>
);

export default Dashboard;
