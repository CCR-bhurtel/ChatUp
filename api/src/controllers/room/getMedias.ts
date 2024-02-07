import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import Media from "../../database/Model/Media";

const getMediasForRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomid } = req.params; // mediaid is send from frontend to check the index of the selected media
  const { mediaid, order = 1 } = req.body;
  const medias = await Media.find({
    roomId: roomid,
  }).sort({
    createdAt: order,
  });
  let index: number = medias.length - 1;
  if (mediaid)
    medias.forEach((media, i) => {
      if (media._id.toString() === mediaid) {
        index = i;
      }
    });

  return res.status(200).json({ index, medias });
});

export default getMediasForRoom;
