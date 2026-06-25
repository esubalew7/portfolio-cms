import { useEffect, useRef } from 'react';
import { connectPortfolio, disconnectPortfolio } from '../services/socket';

const SECTION_EVENTS = [
  'content:hero:update',
  'content:about:update',
  'content:skills:update',
  'content:experience:update',
  'content:testimonials:update',
  'content:contact:update',
  'content:navbar:update',
  'content:sections:update',
];

export default function useRealtimeContent(onContentEvent) {
  const callbackRef = useRef(onContentEvent);

  useEffect(() => {
    callbackRef.current = onContentEvent;
  }, [onContentEvent]);

  useEffect(() => {
    const socket = connectPortfolio();

    const handler = (data) => {
      callbackRef.current?.(data);
    };

    for (const event of SECTION_EVENTS) {
      socket.on(event, handler);
    }

    socket.on('content:update', handler);

    return () => {
      for (const event of SECTION_EVENTS) {
        socket.off(event, handler);
      }
      socket.off('content:update', handler);
      disconnectPortfolio();
    };
  }, []);
}
