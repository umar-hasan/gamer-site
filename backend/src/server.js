// Root of the app. Starts the web server.

const express = require('express');
const db = require('./models');

const cookieParser = require('cookie-parser')

const app = express()
const igdbRoutes = require('./routes/igdb');
const userRoutes = require('./routes/users')
const listRoutes = require('./routes/lists')


app.use(cookieParser())

app.use(express.json())

app.use(express.static(path.join(__dirname, "../../frontend/build")))

app.use('/api/igdb', igdbRoutes)

app.use('/api/users', userRoutes)

app.use('/api/lists', listRoutes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/build/index.html'))
})


// Handles unhandled errors.
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});

db.sequelize.sync()


const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== "test") app.listen(PORT, () => console.log("Server started."))

module.exports = app