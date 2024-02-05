import React, { ReactNode } from "react";

export interface IPopup {
  onClose: () => void;
  children: ReactNode;
}
function Popup({ children, onClose }: IPopup) {
  return (
    <div className="popupcontainer absolute inset-0 flex items-center justify-center z-20  px-4">
      <div
        onClick={onClose}
        className="backdrop bg-black/100 opacity-50 absolute inset-0 z-1"
      ></div>
      <div className="popupchildren z-10">{children}</div>
    </div>
  );
}

export default Popup;
