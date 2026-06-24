import { useEffect } from 'react';
import { connectPortfolio, disconnectPortfolio } from '../services/socket';

const PROJECT_EVENTS = ['project:create', 'project:update', 'project:delete'];

export default function useRealtimeProjects(onProjectEvent) {
  useEffect(() => {
    const socket = connectPortfolio();

    const handler = (data) => {
      onProjectEvent(data);
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
  }, [onProjectEvent]);
}
