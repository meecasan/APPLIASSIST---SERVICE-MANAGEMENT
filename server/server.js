const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initRealtime } = require('./realtime');

const cors = require('cors');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storesRoutes = require('./routes/storesRoutes');
const productsRoutes = require('./routes/productsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const technicianApiRoutes = require('./routes/technicianApiRoutes');
const serviceRequestsRoutes = require('./routes/serviceRequestsRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const path = require('path');

app.use(cors());

// Guard: detect malformed request paths that accidentally include a full URL
app.use((req, res, next) => {
    const original = req.originalUrl || req.url || '';
    if (/https?:\/\//i.test(original)) {
        return res.status(400).json({ error: 'Malformed request URL: contains protocol. Did you paste two URLs together?' });
    }
    next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/notifications', notificationsRoutes);
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', usersRoutes);
app.use('/api/technician', technicianApiRoutes);
app.use('/api/service-requests', serviceRequestsRoutes);
app.use('/api/service-catalog', catalogRoutes);

app.get('/', (req, res) => {

    res.send('SERVER WORKING');

});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development; restrict in production
    methods: ['GET', 'POST'],
  },
});

// Initialize realtime module
initRealtime(io);


server.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});