import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useForm, Controller } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";

import {
  Button,
  FormInput,
  Table,
  CustomSelect,
  Modal,
  LoadingTable,
  EmptyTable,
  ActiveMenu,
} from "../../elements";

import { RowSelectionState } from "@tanstack/react-table";
import {
  caretDownIcon,
  filterIcon,
  sortIcon,
  userDeleteIcon,
} from "../../../assets/icons";

import { useAddUpdateDRA, useGetDRAs } from "../../../utils/hooks/useManageDRA";
import { useDeleteAnyUser } from "../../../utils/hooks";
import { useGetAllTrusts } from "../../../utils/hooks/useTrusts";
import { toast } from "react-toastify";
import {
  CreateDRA,
  DeleteUserType,
  DRAsArray,
  DRAType,
} from "../../../utils/types";

const DRATable = () => {
  const { isLoading, data } = useGetDRAs();

  const dras: DRAsArray = useMemo(() => {
    const _data = data?.data?.data || [];

    return _data.map((dra: { userId: string }) => ({
      ...dra,
      id: dra.userId,
    }));
  }, [data]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [editUser, setEditUser] = useState<DRAType | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Toggle action menu
  const toggleMenu = useCallback(
    (userId: string) => {
      setActiveMenu(activeMenu === userId ? null : userId);
    },
    [activeMenu],
  );

  // Handle edit account
  const handleEdit = useCallback((user: DRAType | null = null) => {
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
        cell: ({ row }: { row: { original: DRAType } }) => {
          const fullName = `${row.original.firstName} ${row.original.lastName}`;
          return <span>{fullName}</span>;
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
      },
      // {
      //   id: "community",
      //   header: "Community",
      //   accessorKey: "community",
      // },

      {
        id: "phone",
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },

      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: DRAType } }) => {
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

      <section>
        {isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : dras && dras?.length > 0 ? (
          <Table
            columns={columns}
            data={dras}
            count={dras.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            headArr={tableHead}
            heading="No DRA data available."
            text="Create DRA to get started!"
          />
        )}
      </section>

      {/* Modals */}
      {editUser && (
        <Modal
          body={<EditDRA user={editUser} close={() => handleEdit(null)} />}
        />
      )}

      {deleteUserId && (
        <Modal
          body={
            <DeleteDRA userId={deleteUserId} close={() => handleDelete(null)} />
          }
        />
      )}
    </div>
  );
};

const AddDRA = ({ close }: { close: () => void }) => {
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading: trustLoading, data: trusts } = useGetAllTrusts();

  const allTrusts = useMemo(() => {
    if (!trusts?.data?.data) return [];

    return trusts?.data?.data?.map(
      (trust: { trustId: string; trustName: string }) => ({
        label: trust?.trustName,
        value: trust?.trustId,
      }),
    );
  }, [trusts]);

  const { mutate: mutateAddDRA } = useAddUpdateDRA();

  const handleAddDRA = handleSubmit(async (data) => {
    setIsSubmitting(true);

    const payload: CreateDRA = {
      isCreate: true,
      data: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        trust: data?.trust.value,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
      },
    };

    mutateAddDRA(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["DRAs"] });

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
      onSubmit={handleAddDRA}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Add DRA
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Add DRA </p>

      <div className="space-y-2">
        <div>
          <FormInput
            label="First Name"
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
            label="Last Name"
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
            label="Email Address"
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

        <div>
          <FormInput
            label="Phone Number"
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

        <div>
          <Controller
            control={control}
            name="trust"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                isLoading={trustLoading}
                options={allTrusts}
                label="Trust"
                placeholder="Eleme-234-Trust"
              />
            )}
          />
          {errors.trust && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Trust</p>
          )}
        </div>

        <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
            buttonText="Back"
            width="w-fit"
          />

          <Button
            disabled={isSubmitting}
            padding="py-3"
            buttonText={isSubmitting ? "Inviting.." : "Invite"}
          />
        </div>
      </div>
    </form>
  );
};

const EditDRA = ({ close, user }: { close: () => void; user: DRAType }) => {
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm();

  const [editing, setEditing] = useState(false);

  const { isLoading: trustLoading, data: trusts } = useGetAllTrusts();

  const allTrusts = useMemo(() => {
    if (!trusts?.data?.data) return [];

    return trusts?.data?.data?.map(
      (trust: { trustId: string; trustName: string }) => ({
        label: trust?.trustName,
        value: trust?.trustId,
      }),
    );
  }, [trusts]);

  const { mutate: mutateEditDRA } = useAddUpdateDRA();

  const handleEditDRA = handleSubmit(async (data) => {
    setEditing(true);

    const payload: CreateDRA = {
      isCreate: false,
      data: {
        userId: user?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        trust: data?.trust.value,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
      },
    };

    mutateEditDRA(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["DRAs"] });
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

  // Reset form when user changes
  useEffect(() => {
    // Only reset the form when both user and role data are available
    if (user && allTrusts.length > 0) {
      const userTrust =
        allTrusts.find(
          (trust: { value: string }) => trust.value === user?.trusts,
        ) || null;

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        trust: userTrust,
        phoneNumber: user?.phoneNumber,
      });
    }
  }, [user, reset, allTrusts]);

  return (
    <form
      onSubmit={handleEditDRA}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit DRA
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">Edit DRA </p>

      <div className="space-y-2">
        <div>
          <FormInput
            label="First Name"
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
            label="Last Name"
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
            label="Email Address"
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

        <div>
          <FormInput
            label="Phone Number"
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

        <div>
          <Controller
            control={control}
            name="trust"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                options={allTrusts}
                isLoading={trustLoading}
                label="Trust"
                placeholder="Eleme-234-Trust"
              />
            )}
          />
          {errors.trust && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Trust</p>
          )}
        </div>

        <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
            buttonText="Back"
            width="w-fit"
          />

          <Button
            disabled={editing}
            padding="py-3"
            buttonText={editing ? "Updating" : "Update"}
          />
        </div>
      </div>
    </form>
  );
};

const DeleteDRA = ({
  close,
  userId,
}: {
  close: () => void;
  userId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteDRA } = useDeleteAnyUser("DRAs");
  const [deleting, setDeleting] = useState(false);

  const handleRemoveDRA = async () => {
    const payload: DeleteUserType = {
      userId: userId,
    };

    setDeleting(true);

    mutateDeleteDRA(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        close();
        setDeleting(false);

        queryClient.invalidateQueries({ queryKey: ["DRAs"] });
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
          Delete DRA
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete a DRA{" "}
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
          onClick={handleRemoveDRA}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={deleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
};

export { DRATable, AddDRA };
