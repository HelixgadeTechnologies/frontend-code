import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, FormInput, Table, Modal } from "../../elements";

import { RowSelectionState } from "@tanstack/react-table";
import {
  caretDownIcon,
  editIcon,
  filterIcon,
  sortIcon,
  trashGrayIcon,
  userDeleteIcon,
} from "../../../assets/icons";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Amarachi Okafor",
    email: "amarachiokafor@gmail.com",
    phone: "08012345678",
  },
  {
    id: "2",
    name: "Alex Okocha",
    email: "alexokocha@gmail.com",
    phone: "08012345678",
  },
  {
    id: "3",
    name: "Mwenda Mugendi",
    email: "princewilliams@gmail.com",
    phone: "08012345678",
  },
];

const NuprcTable = () => {
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
          <Modal close={handleEdit} body={<EditNuprc close={handleEdit} />} />
        )}

        {openDelete && (
          <Modal
            close={handleDelete}
            body={<DeleteNuprc close={handleDelete} />}
          />
        )}
      </div>
    ) : null;
  };

  // Define columns
  const columns = [
    {
      id: "name",
      header: "Contact Name",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },

    {
      id: "phone",
      header: "Phone Number",
      accessorKey: "phone",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <span
            className={`
              px-3 py-1 rounded-full
              ${
                user?.id === "1"
                  ? "bg-light-green text-dark-green-1"
                  : "bg-light-orange text-dark-orange"
              }
              `}
          >
            {user?.phone}
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
    <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
      <section className="mb-4 flex items-center justify-end gap-x-3">
        <button className=" shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
          <img src={filterIcon} alt="filter admin table" />
          <span className="font-medium text-sm  text-[#525866]">Filter</span>
        </button>

        <button className="shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
          <img src={sortIcon} alt="filter admin table" />
          <span className="font-medium text-sm  text-[#525866]">Sort</span>
          <img src={caretDownIcon} alt="filter admin table" />
        </button>
      </section>
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

const AddNuprc = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Add <span className="font-bold">NUPRC-ADR</span>
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Add NUPRC-ADR </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="fname"
            type="text"
            placeholder="First Name"
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
            name="lname"
            type="text"
            placeholder="Last Name"
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
            name="email"
            type="email"
            placeholder="Email Address"
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

        <div className="pb-4">
          <FormInput
            name="phone"
            type="tel"
            placeholder="Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.phone}
            errorMessage={`Phone Number is required`}
            required
          />
        </div>

        <div className=" border-t border-gray-7 pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
            buttonText="Back"
            width="w-fit"
          />

          <Button padding="py-3" buttonText="Add" />
        </div>
      </div>
    </form>
  );
};

const EditNuprc = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit <span className="font-bold">NUPRC-ADR</span>
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Edit NUPRC-ADR </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="fname"
            type="text"
            placeholder="First Name"
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
            name="lname"
            type="text"
            placeholder="Last Name"
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
            name="email"
            type="email"
            placeholder="Email Address"
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

        <div className="pb-4">
          <FormInput
            name="phone"
            type="tel"
            placeholder="Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.phone}
            errorMessage={`Phone Number is required`}
            required
          />
        </div>

        <div className=" border-t border-gray-7 pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
            buttonText="Back"
            width="w-fit"
          />

          <Button padding="py-3" buttonText="Update" />
        </div>
      </div>
    </form>
  );
};

const DeleteNuprc = ({ close }: { close: () => void }) => {
  return (
    <div className="p-6 bg-white h-fit w-[430px] rounded-2xl">
      <div className=" border border-gray-300 bg-[#E4E5E77A]/40 mx-auto h-14 w-14 rounded-full flex items-center justify-center">
        <div className="shadow-md bg-white h-10 w-10 rounded-full flex items-center justify-center">
          <img src={userDeleteIcon} alt="delete" />
        </div>
      </div>

      <div className="mt-6 mb-12">
        <h3 className="text-lg xl:text-2xl text-center font-normal text-dark-2">
          Delete NUPRC-ADR
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete a NUPRC-ADR{" "}
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

export { NuprcTable, AddNuprc };
