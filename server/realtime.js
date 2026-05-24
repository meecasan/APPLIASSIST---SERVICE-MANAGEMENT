/**
 * APPLIASSIST — Real-Time Database Module (Server)
 * Drop this file into: APPLIASSIST/server/realtime.js
 *
 * SETUP in server.js:
 *   const { initRealtime } = require('./realtime');
 *   initRealtime(io);          // call AFTER io is created
 *
 * INSTALL socket.io (already in server — skip if present):
 *   cd server && npm install socket.io
 *
 * Events emitted TO clients:
 *   order:new          — a new order was placed
 *   order:updated      — order status changed
 *   service:new        — a new service request was submitted
 *   service:updated    — service request status changed
 *   service:assigned   — technician assigned to a service request
 *   stock:updated      — product stock level changed
 *   notification:new   — a notification was created for a user
 *   user:approved      — admin approved a technician / store owner
 *   user:rejected      — admin rejected an application
 *
 * Events received FROM clients:
 *   join:user          — { userId, role }  → joins a private room
 *   join:store         — { storeId }       → joins a store room
 *   join:admin         — (admin only)      → joins the admin room
 *   leave:room         — { room }          → leaves a room
 *   ping               — health-check
 */

const db = require('./config/db'); // your existing MySQL pool

// ─── Room name helpers ────────────────────────────────────────────────────────
const ROOM = {
  user:  (id)   => `user:${id}`,
  store: (id)   => `store:${id}`,
  admin: ()     => 'admin',
  role:  (role) => `role:${role}`,  // broadcast to all users of a role
};

// ─── Auth guard (optional — verifies JWT on socket handshake) ─────────────────
// Uncomment if you want to require auth on socket connections:
//
// const jwt = require('jsonwebtoken');
// function socketAuthMiddleware(socket, next) {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error('Authentication required'));
//   try {
//     socket.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     next(new Error('Invalid token'));
//   }
// }

// ─── Main init ────────────────────────────────────────────────────────────────
function initRealtime(io) {
  // io.use(socketAuthMiddleware); // uncomment to enforce JWT

  io.on('connection', (socket) => {
    console.log(`[RT] connected  ${socket.id}`);

    // ── Room management ──────────────────────────────────────────────────────

    /** Client joins its personal room + role room */
    socket.on('join:user', ({ userId, role }) => {
      if (!userId) return;
      const userRoom  = ROOM.user(userId);
      const roleRoom  = ROOM.role(role);
      socket.join(userRoom);
      socket.join(roleRoom);
      console.log(`[RT] ${socket.id} → joined ${userRoom} + ${roleRoom}`);
    });

    /** Shop owner joins their store room */
    socket.on('join:store', ({ storeId }) => {
      if (!storeId) return;
      socket.join(ROOM.store(storeId));
      console.log(`[RT] ${socket.id} → joined ${ROOM.store(storeId)}`);
    });

    /** Admin joins the admin room */
    socket.on('join:admin', () => {
      socket.join(ROOM.admin());
      console.log(`[RT] ${socket.id} → joined admin`);
    });

    /** Leave any room */
    socket.on('leave:room', ({ room }) => {
      socket.leave(room);
    });

    /** Health check */
    socket.on('ping', (cb) => {
      if (typeof cb === 'function') cb({ status: 'ok', ts: Date.now() });
    });

    socket.on('disconnect', () => {
      console.log(`[RT] disconnected ${socket.id}`);
    });
  });

  // expose the emitter on io so controllers can call it
  io.rt = new RealtimeEmitter(io);
  return io.rt;
}

// ─── Emitter API ─────────────────────────────────────────────────────────────
/**
 * Usage inside any controller:
 *   const { getIO } = require('../realtime');
 *   getIO().rt.orderNew(order);
 *   getIO().rt.serviceUpdated(serviceRequest);
 *   ...etc.
 */

let _io = null;
function getIO() { return _io; }

