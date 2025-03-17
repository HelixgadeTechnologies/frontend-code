import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Button,
  FormInput,
  Table,
  CustomSelect,
  Modal,
  EmptyTable,
  LoadingTable,
} from "../../elements";

import { RowSelectionState } from "@tanstack/react-table";
import {
  caretDownIcon,
  editIcon,
  filterIcon,
  sortIcon,
  trashGrayIcon,
  userDeleteIcon,
} from "../../../assets/icons";

import { toast } from "react-toastify";

// Type props
import {
  AdminsArray,
  AdminUser,
  CreateAdmin,
  ActiveMenuProps,
  DeleteUserType,
} from "../../../utils/types";

import {
  useAddUpdateAdmin,
  useGetAdmins,
} from "../../../utils/hooks/useManageAdmin";
import { useGetRoles } from "../../../utils/hooks";
import { useGetAllTrusts } from "../../../utils/hooks/useTrusts";
import { useDeleteAnyUser } from "../../../utils/hooks";

const AdminTable = () => {
  const { isLoading, data } = useGetAdmins();

  const admins: AdminsArray = useMemo(() => {
    const adminData = data?.data?.data || [];
    return adminData.map((admin: { userId: string }) => ({
      ...admin,
      id: admin.userId,
    }));
  }, [data]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Toggle action menu
  const toggleMenu = useCallback(
    (userId: string) => {
      setActiveMenu(activeMenu === userId ? null : userId);
    },
    [activeMenu],
  );

  // Handle edit account
  const handleEdit = useCallback((user: AdminUser | null = null) => {
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

  // Define columns with memoization
  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Team member Name",
        accessorKey: "name",
        cell: ({ row }: { row: { original: AdminUser } }) => {
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
        id: "role",
        header: "Account type",
        accessorKey: "role",
        cell: ({ row }: { row: { original: AdminUser } }) => {
          const role = row.original.role;
          return (
            <span
              className={`
              px-3 py-1 rounded-full
              ${
                role === "SUPER ADMIN"
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
        cell: ({ row }: { row: { original: AdminUser } }) => {
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

  const tableHead = ["Team Member Name", "Email", "Account Type", "action"];

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
        ) : admins && admins?.length > 0 ? (
          <Table
            columns={columns}
            data={admins}
            count={admins?.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            headArr={tableHead}
            heading="No Admin data available."
            text="Create admin to get started!"
          />
        )}
      </>

      {/* Modals */}
      {editUser && (
        <Modal
          body={<EditAdmin user={editUser} close={() => handleEdit(null)} />}
        />
      )}

      {deleteUserId && (
        <Modal
          body={
            <DeleteAdmin
              userId={deleteUserId}
              close={() => handleDelete(null)}
            />
          }
        />
      )}
    </div>
  );
};

const ActiveMenu: React.FC<ActiveMenuProps> = React.memo(
  ({ userId, activeMenu, menuRef, handleEdit, handleDelete }) => {
    const [menuPosition, setMenuPosition] = useState<{
      top: number;
      right: number;
    }>({
      top: 0,
      right: 0,
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
        if (spaceBelow < menuHeight) {
          // Position above the button if not enough space below
          topPosition = -menuHeight;
        } else {
          // Position below the button
          topPosition = buttonRect.height;
        }

        setMenuPosition({
          top: topPosition,
          right: 0,
        });
      }
    }, [activeMenu, userId, menuRef]);

    if (activeMenu !== userId) {
      return null;
    }

    return (
      <div
        ref={menuRef}
        className="absolute bg-white rounded-xl shadow-lg w-48 z-10"
        style={{
          top: `${menuPosition.top}px`,
          right: `${menuPosition.right}px`,
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
const AddAdmin = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch roles and trust
  const { isLoading, data } = useGetRoles();

  const { isLoading: trustLoading, data: trusts } = useGetAllTrusts();

  const roles = useMemo(() => {
    if (!data?.data?.data) return [];

    return data?.data?.data?.map(
      (role: { roleName: string; roleId: string }) => ({
        label: role?.roleName,
        value: role?.roleId,
      }),
    );
  }, [data]);

  const allTrusts = useMemo(() => {
    if (!trusts?.data?.data) return [];

    return trusts?.data?.data?.map(
      (trust: { trustId: string; trustName: string }) => ({
        label: trust?.trustName,
        value: trust?.trustId,
      }),
    );
  }, [trusts]);

  //  add admin
  const { mutate: mutateAddAdmin } = useAddUpdateAdmin();

  const handleAddAdmin = handleSubmit(async (data) => {
    setIsSubmitting(true);
    const payload: CreateAdmin = {
      isCreate: true,
      data: {
        roleId: data?.roleId?.value,
        trusts: data?.trusts.value,
        firstName: data?.firstName,
        email: data?.email,
      },
    };

    mutateAddAdmin(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
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
      onSubmit={handleAddAdmin}
      className="p-4 bg-off-white-3 h-fit w-full lg:w-[410px]"
    >
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
            name="firstName"
            type="text"
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
            name="roleId"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="role-select"
                {...field}
                isLoading={isLoading}
                options={roles}
                label="Role"
                placeholder="Role"
              />
            )}
          />
          {errors.roleId && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Role</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="trusts"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                isLoading={trustLoading}
                options={allTrusts}
                label="Trust"
                isMulti={false}
                placeholder="Assign Trust"
              />
            )}
          />
          {errors.trusts && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
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
            padding="py-3"
            buttonText={isSubmitting ? "Inviting.." : "Invite"}
          />
        </div>
      </div>
    </form>
  );
};

const EditAdmin = ({ close, user }: { close: () => void; user: AdminUser }) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm();

  const [editing, setEditing] = useState(false);

  // fetch roles and trust
  const { isLoading, data } = useGetRoles();
  const { isLoading: trustLoading, data: trusts } = useGetAllTrusts();

  const roles = useMemo(() => {
    if (!data?.data?.data) return [];

    return data?.data?.data?.map(
      (role: { roleName: string; roleId: string }) => ({
        label: role?.roleName,
        value: role?.roleId,
      }),
    );
  }, [data]);

  const allTrusts = useMemo(() => {
    if (!trusts?.data?.data) return [];

    return trusts?.data?.data?.map(
      (trust: { trustId: string; trustName: string }) => ({
        label: trust?.trustName,
        value: trust?.trustId,
      }),
    );
  }, [trusts]);

  //  edit admin
  const { mutate: mutateAddAdmin } = useAddUpdateAdmin();

  const handleUpdateAdmin = useCallback(
    handleSubmit(async (data) => {
      const payload: CreateAdmin = {
        isCreate: false,
        data: {
          userId: user?.id,
          roleId: data?.roleId?.value,
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          // Uncomment if trust functionality is required
          // trusts: data?.trusts?.value || "",
        },
      };

      setEditing(true);

      mutateAddAdmin(payload, {
        onSuccess: (res) => {
          toast.success(res?.data?.message);
          close();
          setEditing(false);
        },
        onError: (error) => {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(`Error: ${err?.response?.data?.error}`);
          setEditing(false);
        },
      });
    }),
    [user?.id, mutateAddAdmin, close],
  );

  // Reset form when user changes
  useEffect(() => {
    // Only reset the form when both user and role data are available
    if (user && roles.length > 0) {
      // Fix role matching by normalizing the comparison
      const normalizedUserRole = user.role?.toUpperCase();
      const userRole =
        roles.find(
          (role: { label: string }) =>
            role.label?.toUpperCase() === normalizedUserRole,
        ) || null;

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        roleId: userRole,
        // Uncomment if trust functionality is required
        // trusts: defaultTrust,
      });
    }
  }, [user, roles, reset]);

  return (
    <form
      onSubmit={handleUpdateAdmin}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
        Edit Admin
      </h3>

      <p className="text-base my-1 text-gray-6 text-center">
        Make edits to this admin account
      </p>

      <div className="space-y-2">
        <div>
          <FormInput
            label="First Name"
            name="firstName"
            type="text"
            register={register}
            registerOptions={{
              required: "First name field is required.",
            }}
            error={errors.firstName}
            errorMessage={`First name is required`}
            required
          />
        </div>

        <div>
          <FormInput
            label="Last Name"
            name="lastName"
            type="text"
            register={register}
            registerOptions={{
              required: "Last name field is required.",
            }}
            error={errors.lastName}
            errorMessage={`Last name is required`}
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
            name="roleId"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="role-select"
                {...field}
                options={roles}
                label="Role"
                isLoading={isLoading}
                placeholder="Role"
              />
            )}
          />
          {errors.roleId && (
            <p className="mt-2 mb-4 text-xs text-red-400">Select a Role</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="trusts"
            rules={{}}
            render={({ field }) => (
              <CustomSelect
                id="trust-select"
                {...field}
                options={allTrusts}
                isLoading={trustLoading}
                label="Trust"
                placeholder="Assign Trust"
              />
            )}
          />
        </div>

        <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
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

const DeleteAdmin = ({
  close,
  userId,
}: {
  close: () => void;
  userId: string;
}) => {
  const { mutate: mutateDeleteAdmin } = useDeleteAnyUser("admins");
  const [deleting, setDeleting] = useState(false);

  const handleRemoveAdmin = async () => {
    const payload: DeleteUserType = {
      userId: userId,
    };

    setDeleting(true);

    mutateDeleteAdmin(payload, {
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

        <Button
          onClick={handleRemoveAdmin}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={deleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
};

export { AddAdmin, AdminTable };

// const selectedUsers = users.filter(
//   (user) => rowSelection[user.id.toString()] === true,
// );
