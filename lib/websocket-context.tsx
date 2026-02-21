'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useApp } from './app-context';
import { WebSocketMessage, DetectionMessage, StatusMessage } from './types';
import { API_URL, WS_URL } from './config';

interface WebSocketContextType {
  isConnected: boolean;
  send: (message: unknown) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { dispatch } = useApp();
  const [isConnected, setIsConnected] = React.useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);

  const send = useCallback((message: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    const wsUrl = WS_URL;
    const apiUrl = API_URL;
    let socket: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    fetch(`${apiUrl}/gestures`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'SET_GESTURES', payload: data });
      })
      .catch((err) => console.error('Failed to fetch gestures:', err));

    const connect = () => {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'status') {
            const statusData = message.data as StatusMessage['data'];
            dispatch({
              type: 'UPDATE_SYSTEM_STATUS',
              payload: {
                camera: statusData.camera,
                model: statusData.modelReady ? 'ready' : 'loading',
                detectionActive: statusData.detectionActive,
                fps: statusData.fps,
                wsConnected: true,
                cursorMode: statusData.cursorMode ?? false,
                totalDetections: (statusData as any).totalDetections ?? 0,
                actionsExecuted: (statusData as any).actionsExecuted ?? 0,
                avgConfidence: (statusData as any).avgConfidence ?? 0,
              },
            });
          } else if (message.type === 'detection') {
            const detection = message.data as DetectionMessage['data'];
            dispatch({
              type: 'ADD_DETECTION',
              payload: {
                id: Math.random().toString(36),
                gestureId: detection.gestureId,
                gestureName: detection.gestureName,
                confidence: detection.confidence,
                action: detection.action,
                timestamp: new Date(),
              },
            });
            if (detection.action) {
              dispatch({ type: 'INCREMENT_ACTIONS' });
            }
          } else if (message.type === 'training') {

            console.log("Training update:", message.data);
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        dispatch({
          type: 'UPDATE_SYSTEM_STATUS',
          payload: { wsConnected: false }
        });

        reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [dispatch]);

  return (
    <WebSocketContext.Provider value={{ isConnected, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
