import {
  faFaceSmile,
  faCancel,
  faImage,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Picker from "@emoji-mart/react";
import data, { Skin } from "@emoji-mart/data";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  SyntheticEvent,
  useMemo,
  RefObject,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSocket } from "@/utils/socketService";
import { useAuth } from "@/context/auth/AuthContextProvider";
import { useRoom } from "@/context/chat/RoomContextProvider";

interface Props {
  handleSendMessage: (
    e: SyntheticEvent,
    message?: string,
    images?: File[],
    inputRef?: RefObject<HTMLInputElement>,
    resetPrevImages?: () => void
  ) => Promise<void>;
}

function MessageInput({ handleSendMessage }: Props) {
  const [message, setMessage] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);

  const [prevImages, setPrevImages] = useState<{ id: File; url: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>();

  const [isTyping, setIsTyping] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const auth = useAuth();
  const roomContext = useRoom();

  const room = useMemo(() => roomContext, []);

  const onEmojiClick = (obj: Skin) => {
    setMessage(message + obj.native);
    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const socket = useMemo(() => getSocket(), []);

  const [currentTimeoutId, setCurrentTimeoutId] = useState<
    string | number | NodeJS.Timeout | undefined
  >(0);

  const handleInputOpen = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
      const fileListArray = Array.from(e.target.files);
      const prevUrls = fileListArray.map((file) => ({
        id: file,
        url: URL.createObjectURL(file),
      }));
      setPrevImages(prevUrls);
    }
  };

  const handleFileRemove = (image: { id: File; url: string }) => {
    const newPrevImages = prevImages.filter((img) => img.url !== image.url);
    const newSelectedFiles = newPrevImages.map((img) => img.id);
    setSelectedImages(newSelectedFiles);
    setPrevImages(newPrevImages);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping((prev) => true);
      socket.emit("typing", {
        roomId: room.state.activeRoom?._id,
        profilePic: auth.state.user?.profilePic,
        userId: auth.state.user?._id,
      });
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    let timeoutId = setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength) {
        socket.emit("stopTyping", {
          roomId: room.state.activeRoom?._id,
          userId: auth.state.user?._id,
        });
        setIsTyping(false);
      }
    }, timerLength);
    setCurrentTimeoutId(timeoutId);
  };

  const handleSend = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(e, message, selectedImages, imageInputRef, () => {
      setPrevImages([]);
    });
    setMessage("");
    if (currentTimeoutId) clearTimeout(currentTimeoutId);
    setIsTyping(false);
    socket.emit("stopTyping", {
      roomId: room.state.activeRoom?._id,
      userId: auth.state.user?._id,
    });
  };

  return (
    <div className="messageBox absolute w-full justify-center self-end bottom-2 flex p-4">
      <form onSubmit={handleSend} className="flex flex-row flex-1">
        <div className="bg-cgray p-4 rounded-tl-xl text-sm rounded-bl-xl flex flex-1 items-center">
          <div className="w-full">
            <input
              value={message}
              onChange={handleMessageChange}
              type="text"
              className="w-full outline-none placeholder:font-thin text-white font-light text-sm placeholder:text-white bg-transparent focus:bg-transparent border-none outline-0 focus:outline-0"
              placeholder="Your message here "
            />

            <div className="images flex items-center  flex-row gap-4 flex-wrap mt-2">
              {prevImages.map((image) => (
                <div className="relative">
                  <img
                    className="h-[30px] w-[30px] object-cover bg-gray-400"
                    src={image.url}
                    alt="preview"
                  />
                  <FontAwesomeIcon
                    onClick={() => {
                      handleFileRemove(image);
                    }}
                    icon={faXmark}
                    className="text-navy absolute -top-2 -right-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:relative  gap-2  items-center justify-end text-white ">
            <FontAwesomeIcon
              onClick={handleInputOpen}
              icon={faImage}
              className="cursor-pointer "
            />
            <input
              ref={imageInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              accept="image/*"
              className="opacity-0 w-0"
            />

            <div className="emojicontainer ">
              <FontAwesomeIcon
                icon={faFaceSmile}
                className="cursor-pointer"
                onClick={() => setShowPicker(true)}
              />
              {showPicker && (
                <div
                  className="absolute left-0 bottom-10 md:left-auto md:right-0"
                  ref={emojiPickerRef}
                >
                  <Picker data={data} onEmojiSelect={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="sendButton bg-navy hover:bg-secondary px-4 items-center justify-center flex rounded-tr-md rounded-br-md"
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ color: "white" }} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
