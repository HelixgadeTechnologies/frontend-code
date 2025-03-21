import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  FormInput,
  Table,
  Modal,
  ActiveMenu,
  LoadingTable,
  EmptyTable,
} from "../../elements";

import { useQueryClient } from "@tanstack/react-query";

import { RowSelectionState } from "@tanstack/react-table";

import {
  caretDownIcon,
  filterIcon,
  sortIcon,
  userDeleteIcon,
} from "../../../assets/icons";

import {
  useGetNUPRC,
  useAddUpdateNUPRC,
} from "../../../utils/hooks/useManageNUPRC";

import {
  DeleteUserType,
  NUPRCItem,
  NUPRCsArray,
  CreateNuprc,
} from "../../../utils/types";
import { toast } from "react-toastify";
import { useDeleteAnyUser } from "../../../utils/hooks";

const NuprcTable = () => {
  const { isLoading, data } = useGetNUPRC();

  const nuprcs: NUPRCsArray = useMemo(() => {
    const _data = data?.data?.data || [];
    return _data.map((nuprc: { userId: string }) => ({
      ...nuprc,
      id: nuprc.userId,
    }));
  }, [data]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [editUser, setEditUser] = useState<NUPRCItem | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Toggle action menu
  const toggleMenu = useCallback(
    (userId: string) => {
      setActiveMenu(activeMenu === userId ? null : userId);
    },
    [activeMenu],
  );

  // Handle edit account
  const handleEdit = useCallback((user: NUPRCItem | null = null) => {
    setEditUser(user);
  }, []);

  // Handle delete account
  const handleDelete = useCallback((userId: string | null = null) => {
    setDeleteUserId(userId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the menu and the trigger button
      if (
        activeMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(
          `[data-menu-trigger="${activeMenu}"]`,
        )
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Contact Name",
        accessorKey: "name",
        cell: ({ row }: { row: { original: NUPRCItem } }) => {
          const fullName = `${row.original.firstName} ${row.original.lastName}`;
          return <span>{fullName}</span>;
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
      },

      {
        id: "phone",
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: NUPRCItem } }) => {
          const user = row.original;

          return (
            <div className="relative">
              <button
                data-menu-trigger={user?.id}
                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                onClick={() => toggleMenu(user?.id)}
                aria-label="More options"
              >
                •••
              </button>
              <ActiveMenu
                userId={user?.id}
                activeMenu={activeMenu}
                menuRef={menuRef}
                handleEdit={() => handleEdit(user)}
                handleDelete={() => handleDelete(user?.id)}
              />
            </div>
          );
        },
      },
    ],
    [activeMenu, toggleMenu, handleEdit, handleDelete],
  );

  const tableHead = ["Contact Name", "Email", "Phone Number", "action"];

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

      <>
        {isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : nuprcs && nuprcs?.length > 0 ? (
          <Table
            columns={columns}
            data={nuprcs}
            count={nuprcs.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            heading="No NUPRCS data available."
            text="Create Nuprc to get started!"
            headArr={tableHead}
          />
        )}
      </>

      {/* Modals */}
      {editUser && (
        <Modal
          body={<EditNuprc user={editUser} close={() => handleEdit(null)} />}
        />
      )}

      {deleteUserId && (
        <Modal
          body={
            <DeleteNuprc
              userId={deleteUserId}
              close={() => handleDelete(null)}
            />
          }
        />
      )}
    </div>
  );
};

const AddNuprc = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: mutateAdd } = useAddUpdateNUPRC();

  const handleAddNuprc = handleSubmit(async (data) => {
    setIsSubmitting(true);
    const payload: CreateNuprc = {
      isCreate: true,
      data: {
        phoneNumber: data?.phoneNumber,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
      },
    };

    mutateAdd(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["NUPRCs"] });
        close();
        setIsSubmitting(false);
      },
      onError: (error) => {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(`Error: ${err?.response?.data?.error}`);
        setIsSubmitting(false);
      },
    });
  });

  return (
    <form
      onSubmit={handleAddNuprc}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Add <span className="font-bold">NUPRC-ADR</span>
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Add NUPRC-ADR </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="firstName"
            type="text"
            placeholder="First Name"
            register={register}
            registerOptions={{
              required: "First name field is required.",
            }}
            error={errors.firstName}
            errorMessage={`First name  is required`}
            required
          />
        </div>

        <div>
          <FormInput
            name="lastName"
            type="text"
            placeholder="Last Name"
            register={register}
            registerOptions={{
              required: "Last name field is required.",
            }}
            error={errors.lastName}
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
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.phoneNumber}
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

          <Button
            disabled={isSubmitting}
            padding="py-3"
            buttonText={isSubmitting ? "Adding.." : "Add"}
          />
        </div>
      </div>
    </form>
  );
};

const EditNuprc = ({ close, user }: { close: () => void; user: NUPRCItem }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: mutateEdit } = useAddUpdateNUPRC();

  const handleEditNuprc = handleSubmit(async (data) => {
    setEditing(true);
    const payload: CreateNuprc = {
      isCreate: false,
      data: {
        userId: user?.id,
        phoneNumber: data?.phoneNumber,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
      },
    };

    mutateEdit(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["NUPRCs"] });
        close();
        setEditing(false);
      },
      onError: (error) => {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(`Error: ${err?.response?.data?.error}`);
        setEditing(false);
      },
    });
  });

  return (
    <form
      onSubmit={handleEditNuprc}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit <span className="font-bold">NUPRC-ADR</span>
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Edit NUPRC-ADR </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="firstName"
            type="text"
            placeholder="First Name"
            register={register}
            registerOptions={{
              required: "First name field is required.",
            }}
            error={errors.firstName}
            errorMessage={`First name  is required`}
            required
          />
        </div>

        <div>
          <FormInput
            name="lastName"
            type="text"
            placeholder="Last Name"
            register={register}
            registerOptions={{
              required: "Last name field is required.",
            }}
            error={errors.lastName}
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
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.phoneNumber}
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

          <Button
            disabled={editing}
            padding="py-3"
            buttonText={editing ? "Updating.." : "Update"}
          />
        </div>
      </div>
    </form>
  );
};

const DeleteNuprc = ({
  close,
  userId,
}: {
  close: () => void;
  userId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDelete } = useDeleteAnyUser("NUPRCs");
  const [deleting, setDeleting] = useState(false);

  const handleRemoveNuprc = async () => {
    const payload: DeleteUserType = {
      userId: userId,
    };

    setDeleting(true);

    mutateDelete(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        close();
        setDeleting(false);
        queryClient.invalidateQueries({ queryKey: ["NUPRCs"] });
      },
      onError: (error) => {
        setDeleting(false);
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(`Error: ${err?.response?.data?.error}`);
      },
    });
  };

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

        <Button
          disabled={deleting}
          onClick={handleRemoveNuprc}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={deleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
};

export { NuprcTable, AddNuprc };
