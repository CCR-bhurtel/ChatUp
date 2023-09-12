import { ExpressRequest } from '../../Types/User';
import User from '../../database/Model/User';
import AppError from '../../utils/AppError';
import catchAsync from '../../utils/catchAsync';

export const profileImageUpload = catchAsync(async (req: ExpressRequest, res, next) => {
    const fileName = req.file?.filename;

    if (fileName) {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                profilePic: fileName,
            },
            { new: true }
        );
        return res.status(200).json(user);
    } else {
        return next(new AppError("Couldn't save image", 400));
    }
});
