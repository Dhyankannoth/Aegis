import { useState, useEffect, useRef, useCallback } from 'react';

export const useProctoring = (isActive = false) => {
    const [status, setStatus] = useState({ face_count: 0, status: 'SECURE', alerts: [] });
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const connect = useCallback(() => {
        ws.current = new WebSocket('ws://localhost:5000');

        ws.current.onopen = () => {
            console.log('WebSocket Connected to Proctoring Backend');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStatus(data);
        };

        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            // Attempt to reconnect after 3 seconds
            setTimeout(connect, 3000);
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            connect();
        }
        return () => {
            if (ws.current) ws.current.close();
        };
    }, [isActive, connect]);

    const sendFrame = useCallback(() => {
        if (!isActive || !isConnected || !videoRef.current || !canvasRef.current || ws.current?.readyState !== WebSocket.OPEN) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        // Draw video frame to canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Compress for performance

        // Send to backend
        ws.current.send(JSON.stringify({ image: dataUrl }));
    }, [isActive, isConnected]);

    // Send frames every 500ms
    useEffect(() => {
        let interval;
        if (isActive && isConnected) {
            interval = setInterval(sendFrame, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, isConnected, sendFrame]);

    return { status, isConnected, videoRef, canvasRef };
};
