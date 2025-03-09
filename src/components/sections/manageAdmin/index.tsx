import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Button,
  FormInput,
  Table,
  CustomSelect,
  Modal,
} from "../../../components/elements";

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

const adminRoles = [
  {
    id: 1,
    label: "Admin",
    value: "admin",
  },
  {
    id: 2,
    label: "Super Admin",
    value: "super-admin",
  },
];

const AdminTable = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
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
  const handleEdit = () => {
    setOpenEdit(!openEdit);
  };

  // Handle delete account
  const handleDelete = () => {
    setOpenDelete(!openDelete);
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
            onClick={handleEdit}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-6 hover:bg-gray-1"
          >
            <img src={editIcon} alt="edit admin" />
            Edit account
          </button>
          <button
            onClick={handleDelete}
            className="flex gap-x-2 items-center w-full px-4 py-3 text-sm text-gray-6 hover:bg-gray-1"
          >
            <img src={trashGrayIcon} alt="delete admin" />
            Delete account
          </button>
        </div>

        {openEdit && (
          <Modal close={handleEdit} body={<EditAdmin close={handleEdit} />} />
        )}

        {openDelete && (
          <Modal
            close={handleDelete}
            body={<DeleteAdmin close={handleDelete} />}
          />
        )}
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
              className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
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
    control,
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Add Admin
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">
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

        <div>
          <Controller
            control={control}
            name="role"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="role-select"
                {...field}
                options={adminRoles}
                label="Nationality"
                placeholder="Role"
              />
            )}
          />
          {errors.role && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Role</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="trust"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                options={adminRoles}
                label="Trust"
                placeholder="Assign Trust"
              />
            )}
          />
          {errors.trust && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
          )}
        </div>

        <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            border
            padding="py-2 px-3"
            buttonText="Back"
            width="w-fit"
          />

          <Button padding="py-3" buttonText="Invite" />
        </div>
      </div>
    </form>
  );
};

const EditAdmin = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit Admin
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">
        Make edits Admin to this account
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

        <div>
          <Controller
            control={control}
            name="role"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="role-select"
                {...field}
                options={adminRoles}
                label="Nationality"
                placeholder="Role"
              />
            )}
          />
          {errors.role && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Role</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="trust"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                options={adminRoles}
                label="Trust"
                placeholder="Assign Trust"
              />
            )}
          />
          {errors.trust && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
          )}
        </div>

        <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            border
            padding="py-2 px-3"
            buttonText="Back"
            width="w-fit"
          />

          <Button padding="py-3" buttonText="Update" />
        </div>
      </div>
    </form>
  );
};

const DeleteAdmin = ({ close }: { close: () => void }) => {
  return (
    <div className="p-6 bg-white h-fit w-[430px] rounded-2xl">
      <div className=" border border-gray-300 bg-[#E4E5E77A]/40 mx-auto h-14 w-14 rounded-full flex items-center justify-center">
        <div className="shadow-md bg-white h-10 w-10 rounded-full flex items-center justify-center">
          icon
        </div>
      </div>

      <div className="mt-6 mb-12">
        <h3 className="text-lg xl:text-2xl text-center font-normal text-dark-2">
          Delete Admin
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete the admin.{" "}
          <span className="font-medium">Are you sure about that? </span>
        </p>
      </div>

      <div className=" gap-x-8 flex items-center justify-center">
        <Button
          onClick={close}
          className="underline font-medium text-dark-2"
          buttonText="Cancel"
          width="w-fit"
        />

        <Button width="w-fit" padding="py-3 px-14" buttonText="Remove" />
      </div>
    </div>
  );
};

export { AddAdmin, AdminTable };

// const selectedUsers = users.filter(
//   (user) => rowSelection[user.id.toString()] === true,
// );
