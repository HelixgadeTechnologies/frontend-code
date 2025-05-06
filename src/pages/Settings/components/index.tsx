import { createContext, useContext, useRef } from "react";
import { useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, FormInput, Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { Observer, observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { authStore as AuthStore } from "../../auth/store/authStore"
import { ChangePassword } from "./form/ChangePassword";
import { toast } from "react-toastify";
import { CreateAdminPayload, IAdminPayloadData, IProfilePicsPayload } from "../types/interface";
import { IUser } from "../../auth/types/interface";
import { toJS } from "mobx";
import { UpdateSuccess } from "./modal/UpdateSuccess";
import { useCookies } from "react-cookie";

const SettingsStoreCtx = createContext(SettingStore);
const AuthStoreCtx = createContext(AuthStore);

const ProfileSettings = observer(() => {
  const authStore = useContext(AuthStoreCtx);
  const settingStore = useContext(SettingsStoreCtx);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cookie,setCookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();
  const isNumeric = (value: string) => {
    return /^\d+$/.test(value);
  }
  const submit = async (data: any) => {
    try {
      const user: IUser = authStore.user as IUser
      if (!isNumeric(data.phoneNumber)) {
        toast.warning("Phone number must be a number");
        return;
      } else {
        const formData: IAdminPayloadData = {
          firstName: user.firstName as string,
          lastName: user.lastName as string,
          email: user.email as string,
          roleId: user.roleId as string,
          trusts: user.trusts as string,
          userId: user.userId as string,
          status: Number(user.status),
          phoneNumber: data.phoneNumber,
        }
        const payload: CreateAdminPayload = {
          isCreate: false,
          data: formData
        };
        const response = await settingStore.editAdmin(payload)
        if (response) {
          authStore.user = {
            ...toJS(authStore.user),
            phoneNumber: data.phoneNumber,
          } as IUser;
          toast.success("Admin Update successful.");
        }
      }
    } catch (error: any) {
      const message = error?.response?.body?.message;
      const message2 = error?.response?.body?.error;
      if (message?.includes("Please try again. Database connection failed.")) {
        toast.info(message);
      } else {
        toast.error(message2);
      }
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   async function loadRequests() {
  //     const file = event.target.files?.[0];

  //     if (file) {
  //       // Handle the selected file (e.g., upload it to the server)
  //       console.log("Selected file:", file);
  //       const payload: IProfilePicsPayload = {
  //         base64String: "",
  //         mimeType: ""
  //       }
  //       await settingStore.uploadProfilePic(payload)
  //     }

  //   }
  //   loadRequests();
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    async function loadRequests() {
      try {
        const file = event.target.files?.[0];

        if (file) {
          // Validate file type
          const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
          if (!validImageTypes.includes(file.type)) {
            toast.error("Only image files (JPEG, PNG, GIF, WEBP) are allowed.");
            return;
          }

          // Get MIME type
          const mimeType = file.type;

          // Convert file to base64 string
          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result?.toString().split(",")[1]; // Extract base64 string

            if (base64String) {
              const payload: IProfilePicsPayload = {
                base64String,
                mimeType,
              };


              // Upload the profile picture
              const res:any = await settingStore.uploadProfilePic(payload);
              authStore.updateProfilePic(res)
              let myAdmin:IUser = admin
              let update = {...myAdmin,profilePic:res.profilePic} as IUser
              setCookie("hcdt_admin",JSON.stringify(update),{ path: "/" });
              toast.success("Profile picture uploaded successfully.");
            }
          };

          reader.readAsDataURL(file); // Read the file as a data URL

        }
      } catch (error: any) {
        const message = error?.response?.body?.message;
        const message2 = error?.response?.body?.error;
        if (message?.includes("Please try again. Database connection failed.")) {
          toast.info(message);
        } else {
          toast.error(message2);
        }
      }
    }

    loadRequests();
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Settings"
        desc="Take a look at your policies and the new policy to see what is covered"
        ctaText="Change Password"
        action={() => settingStore.isPasswordModelClose = true}
      />

      <div className="mt-14">
        <RoutedTabs />

        <section className="border border-off-white-2 mt-10 py-10 px-8 bg-white w-full rounded-[10px]">
          <article className=" flex items-start gap-x-40 border-b pb-10 border-off-white-2">
            <div>
              <h3 className="font-semibold text-base text-primary-100 mb-1">
                Profile Photo
              </h3>
              <p className="text-gray-4 text-sm mb-5">
                This image will be displayed on your profile
              </p>

              {/* Change Photo Button */}
              <Button
                border
                padding="py-2 px-3"
                buttonText={settingStore.isUploading?"Uploading...":"Change Photo"}
                width="w-fit"
                iconLeft={<img src={photoIcon} alt="change photo" />}
                onClick={handleButtonClick}
              />
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <Observer>
              {() => (
                <div className="w-fit relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-off-white-2">
                    <img src={authStore.user.profilePic != null ? authStore.user.profilePic : photoIcon} alt="verified" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary-500 h-9 w-9 rounded-full flex items-center justify-center ">
                    <img src={checkIcon} alt="verified" />
                  </div>
                </div>
              )}
            </Observer>
          </article>

          <article className=" flex items-start gap-x-40  pt-10 ">
            <div>
              <h3 className="font-semibold text-base text-primary-100 mb-1">
                Personal Information
              </h3>
              <p className="text-gray-4 text-sm mb-5">
                Update your personal details here.{" "}
              </p>

              <Button
                padding="py-2 px-3"
                buttonText={settingStore.isSubmitting ? "Saving..." : "Save Changes"}
                width="w-fit"
                type="button"
                onClick={handleSubmit(submit)}
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
                  placeholder={authStore.user.email as string}
                />
              </div>

              <div className="my-5">
                <FormInput
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder={authStore.user.phoneNumber as string}
                  register={register}
                  error={errors.phone}
                />
              </div>

              <div>
                <FormInput
                  label="Role"
                  name="role"
                  type="text"
                  disabled
                  register={register}
                  placeholder={authStore.user.role as string}
                />
              </div>
            </form>
          </article>
        </section>
      </div>

      {settingStore.isPasswordModelClose && (
        <Modal
          body={
            <ChangePassword
              close={() => settingStore.isPasswordModelClose = false}
              store={settingStore}
            />}
          close={() => settingStore.isPasswordModelClose = false}
        />
      )}

      {settingStore.isUpdated && (
        <Modal
          body={
            <UpdateSuccess
              close={() => settingStore.isUpdated = false}
            />}
          close={() => settingStore.isUpdated = false}
        />
      )}
    </div>
  );
});



export default ProfileSettings;
