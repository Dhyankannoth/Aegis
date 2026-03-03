import React from 'react';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionArea = ({
    questionNumber,
    totalQuestions,
    partTitle,
    questionText,
    options,
    selectedOption,
    isFlagged,
    onSelectOption,
    onToggleFlag,
    onNext,
    onPrevious
}) => {
    return (
        <div style={{ flex: 1, backgroundColor: '#fdfdfd', padding: '50px 100px', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {/* Question Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '1px', marginBottom: '10px' }}>
                        {partTitle}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Question {questionNumber}</h1>
                        <button
                            onClick={onToggleFlag}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: isFlagged ? '#e74c3c' : '#bdc3c7',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: '0.2s'
                            }}
                        >
                            <Flag size={16} fill={isFlagged ? "#e74c3c" : "transparent"} /> {isFlagged ? 'Flagged' : 'Mark for later'}
                        </button>
                    </div>
                </div>

                {/* Question Container */}
                <div className="glass-white" style={{
                    backgroundColor: 'white',
                    padding: '50px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    marginBottom: '50px',
                    position: 'relative'
                }}>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#333', marginBottom: '40px', fontWeight: 500 }}>
                        {questionText}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {options.map((opt, i) => (
                            <label
                                key={i}
                                onClick={() => onSelectOption(i)}
                                style={{
                                    border: selectedOption === i ? '2px solid #1b263b' : '1px solid #e9ecef',
                                    padding: '20px 24px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: selectedOption === i ? '#f8fbfc' : 'white',
                                    boxShadow: selectedOption === i ? '0 4px 12px rgba(27,38,59,0.05)' : 'none'
                                }}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${selectedOption === i ? '#1b263b' : '#dee2e6'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: '0.2s'
                                }}>
                                    {selectedOption === i && <div style={{ width: '10px', height: '10px', backgroundColor: '#1b263b', borderRadius: '50%' }}></div>}
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: selectedOption === i ? 700 : 500, color: '#333' }}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer Navigation */}
                <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '40px' }}>
                    <button
                        onClick={onPrevious}
                        disabled={questionNumber === 1}
                        style={{
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            border: '1px solid #eee',
                            padding: '14px 28px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: questionNumber === 1 ? 'not-allowed' : 'pointer',
                            opacity: questionNumber === 1 ? 0.5 : 1,
                            transition: '0.2s'
                        }}
                    >
                        <ChevronLeft size={20} /> PREVIOUS
                    </button>

                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#aaa', letterSpacing: '1px' }}>
                        PAGE {questionNumber} OF {totalQuestions}
                    </div>

                    <button
                        onClick={onNext}
                        disabled={questionNumber === totalQuestions}
                        style={{
                            backgroundColor: '#1b263b',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: questionNumber === totalQuestions ? 'not-allowed' : 'pointer',
                            opacity: questionNumber === totalQuestions ? 0.5 : 1,
                            boxShadow: '0 4px 12px rgba(27,38,59,0.2)',
                            transition: '0.2s'
                        }}
                    >
                        {questionNumber === totalQuestions ? 'REVIEW' : 'SAVE AND NEXT'} <ChevronRight size={20} />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default QuestionArea;
