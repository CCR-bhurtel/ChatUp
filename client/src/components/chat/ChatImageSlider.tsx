import React, { createRef, useEffect, useRef, useState } from "react";
import Popup from "../layouts/Popup";
import axios, { AxiosResponse } from "axios";
import { IMedia } from "@/Types/Media";
import { useRoom } from "@/context/chat/RoomContextProvider";
import toast from "react-hot-toast";
import Slider, { InnerSlider, Settings } from "react-slick";
import { BASE_PATH } from "@/config/keys";
import Loading from "../reusables/Loading";

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

  let sliderRef = createRef<any>();

  let firstSlideRef = createRef<HTMLDivElement>();

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

    // if (typeof window !== "undefined") {
    //   window.addEventListener("keydown", (e) => {
    //     try {
    //       if (e.key === "ArrowRight" && sliderRef.current) {
    //         if (sliderRef) sliderRef.current.slickNext();
    //         // next
    //       } else if (e.key === "ArrowLeft" && sliderRef.current) {
    //         // prev
    //         if (sliderRef) sliderRef.current.slickPrev();
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   });
    // }
  }, [currentMediaId]);

  const settings: Settings = {
    dots: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    initialSlide: currentMediaIndex,
    focusOnSelect: true,
    onInit() {
      firstSlideRef.current?.focus();
    },
  };

  return isSliderOpen ? (
    <Popup onClose={handleSliderClose}>
      {loadingMedia ? (
        <Loading />
      ) : (
        <div className="relative  w-[90vw]  px-4 md:w-[600px] lg:w-[800px]">
          <Slider ref={sliderRef} {...settings}>
            {medias.map((media, i) => (
              <div
                ref={firstSlideRef}
                className="flex items-center justify-center h-[80vh] "
              >
                <img
                  src={`${BASE_PATH}/static/images/chatImages/${media.downloadUrl}`}
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
