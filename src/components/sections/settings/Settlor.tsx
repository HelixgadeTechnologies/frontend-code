import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";

import {
  Button,
  FormInput,
  Table,
  Modal,
  EmptyTable,
  LoadingTable,
  ActiveMenu,
} from "../../elements";

import { RowSelectionState } from "@tanstack/react-table";
import {
  caretDownIcon,
  filterIcon,
  sortIcon,
  userDeleteIcon,
} from "../../../assets/icons";

import { toast } from "react-toastify";

// Type props
import {
  SettlorsArray,
  SettlorType,
  CreateSettlor,
  DeleteSettlorType,
} from "../../../utils/types";

import {
  useAddUpdateSettlor,
  useDeleteSettlor,
  useGetSettlors,
} from "../../../utils/hooks/useManageSettlors";

const SettlorsTable = () => {
  const { isLoading, data } = useGetSettlors();

  const settlors: SettlorsArray = useMemo(() => {
    const settlorData = data?.data?.data || [];
    return settlorData.map((settlor: { settlorId: string }) => ({
      ...settlor,
      id: settlor.settlorId,
    }));
  }, [data]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [editUser, setEditUser] = useState<SettlorType | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Toggle action menu
  const toggleMenu = useCallback(
    (userId: string) => {
      setActiveMenu(activeMenu === userId ? null : userId);
    },
    [activeMenu],
  );

  // Handle edit account
  const handleEdit = useCallback((user: SettlorType | null = null) => {
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
        accessorKey: "contactName",
      },
      {
        id: "settlor-name",
        header: "Settlor Name",
        accessorKey: "settlorName",
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "contactEmail",
      },

      {
        id: "Phone",
        header: "Phone Number",
        accessorKey: "contactPhoneNumber",
      },

      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: SettlorType } }) => {
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

  const tableHead = [
    "Contact Name",
    "Settlor Name",
    "Email",
    "Phone Number",
    "action",
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
      <>
        {isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : settlors && settlors?.length > 0 ? (
          <Table
            columns={columns}
            data={settlors}
            count={settlors.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            headArr={tableHead}
            heading="No Settlors data available."
            text="Create Settlor to get started!"
          />
        )}
      </>

      {/* Modals */}
      {editUser && (
        <Modal
          body={<EditSettlor user={editUser} close={() => handleEdit(null)} />}
        />
      )}

      {deleteUserId && (
        <Modal
          body={
            <DeleteSettlor
              userId={deleteUserId}
              close={() => handleDelete(null)}
            />
          }
        />
      )}
    </div>
  );
};

const AddSettlor = ({ close }: { close: () => void }) => {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [submitting, setIsSubmitting] = useState(false);

  //  edit settlor
  const { mutate: mutateAdd } = useAddUpdateSettlor();

  const handleAddSettlor = handleSubmit(async (data) => {
    const payload: CreateSettlor = {
      isCreate: true,
      data: {
        settlorName: data?.settlorName,
        contactName: data?.contactName,
        contactEmail: data?.contactEmail,
        contactPhoneNumber: data?.contactPhoneNumber,
        omlCode: data?.omlCode,
      },
    };

    setIsSubmitting(true);

    mutateAdd(payload, {
      onSuccess: (res) => {
        setIsSubmitting(false);
        toast.success(res?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["settlors"] });
        close();
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
      onSubmit={handleAddSettlor}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Add Settlor
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">
        Add a Settlor to this account{" "}
      </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="settlorName"
            type="text"
            placeholder="Enter Settlor Name"
            register={register}
            registerOptions={{
              required: "Settlor name field is required.",
            }}
            error={errors.settlorName}
            errorMessage={`"Settlor name field is required."`}
            required
          />
        </div>

        <div>
          <FormInput
            name="omlCode"
            type="text"
            placeholder="Enter OML Code"
            register={register}
            registerOptions={{
              required: "OML code field is required.",
            }}
            error={errors.omlCode}
            errorMessage={`OML code is required`}
            required
          />
        </div>

        <div>
          <FormInput
            name="contactName"
            type="text"
            placeholder="Enter Contact Name"
            register={register}
            registerOptions={{
              required: "Contact name field is required.",
            }}
            error={errors.contactName}
            errorMessage={`"Contact name field is required."`}
            required
          />
        </div>

        <div>
          <FormInput
            name="contactEmail"
            type="email"
            placeholder="Enter Contact Email"
            register={register}
            registerOptions={{
              required: "Email field is required.",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                message: "Please enter a valid email.",
              },
            }}
            error={errors.contactEmail}
            errorMessage={`Email address is required`}
            required
          />
        </div>

        <div className="pb-4">
          <FormInput
            name="contactPhoneNumber"
            type="tel"
            placeholder="Enter Contact Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.contactPhoneNumber}
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
            disabled={submitting}
            padding="py-3"
            buttonText={submitting ? "Adding.." : "Add"}
          />
        </div>
      </div>
    </form>
  );
};

const EditSettlor = ({
  close,
  user,
}: {
  close: () => void;
  user: SettlorType;
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [editing, setEditing] = useState(false);

  //  edit settlor
  const { mutate: mutateEdit } = useAddUpdateSettlor();

  const handleUpdateSettlor = useCallback(
    handleSubmit(async (data) => {
      const payload: CreateSettlor = {
        isCreate: false,
        data: {
          settlorId: user?.id,
          settlorName: data?.settlorName,
          contactName: data?.contactName,
          contactEmail: data?.contactEmail,
          contactPhoneNumber: data?.contactPhoneNumber,
          omlCode: data?.omlCode,
        },
      };

      setEditing(true);

      mutateEdit(payload, {
        onSuccess: (res) => {
          toast.success(res?.data?.message);
          setEditing(false);
          queryClient.invalidateQueries({ queryKey: ["settlors"] });
          close();
        },
        onError: (error) => {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(`Error: ${err?.response?.data?.error}`);
          setEditing(false);
        },
      });
    }),
    [user?.id, mutateEdit, close],
  );

  // Reset form when user changes
  useEffect(() => {
    // Only reset the form when both user and role data are available
    if (user) {
      reset({
        settlorName: user.settlorName || "",
        contactName: user.contactName || "",
        contactEmail: user.contactEmail || "",
        contactPhoneNumber: user?.contactPhoneNumber || "",
        omlCode: user?.omlCode || "",
      });
    }
  }, [user, reset]);

  return (
    <form
      onSubmit={handleUpdateSettlor}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit Settlor
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">
        Edit Settlor account{" "}
      </p>

      <div className="space-y-2">
        <div>
          <FormInput
            name="settlorName"
            type="text"
            placeholder="Enter Settlor Name"
            register={register}
            registerOptions={{
              required: "Settlor name field is required.",
            }}
            error={errors.settlorName}
            errorMessage={`"Settlor name field is required."`}
            required
          />
        </div>

        <div>
          <FormInput
            name="omlCode"
            type="text"
            placeholder="Enter OML Code"
            register={register}
            registerOptions={{
              required: "OML code field is required.",
            }}
            error={errors.omlCode}
            errorMessage={`OML code is required`}
            required
          />
        </div>

        <div>
          <FormInput
            name="contactName"
            type="text"
            placeholder="Enter Contact Name"
            register={register}
            registerOptions={{
              required: "Contact name field is required.",
            }}
            error={errors.contactName}
            errorMessage={`"Contact name field is required."`}
            required
          />
        </div>

        <div>
          <FormInput
            name="contactEmail"
            type="email"
            placeholder="Enter Contact Email"
            register={register}
            registerOptions={{
              required: "Email field is required.",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                message: "Please enter a valid email.",
              },
            }}
            error={errors.contactEmail}
            errorMessage={`Email address is required`}
            required
          />
        </div>

        <div className="pb-4">
          <FormInput
            name="contactPhoneNumber"
            type="tel"
            placeholder="Enter Contact Phone Number"
            register={register}
            registerOptions={{
              required: "Phone Number is required.",
            }}
            error={errors.contactPhoneNumber}
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
            padding="py-3"
            buttonText={editing ? "Updating..." : "Update"}
            disabled={editing}
          />
        </div>
      </div>
    </form>
  );
};

const DeleteSettlor = ({
  close,
  userId,
}: {
  close: () => void;
  userId: string;
}) => {
  const { mutate: mutateDelete } = useDeleteSettlor();
  const [deleting, setDeleting] = useState(false);

  const handleRemoveSettlor = async () => {
    const payload: DeleteSettlorType = {
      settlorId: userId,
    };

    setDeleting(true);

    mutateDelete(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        close();
        setDeleting(false);
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
          Delete Settlor
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete a Settlor{" "}
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
          onClick={handleRemoveSettlor}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={deleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
};

export { SettlorsTable, AddSettlor };
