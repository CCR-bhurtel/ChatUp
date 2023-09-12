import { PopulatedUser } from '../../Types/User';
import User from '../../database/Model/User';
import catchAsync from '../../utils/catchAsync';

export const profileImageUpload = catchAsync(async (req, res, next) => {
    const fileName = req.file?.filename;
    const reqUser = req.user as PopulatedUser;
    const user = await User.findByIdAndUpdate(
        reqUser._id,
        {
            profilePic: fileName,
        },
        { new: true }
    );
    res.status(200).json(user);
});
