import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, FormInput, Table } from "../../../components/elements";

import { RowSelectionState } from "@tanstack/react-table";
import { editIcon, trashGrayIcon } from "../../../assets/icons";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Amarachi Okafor",
    email: "amarachiokafor@gmail.com",
    role: "Super Admin",
  },
  {
    id: "2",
    name: "Alex Okocha",
    email: "alexokocha@gmail.com",
    role: "Admin",
  },
  {
    id: "3",
    name: "Mwenda Mugendi",
    email: "princewilliams@gmail.com",
    role: "Admin",
  },
];

const AdminTable = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const actionButtonsRef = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );
  // Toggle action menu
  const toggleMenu = (userId: string) => {
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  // Handle edit account
  const handleEdit = (userId: string) => {
    console.log("Editing user:", userId);
    setActiveMenu(null);
  };

  // Handle delete account
  const handleDelete = (userId: string) => {
    console.log("Deleting user:", userId);
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the menu and the trigger button
      if (
        activeMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(
          actionButtonsRef.current[activeMenu] &&
          actionButtonsRef.current[activeMenu]?.contains(event.target as Node)
        )
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Correctly position the dropdown based on available space
  const ActionMenu = ({ userId }: { userId: string }) => {
    const [menuPosition, setMenuPosition] = useState<{ top: boolean }>({
      top: false,
    });

    useEffect(() => {
      if (activeMenu === userId) {
        const buttonElement = actionButtonsRef.current[userId];
        const menuElement = menuRef.current;

        if (buttonElement && menuElement) {
          const buttonRect = buttonElement.getBoundingClientRect();
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const menuHeight = menuElement.offsetHeight;

          // If there's not enough space below, position above
          setMenuPosition({ top: spaceBelow < menuHeight });
        }
      }
    }, [userId]);

    return activeMenu === userId ? (
      <div
        ref={menuRef}
        className={`absolute ${
          menuPosition.top ? "bottom-0 mb-2" : "top-0 mt-2"
        }  right-0 w-48 bg-white rounded-xl shadow-lg z-30 `}
      >
        <div className="py-1">
          <button
            onClick={() => handleEdit(userId)}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <img src={editIcon} alt="edit admin" />
            Edit account
          </button>
          <button
            onClick={() => handleDelete(userId)}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <img src={trashGrayIcon} alt="delete admin" />
            Delete account
          </button>
        </div>
      </div>
    ) : null;
  };

  // Define columns
  const columns = [
    {
      id: "name",
      header: "Team member Name",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "role",
      header: "Account type",
      accessorKey: "role",
      cell: ({ row }: { row: { original: User } }) => {
        const role = row.original.role;
        return (
          <span
            className={`
              px-3 py-1 rounded-full
              ${
                role === "Super Admin"
                  ? "bg-light-green text-dark-green-1"
                  : "bg-light-orange text-dark-orange"
              }
              `}
          >
            {role}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: User } }) => {
        const userId = row.original.id;
        return (
          <div className="relative">
            <button
              ref={(el: HTMLButtonElement | null) => {
                actionButtonsRef.current[userId] = el;
              }}
              className="px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => toggleMenu(userId)}
              aria-label="More options"
            >
              •••
            </button>
            <ActionMenu userId={userId} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Table
        columns={columns}
        data={users}
        count={users.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};

const AddAdmin = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center mb-12 font-normal text-dark-2">
        Add Admin
      </h3>

      <p className="text-base my-1 text-gray-600">
        Add an Admin to this account
      </p>

      <div className="space-y-2">
        <div>
          <FormInput
            label="First Name"
            name="fname"
            type="text"
            register={register}
            registerOptions={{
              required: "First name field is required.",
            }}
            error={errors.fname}
            errorMessage={`First name  is required`}
            required
          />
        </div>

        <div>
          <FormInput
            label="Last Name"
            name="lname"
            type="text"
            register={register}
            registerOptions={{
              required: "Last name field is required.",
            }}
            error={errors.lname}
            errorMessage={`Last name  is required`}
            required
          />
        </div>

        <div>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            registerOptions={{
              required: "Email field is required.",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                message: "Please enter a valid email.",
              },
            }}
            error={errors.email}
            errorMessage={`Email address is required`}
            required
          />
        </div>

        <div className="flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            border
            padding="py-2 px-3"
            buttonText="Back"
            width="w-fit"
          />

          <Button padding="py-3" buttonText="Change" />
        </div>
      </div>
    </form>
  );
};

export { AddAdmin, AdminTable };

// const selectedUsers = users.filter(
//   (user) => rowSelection[user.id.toString()] === true,
// );
