import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { IMedia, IMediaMethods, MediaModel } from '../../Types/Media';
import { NextFunction } from 'express';
const mediaSchema = new mongoose.Schema<IMedia, MediaModel, IMediaMethods>({
    name: {
        type: String,
        required: [true, 'Media name is required'],
    },

    roomId: mongoose.Types.ObjectId,

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
mediaSchema.pre(regexPattern, async function (this: MediaModel, next) {
    fs.unlink(path.resolve(__dirname, `../../../public/${this.name}`), (err) => {
        if (err) {
            next(err);
        }
    });
    next();
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
