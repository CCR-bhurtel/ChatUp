const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const options = {
            useNewUrlParser: true,
        };

        const connection = await mongoose.connect('mongodb://mongo:27017/chatup-db', options);
        if (connection) console.log('\x1b[32m%s\x1b[0m', 'Database Connected Successfully...');
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', 'Error while connecting database\n');
        console.log(err);
    }
};
