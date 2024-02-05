import { useAuth } from "@/context/auth/AuthContextProvider";
import React, { ChangeEvent, SyntheticEvent, createRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../reusables/Avatar";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import getAvatarImage from "@/utils/getAvatarImage";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { AuthActionTypes } from "@/context/auth/authActions";
import { ISimpleUser, IUser, IUserType } from "@/Types/User";
import Loading from "../../assets/images/gear.gif";
import { Checkbox } from "@material-tailwind/react";

type UserInputType = {
  name: string | undefined;
  contactNumber: string | undefined;
  location: string | undefined;
};
function Profile() {
  const { state, dispatch } = useAuth();
  const [imageUpdating, setImageUpdating] = useState<boolean>(false);
  const [updatingData, setUpdatingData] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserInputType>({
    name: state.user?.name,

    contactNumber: state.user?.contactNumber,
    location: state.user?.location,
  });

  const profileInputRef = createRef<HTMLInputElement>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userData.name) {
      toast.error("Please enter name");
      return;
    }
    try {
      const response: AxiosResponse<IUserType> = await axios.put(
        "/user/profile",
        userData
      );
      toast.success("Profile updated successfully.");
      dispatch({ type: AuthActionTypes.EditInfo, payload: response.data });
    } catch (err: any) {
      toast.error(err?.response?.data.message || "Error updating info");
    } finally {
    }
  };

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      try {
        setImageUpdating(true);
        const response: AxiosResponse<IUserType> = await axios.post(
          "/user/profileimage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        dispatch({
          type: AuthActionTypes.EditProfileImage,
          payload: response.data,
        });
        toast.success("Profile image updated successfully.");
      } catch (err) {
        toast.error("Error updating profile image.");
      } finally {
        setImageUpdating(false);
      }
    }
  };

  const handleFileInputOpen = () => {
    if (profileInputRef.current) {
      profileInputRef.current.click();
    }
  };

  const handlePreferenceChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    const preferences = {
      ...state.user?.preferences,
      [e.target.name]: e.target.checked,
    };
    console.log(preferences);
    try {
      const response: AxiosResponse<IUserType> = await axios.put(
        "/user/preferences",
        preferences
      );
      dispatch({
        type: AuthActionTypes.EditPreferences,
        payload: response.data,
      });
    } catch (err: any) {
      toast.error(err?.response?.data.message || "Error updating preference");
    }
  };

  return (
    <div className="w-screen  md:w-[40rem] bg-white p-8 flex  flex-col justify-start">
      <h2 className="w-full text-center font-medium text-xl">
        Profile settings
      </h2>
      <div>
        <p className="font-normal text-gray-600 mb-4">General settings</p>
        <div
          className="avatar relative max-w-[60px] ml-4"
          onClick={handleFileInputOpen}
        >
          <Avatar
            className="w-[60px] h-[60px]"
            source={
              imageUpdating
                ? Loading.src
                : getAvatarImage(state.user?.profilePic)
            }
          />
          <input
            ref={profileInputRef}
            onChange={handleProfileImageChange}
            type="file"
            accept="image/*"
            className="opacity-0 h-full w-full"
          />

          <div className="absolute top-0 right-0">
            <div className="icon  absolute inset-0">
              <FontAwesomeIcon className="text-navy" icon={faPencil} />
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="mt-4 flex flex-col gap-2 ml-4"
      >
        <div className="max-w-full flex flex-row items-center  gap-2">
          <p className="text-gray-500 hidden md:block">Name:</p>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="rounded-md w-full md:ml-5 bg-gray-300 text-gray-600 p-3 outline-none focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div className="w-full flex flex-row items-center  gap-2">
          <p className="text-gray-500 hidden md:block">Contact:</p>
          <input
            type="tel"
            name="contactNumber"
            value={userData.contactNumber}
            onChange={handleInputChange}
            className="rounded-md w-full  bg-gray-300 md:ml-1 text-gray-600 p-3 outline-none focus:outline-none"
            placeholder="Enter contact number"
          />
        </div>
        <div className="w-full flex flex-row items-center  gap-2">
          <p className="text-gray-500 hidden md:block">Location:</p>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleInputChange}
            className="rounded-md w-full   bg-gray-300 text-gray-600 p-3 outline-none focus:outline-none"
            placeholder="Enter your location"
          />
        </div>
        <button
          className="bg-primary hover:bg-navy transition-all  w-[100px] mt-2 text-white rounded-md p-4 text-md "
          onClick={() => {}}
        >
          Submit
        </button>
      </form>

      <div className="mt-8">
        <p className="font-normal text-gray-600 mb-4">
          Notification preferences
        </p>
        <div className="mt-2 flex flex-col gap-2 ml-4">
          <div className="w-60 flex items-center justify-between">
            <p className="text-gray-500">Notifications</p>
            <Checkbox
              checked={state.user?.preferences.notification}
              onChange={handlePreferenceChange}
              name="notification"
              color="gray"
              containerProps={{
                className: "w-10 h-10",
              }}
              className=" h-full w-full bg-transparent accent-navy"
              crossOrigin={"anonymous"}
            />
          </div>
          <div className="w-60 flex items-center justify-between">
            <p className="text-gray-500">Emails</p>
            <Checkbox
              name="emails"
              onChange={handlePreferenceChange}
              checked={state.user?.preferences.emails}
              color="gray"
              containerProps={{
                className: "w-10 h-10",
              }}
              className=" h-full w-full bg-transparent accent-navy"
              crossOrigin={"anonymous"}
            />
          </div>
          <div className="w-60 flex items-center justify-between">
            <p className="text-gray-500">Messages</p>
            <Checkbox
              onChange={handlePreferenceChange}
              checked={state.user?.preferences.messages}
              color="gray"
              name="messages"
              containerProps={{
                className: "w-10 h-10",
              }}
              className=" h-full w-full bg-transparent accent-navy"
              crossOrigin={"anonymous"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
