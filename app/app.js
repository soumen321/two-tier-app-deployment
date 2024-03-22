const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

const DB_USER = process.env.MONGO_DB_USERNAME;
const DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_HOST = process.env.MONGO_DB_HOST;

// localhost Connect to MongoDB
//'mongodb://admin:password@localhost:27017/reminders'

//changes for docker file

let mongoUrlDockerCompose = `mongodb://${DB_USER}:${DB_PASSWORD}@${MONGO_DB_HOST}/reminders`

//let mongoUrlDockerCompose = `mongodb://admin:password@mongodb:27017/reminders`

mongoose.connect(mongoUrlDockerCompose, {
    authSource: 'admin'
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Reminder model
const Reminder = mongoose.model('Reminder', {
    title: String,
    description: String,
    date: Date
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.get('/', async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.render('index', { reminders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/reminders', async (req, res) => {
    const { title, description, date } = req.body;

    const reminder = new Reminder({
        title,
        description,
        date
    });

    try {
        await reminder.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/reminders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Reminder.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
