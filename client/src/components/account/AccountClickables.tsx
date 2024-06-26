import React, { useState } from "react";
import Avatar from "../reusables/Avatar";
import logout from "../../assets/icons/logout.svg";
import { useAuth } from "@/context/auth/AuthContextProvider";
import { AuthActionTypes } from "@/context/auth/authActions";
import { useRouter } from "next/router";
import { BASE_PATH } from "@/config/keys";
import Popup from "../layouts/Popup";
import Profile from "./Profile";

const AccountClickables = () => {
  const {
    state: { isLoggedIn, user },
    dispatch,
  } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };

  const router = useRouter();

  const handleLogOut = () => {
    document.cookie = `Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    dispatch && dispatch({ type: AuthActionTypes.LogOut, payload: undefined });

    router.push("/auth/login");
  };

  return (
    <>
      {isProfileOpen ? (
        <Popup onClose={handleProfileClose}>
          <Profile />
        </Popup>
      ) : (
        ""
      )}

      <div className="w-100 flex items-center justify-between py-8 px-4 relative h-10 lg:px-[10px] lg:h-min-10">
        {isLoggedIn ? (
          <div className="clickables flex flex-row items-center gap-2 lg:flex-col">
            <div onClick={handleProfileOpen}>
              <Avatar
                className="h-[30px] w-[30px] "
                source={
                  user &&
                  `${BASE_PATH}/static/images/userImages/${user.profilePic}`
                }
              />
            </div>

            <div>
              <img
                onClick={handleLogOut}
                src={logout.src}
                className="w-[25px]"
                alt=""
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AccountClickables;
