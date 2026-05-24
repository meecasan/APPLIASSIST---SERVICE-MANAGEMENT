import io, { Socket } from 'socket.io-client';
import { useEffect } from 'react';

let socket: Socket | null = null;

// Initialize socket connection
export function rtConnect(userId: string | number, role: string, storeId?: string | number) {
  if (socket && socket.connected) {
    return;
  }

  // Extract base URL from API URL (remove /api path)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverUrl = apiUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';
  
  socket = io(serverUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
    auth: {
      userId,
      role,
      storeId: storeId || null,
    },
  });

  socket.on('connect', () => {
    console.log('[Realtime] Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('[Realtime] Disconnected from server');
  });

  socket.on('error', (error) => {
    console.error('[Realtime] Error:', error);
  });
}

// Disconnect from socket
export function rtDisconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Get current socket instance
export function getSocket() {
  return socket;
}

// ==================== ORDER EVENTS ====================

export function onOrderNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('order:new', (payload) => {
    handler({ data: payload });
  });
}

export function offOrderNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('order:new', handler);
}

export function onOrderUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('order:updated', (payload) => {
    handler({ data: payload });
  });
}

export function offOrderUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('order:updated', handler);
}

// ==================== SERVICE EVENTS ====================

export function onServiceNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('service:new', (payload) => {
    handler({ data: payload });
  });
}

export function offServiceNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('service:new', handler);
}

export function onServiceUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('service:updated', (payload) => {
    handler({ data: payload });
  });
}

export function offServiceUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('service:updated', handler);
}

export function onServiceAssigned(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('service:assigned', (payload) => {
    handler({ data: payload });
  });
}

export function offServiceAssigned(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('service:assigned', handler);
}

// ==================== STOCK EVENTS ====================

export function onStockUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('stock:updated', (payload) => {
    handler({ data: payload });
  });
}

export function offStockUpdated(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('stock:updated', handler);
}

// ==================== NOTIFICATION EVENTS ====================

export function onNotificationNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('notification:new', (payload) => {
    handler({ data: payload });
  });
}

export function offNotificationNew(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('notification:new', handler);
}

// ==================== USER APPROVAL EVENTS ====================

export function onUserApproved(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('user:approved', (payload) => {
    handler({ data: payload });
  });
}

export function offUserApproved(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('user:approved', handler);
}

export function onUserRejected(handler: (data: any) => void) {
  if (!socket) return;
  socket.on('user:rejected', (payload) => {
    handler({ data: payload });
  });
}

export function offUserRejected(handler: (data: any) => void) {
  if (!socket) return;
  socket.off('user:rejected', handler);
}

// ==================== HOOK FOR SUBSCRIBING ====================

export function useRealtime(
  event: string,
  handler: (data: any) => void,
  deps: any[] = []
) {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket?.off(event, handler);
    };
  }, deps);
}
