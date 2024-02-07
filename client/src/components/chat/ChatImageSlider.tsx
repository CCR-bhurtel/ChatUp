import React, { useEffect, useRef, useState } from "react";
import Popup from "../layouts/Popup";
import axios, { AxiosResponse } from "axios";
import { IMedia } from "@/Types/Media";
import { useRoom } from "@/context/chat/RoomContextProvider";
import toast from "react-hot-toast";
import Slider, { Settings } from "react-slick";
import { BASE_PATH } from "@/config/keys";

interface IChatImageSlider {
  isSliderOpen: boolean;
  handleSliderClose: () => void;
  currentMediaId: string | undefined;
}

function ChatImageSlider(props: IChatImageSlider) {
  const { state, dispatch } = useRoom();
  const { isSliderOpen, handleSliderClose, currentMediaId } = props;
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
  const [medias, setMedias] = useState<IMedia[]>([]);

  const loadMedia = async () => {
    setLoadingMedia(true);
    try {
      const res: AxiosResponse<{ medias: IMedia[]; index: number }> =
        await axios.post(`/room/${state.activeRoom?._id}/medias`, {
          mediaid: currentMediaId,
          order: 1,
        });
      setMedias(res.data.medias);
      setCurrentMediaIndex(res.data.index);
    } catch (err: any) {
      toast.error(err?.response?.data.message || "Error loading media");
      handleSliderClose();
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (currentMediaId) {
      loadMedia();
    }
  }, [currentMediaId]);

  const settings: Settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    initialSlide: currentMediaIndex,
  };

  return isSliderOpen ? (
    <Popup onClose={handleSliderClose}>
      {loadingMedia ? (
        <h2>loading...</h2>
      ) : (
        <div className="relative  w-[90vw]  px-4 md:w-[600px] lg:w-[800px]">
          <Slider {...settings}>
            {medias.map((media) => (
              <div className="flex items-center justify-center h-[80vh] ">
                <img
                  src={`${BASE_PATH}/images/chatImages/${media.downloadUrl}`}
                  alt="chat room media"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </Popup>
  ) : (
    ""
  );
}

export default ChatImageSlider;
