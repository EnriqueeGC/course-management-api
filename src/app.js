require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index.models');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routers');
const assignmentRoutes = require('./routes/assignment.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express()

app.use(cors());

app.use(express.json());

sequelize.sync()
    .then(() => console.log('DB Synchronized'))
    .catch(error => console.error('DB sync error: ', error))

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
