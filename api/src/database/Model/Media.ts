import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
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
const preSchemaMethods: string[] = ['deleteOne', 'deleteMany', 'findByIdAndDelete', 'findOneAndDelete'];
const regexPattern = new RegExp(preSchemaMethods.join('|'), 'g');
mediaSchema.pre(
    regexPattern,
    async function (next) {
        fs.unlink(path.resolve(__dirname, `../../../public/${this.name}`), (err) => {
            if (err) {
                next(err);
            }
        });
        next();
    }.bind(mediaSchema)
);

const Media = mongoose.model('Media', mediaSchema);

export default Media;
