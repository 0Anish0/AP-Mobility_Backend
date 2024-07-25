const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const SendOTPRoutes = require('./routes/SendOTP');
const VerifyOTPRoutes = require('./routes/VerifyOTP');
const UserRegistrationRoutes = require('./routes/UserRegistration');
const CreateRequestRoutes = require('./routes/CreateRequest');
const RequestHistoryRoutes = require('./routes/RequestHistory');
const editRequestRouter = require('./routes/EditRequest');
const deleteRequestRouter = require('./routes/DeleteRequest');
const getUser = require('./routes/getUserByEmail');
const updateStatus = require('./AdminRoutes/RequestStatus');
const AdminLoginRoute = require('./AdminRoutes/login');
const RequestCountRoute = require('./AdminRoutes/totalNumberOfRequest');
const TotalRequest = require('./AdminRoutes/getTotalRequest');
const UserStats = require('./AdminRoutes/UserStats');
const requestId = require('./AdminRoutes/getRequestByID');
const UserDetails = require('./AdminRoutes/UserDetails');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:8081', 'https://admin-panel-blush-seven.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', SendOTPRoutes);
app.use('/api', VerifyOTPRoutes);
app.use('/api', UserRegistrationRoutes);
app.use('/api', CreateRequestRoutes);
app.use('/api', RequestHistoryRoutes);
app.use('/api', editRequestRouter);
app.use('/api', deleteRequestRouter);
app.use('/api', getUser);
app.use('/admin', updateStatus);
app.use('/admin', AdminLoginRoute);
app.use('/admin', RequestCountRoute);
app.use('/admin', TotalRequest);
app.use('/admin', UserStats);
app.use('/admin', requestId);
app.use('/admin', UserDetails);

// Sample route for testing
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


module.exports = app;