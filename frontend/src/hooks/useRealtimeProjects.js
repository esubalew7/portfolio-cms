import { useEffect, useRef } from 'react';
import { connectPortfolio, disconnectPortfolio } from '../services/socket';

const PROJECT_EVENTS = ['project:create', 'project:update', 'project:delete'];

export default function useRealtimeProjects(onProjectEvent) {
  const callbackRef = useRef(onProjectEvent);

  useEffect(() => {
    callbackRef.current = onProjectEvent;
  }, [onProjectEvent]);

  useEffect(() => {
    const socket = connectPortfolio();

    const handler = (data) => {
      callbackRef.current?.(data);
    };

    for (const event of PROJECT_EVENTS) {
      socket.on(event, handler);
    }

    return () => {
      for (const event of PROJECT_EVENTS) {
        socket.off(event, handler);
      }
      disconnectPortfolio();
    };
  }, []);
}