// Monkey-patch initRealtime to store the io reference
const _origInit = initRealtime;
function initRealtimeAndStore(io) {
  _io = io;
  return _origInit(io);
}

class RealtimeEmitter {
  constructor(io) { this.io = io; }

  // ── Orders ────────────────────────────────────────────────────────────────

  /** Notify customer + shop owner when a new order is placed */
  orderNew(order) {
    // order: { order_id, customer_id, store_id, total_amount, status, ... }
    const payload = { event: 'order:new', data: order };
    this.io.to(ROOM.user(order.customer_id)).emit('order:new', payload);
    if (order.store_id) {
      this.io.to(ROOM.store(order.store_id)).emit('order:new', payload);
    }
    this.io.to(ROOM.admin()).emit('order:new', payload);
  }

  /** Notify customer + shop owner when order status changes */
  orderUpdated(order) {
    const payload = { event: 'order:updated', data: order };
    this.io.to(ROOM.user(order.customer_id)).emit('order:updated', payload);
    if (order.store_id) {
      this.io.to(ROOM.store(order.store_id)).emit('order:updated', payload);
    }
  }

  // ── Service Requests ──────────────────────────────────────────────────────

  /** Broadcast to technicians + admin when a new service request arrives */
  serviceNew(serviceRequest) {
    const payload = { event: 'service:new', data: serviceRequest };
    this.io.to(ROOM.role('technician')).emit('service:new', payload);
    this.io.to(ROOM.admin()).emit('service:new', payload);
    if (serviceRequest.store_id) {
      this.io.to(ROOM.store(serviceRequest.store_id)).emit('service:new', payload);
    }
  }

  /** Notify customer (and assigned technician) when service status changes */
  serviceUpdated(serviceRequest) {
    const payload = { event: 'service:updated', data: serviceRequest };
    if (serviceRequest.customer_id) {
      this.io.to(ROOM.user(serviceRequest.customer_id)).emit('service:updated', payload);
    }
    if (serviceRequest.technician_id) {
      this.io.to(ROOM.user(serviceRequest.technician_id)).emit('service:updated', payload);
    }
    if (serviceRequest.store_id) {
      this.io.to(ROOM.store(serviceRequest.store_id)).emit('service:updated', payload);
    }
  }

  /** Notify the assigned technician + customer when tech is assigned */
  serviceAssigned(serviceRequest) {
    const payload = { event: 'service:assigned', data: serviceRequest };
    if (serviceRequest.technician_id) {
      this.io.to(ROOM.user(serviceRequest.technician_id)).emit('service:assigned', payload);
    }
    if (serviceRequest.customer_id) {
      this.io.to(ROOM.user(serviceRequest.customer_id)).emit('service:assigned', payload);
    }
  }

  // ── Stock ─────────────────────────────────────────────────────────────────

  /** Notify shop owner (and admin) when a product's stock changes */
  stockUpdated(product) {
    // product: { product_id, store_id, stock_quantity, product_name, ... }
    const payload = { event: 'stock:updated', data: product };
    if (product.store_id) {
      this.io.to(ROOM.store(product.store_id)).emit('stock:updated', payload);
    }
    this.io.to(ROOM.admin()).emit('stock:updated', payload);
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  /** Push a notification to a specific user */
  notificationNew(notification) {
    // notification: { notification_id, user_id, message, type, ... }
    const payload = { event: 'notification:new', data: notification };
    this.io.to(ROOM.user(notification.user_id)).emit('notification:new', payload);
  }

  // ── Admin: Application Approval ───────────────────────────────────────────

  userApproved(user) {
    const payload = { event: 'user:approved', data: user };
    this.io.to(ROOM.user(user.user_id || user.id)).emit('user:approved', payload);
  }

  userRejected(user) {
    const payload = { event: 'user:rejected', data: user };
    this.io.to(ROOM.user(user.user_id || user.id)).emit('user:rejected', payload);
  }
}

module.exports = {
  initRealtime: initRealtimeAndStore,
  getIO,
  ROOM,
};
