// Root of the app. Starts the web server.

const express = require('express');
const db = require('./models');

const cookieParser = require('cookie-parser')

const app = express()
const { authenticateUser } = require('./middleware/auth')
const igdbRoutes = require('./routes/igdb');
const userRoutes = require('./routes/users')
const listRoutes = require('./routes/lists')
const gameRoutes = require('./routes/games')

app.use(cookieParser())

app.use(express.json())

// app.get('/api/tokens', (req, res) => {
//     try {
//         console.log(req.cookies) 
//         return res.json({res: req.cookies})
//     } catch (error) {

//     }
// })

app.use('/api/igdb', igdbRoutes)

app.use('/api/users', userRoutes)

app.use('/api/lists', listRoutes)

app.use('/api/games', gameRoutes)


// Handles 404 errors.
app.use(function (req, res, next) {
    return next();
});

// Handles unhandled errors.
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

db.sequelize.sync()


const PORT = 5000 || process.env.PORT
app.listen(PORT, () => console.log("Server started."))