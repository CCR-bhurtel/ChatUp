// const dotenv = require('dotenv');

// dotenv.config({ path: '../.env' });

const app = require('./app');
const { connectDb } = require('./database/connect');

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`app listening to port ${PORT}`);
    });
});
