import React, { useState, useEffect } from 'react';
import ExamHeader from '../components/exam/ExamHeader';
import Sidebar from '../components/exam/Sidebar';
import QuestionArea from '../components/exam/QuestionArea';
import { useProctoring } from '../hooks/useProctoring';
import { questionnaire } from '../data/questionnaire';

const ExamInterface = ({ onExit, timerValue }) => {
    const { status, isConnected, videoRef, canvasRef } = useProctoring(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedIndex }
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

    const currentQuestion = questionnaire[currentIndex];

    // Request webcam access on mount
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.error("Webcam access denied: ", err);
                });
        }
    }, [videoRef]);

    // Tab switch detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                alert("Tab switch detected. The exam will now end.");
                onExit();
            }
        };

        const handleBlur = () => {
            // Note: blur can trigger when clicking outside the window or Switching apps
            // You might want to be careful with this as it can be sensitive
            // For now, let's keep it commented or use it if strict proctoring is needed
            // alert("Window focus lost. The exam will now end.");
            // onExit();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [onExit]);

    const handleSelectOption = (optionIndex) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionIndex
        }));
    };

    const handleToggleFlag = () => {
        setFlaggedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(currentQuestion.id)) {
                next.delete(currentQuestion.id);
            } else {
                next.add(currentQuestion.id);
            }
            return next;
        });
    };

    const handleNext = () => {
        if (currentIndex < questionnaire.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Prepare sidebar question list
    const sidebarQuestions = questionnaire.map((q, idx) => ({
        id: q.id,
        status: userAnswers[q.id] !== undefined ? 'completed' : flaggedQuestions.has(q.id) ? 'flagged' : 'unvisited',
        current: idx === currentIndex
    }));

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <ExamHeader
                moduleName="Advanced Cybersecurity Ethics"
                timerValue={timerValue}
                onExit={onExit}
            />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar
                    proctoringStatus={status}
                    videoRef={videoRef}
                    isConnected={isConnected}
                    questions={sidebarQuestions}
                    onSelectQuestion={(id) => {
                        const idx = questionnaire.findIndex(q => q.id === id);
                        if (idx !== -1) setCurrentIndex(idx);
                    }}
                />
                <QuestionArea
                    questionId={currentQuestion.id}
                    questionNumber={currentIndex + 1}
                    totalQuestions={questionnaire.length}
                    partTitle={currentQuestion.partTitle}
                    questionText={currentQuestion.text}
                    options={currentQuestion.options}
                    selectedOption={userAnswers[currentQuestion.id]}
                    isFlagged={flaggedQuestions.has(currentQuestion.id)}
                    onSelectOption={handleSelectOption}
                    onToggleFlag={handleToggleFlag}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            </div>
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default ExamInterface;
