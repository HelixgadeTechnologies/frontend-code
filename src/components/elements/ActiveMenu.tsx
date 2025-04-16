import React, { useEffect, useState } from "react";
import { ActiveMenuProps } from "../../utils/types";
import { trashGrayIcon, editIcon } from "../../assets/icons";

const ActiveMenu: React.FC<ActiveMenuProps> = React.memo(
  ({ userId, activeMenu, menuRef, handleEdit, handleDelete }) => {
    const [menuPosition, setMenuPosition] = useState<{
      top: number;
      left: number;
      transformOrigin: string;
    }>({
      top: 0,
      left: 0,
      transformOrigin: "top left",
    });

    useEffect(() => {
      // Only calculate position when menu is active for this user
      if (activeMenu !== userId) return;

      // Get the button that triggered this menu
      const buttonElement = document.querySelector(
        `[data-menu-trigger="${userId}"]`,
      );

      if (buttonElement && menuRef.current) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - buttonRect.bottom;

        // Calculate position
        let topPosition;
        let origin = "top left";

        // Check if enough space below
        if (spaceBelow < menuHeight + 10) {
          // Position above the button if not enough space below
          topPosition = buttonRect.top - menuHeight;
          origin = "bottom left";
        } else {
          // Position below the button
          topPosition = buttonRect.bottom;
        }

        setMenuPosition({
          top: topPosition,
          left: buttonRect.left - 130, // Position menu so that it's aligned to the right of the button
          transformOrigin: origin,
        });
      }
    }, [activeMenu, userId, menuRef]);

    if (activeMenu !== userId) {
      return null;
    }

    return (
      <div
        ref={menuRef}
        className="absolute bg-white rounded-xl shadow-lg w-48 z-50"
        style={{
          position: "fixed",
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          transformOrigin: menuPosition.transformOrigin,
        }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-6 hover:bg-gray-1"
          >
            <img src={editIcon} alt="edit admin" />
            Edit account
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-6 hover:bg-gray-1"
          >
            <img src={trashGrayIcon} alt="delete admin" />
            Delete account
          </button>
        </div>
      </div>
    );
  },
);

export default ActiveMenu;
