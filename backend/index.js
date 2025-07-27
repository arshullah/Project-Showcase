const express = require('express');
const UserRouter = require('./routers/userRouter');
const ProjectRouter = require('./routers/projectRouter');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration: allow only origins specified in .env ALLOWED_ORIGINS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
console.log('Registering CORS middleware');
app.use(cors({
    origin: function (origin, callback) {
        if (origin && allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
}));

console.log('Registering express.json middleware');
app.use(express.json());

console.log('Registering /user route');
app.use('/user', UserRouter);
console.log('Registering /project route');
app.use('/project', ProjectRouter);

console.log('Registering global error handler');
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// To serve static files in production, uncomment and use:
// console.log('Registering static file serving for /public');
// app.use(express.static('public'));

console.log('Starting server on port', port);
app.listen(port, () => {
    console.log('server started');
});