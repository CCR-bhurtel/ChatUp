const mongoose = require('mongoose');
const fs = require('fs');

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Media name is required'],
    },

    type: {
        type: String,
        enum: ['File', 'ImgVideo'],
    },
    downloadUrl: {
        type: String,
        required: [true, 'Download url is required'],
    },
});
mediaSchema.pre(['deleteOne', 'deleteMany', 'findByIdAndDelete', 'findOneAndDelete'], async function (next) {
    fs.unlink(path.resolve(__dirname, `../../../public/${this.name}`), (err) => {
        if (err) {
            next(err);
        }
    });
    next();
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
