import { useState } from "react";
import { useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, FormInput, Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { useCookies } from "react-cookie";

import {
  useChangePassword,
  useUpdateProfilePic,
  useGetUserDetails,
} from "../../../utils/hooks";
import { toast } from "react-toastify";
import { PasswordType } from "../../../utils/types";

const ProfileSettings = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;

  const adminId = admin?.userId;

  const { isLoading, data } = useGetUserDetails({ adminId });

  console.log({ isLoading, data });

  const {
    register,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const { mutate: mutateUpload } = useUpdateProfilePic();

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // The result attribute contains the data as a base64 encoded string
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload image to the backend
  const uploadImage = async (hexString: string, mimeType: string) => {
    setIsUploading(true);

    // Prepare payload
    const payload = {
      hexImage: hexString,
      mimeType: mimeType,
    };

    mutateUpload(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        setIsUploading(false);
      },
      onError: (error) => {
        setIsUploading(false);
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(`Error: ${err?.response?.data?.error}`);
        // setError(err instanceof Error ? err.message : "Failed to upload image");
      },
    });
  };

  // Handle file selection and automatic upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      // Convert file to base64 string
      const base64String = await fileToBase64(file);

      // Create preview URL
      const previewUrl = `data:${file.type};base64,${base64String}`;
      setPreview(previewUrl);

      // Upload the image
      await uploadImage(base64String, file.type);
    } catch (err) {
      toast.error("Error processing image");
      console.error(err);
    }
  };

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Settings"
        desc="Take a look at your policies and the new policy to see what is covered"
        ctaText="Change Password"
        action={() => setOpenModal(true)}
      />

      <div className="mt-14">
        <RoutedTabs />

        <section className="border border-off-white-2 mt-10 py-10 px-8 bg-white w-full rounded-[10px]">
          <article className="flex flex-col lg:flex-row gap-y-4 items-start gap-x-40 border-b pb-10 border-off-white-2">
            <div>
              <h3 className="font-semibold text-base text-primary-100 mb-1">
                Profile Photo
              </h3>
              <p className="text-gray-4 text-sm mb-5">
                This image will be displayed on your profile
              </p>

              <div className="w-fit">
                <label className="flex items-center gap-x-2 cursor-pointer border font-semibold bg-white border-primary-200 text-primary-200 py-2 px-3 rounded-lg">
                  <img src={photoIcon} alt="change photo" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div className="w-fit relative">
              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-off-white-2">
                {preview && (
                  <img
                    className="h-full w-full object-cover"
                    src={preview}
                    alt="profile pic"
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary-500 h-9 w-9 rounded-full flex items-center justify-center ">
                <img src={checkIcon} alt="verified" />
              </div>
            </div>
          </article>

          {/* Personal Info */}

          <article className=" flex flex-col lg:flex-row gap-y-4 items-start gap-x-40  pt-10 ">
            <div>
              <h3 className="font-semibold text-base text-primary-100 mb-1">
                Personal Information
              </h3>
              <p className="text-gray-4 text-sm mb-5">
                Update your personal details here.{" "}
              </p>

              <Button
                padding="py-2 px-3"
                buttonText="Save Changes"
                width="w-fit"
              />
            </div>

            <form className="flex-1">
              <div>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  disabled
                  register={register}
                  placeholder={admin?.email}
                />
              </div>

              <div className="my-5">
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder={admin?.phoneNumber}
                  register={register}
                  error={errors.phoneNumber}
                />
              </div>

              <div>
                <FormInput
                  label="Role"
                  name="role"
                  type="text"
                  disabled
                  register={register}
                  placeholder={admin?.role}
                />
              </div>
            </form>
          </article>
        </section>
      </div>

      {openModal && (
        <Modal
          body={<ChangePasswordForm close={() => setOpenModal(false)} />}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

const ChangePasswordForm = ({ close }: { close: () => void }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const newpassword = watch("newPassword");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: mutatePassword } = useChangePassword();

  const handleChangePassword = handleSubmit(async (data) => {
    setIsSubmitting(true);

    const payload: PasswordType = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    mutatePassword(payload, {
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
      onSubmit={handleChangePassword}
      className="p-4 bg-off-white-3 h-fit w-[410px]"
    >
      <h3 className="text-lg xl:text-3xl text-center mb-12 font-normal text-dark-2">
        Change Password
      </h3>

      <div className="space-y-8">
        <div>
          <FormInput
            label="Enter Old Password"
            type="password"
            name="oldPassword"
            placeholder="Enter Old Password"
            register={register}
            registerOptions={{
              required: "Password address is required",
            }}
            error={errors.oldPassword}
            errorMessage={`Password is required`}
            required
            showEye
          />
        </div>

        <div>
          <FormInput
            label="Enter New Password"
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            register={register}
            registerOptions={{
              required: "Password address is required",
            }}
            error={errors.newPassword}
            errorMessage={`Password is required`}
            required
            showEye
          />
        </div>

        <div>
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            register={register}
            registerOptions={{
              required: "Passwords do not match",
              validate: (value) =>
                value === newpassword || "The passwords do not match",
            }}
            error={errors.confirmPassword}
            errorMessage={`Passwords do not match`}
            required
            showEye
          />
        </div>

        <div className="flex items-center gap-x-8 lg:gap-x-16 justify-between">
          <Button
            onClick={close}
            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
            buttonText="Back"
            width="w-fit"
          />

          <Button
            disabled={isSubmitting}
            padding="py-3"
            buttonText={isSubmitting ? "Changing.." : "Change"}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileSettings;
