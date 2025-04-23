import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, FormInput, Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { authStore as AuthStore } from "../../auth/store/authStore"
import { ChangePassword } from "./form/ChangePassword";
import { toast } from "react-toastify";
import { CreateAdminPayload, IAdminPayloadData } from "../types/interface";
import { IUser } from "../../auth/types/interface";
import { toJS } from "mobx";
import { UpdateSuccess } from "./modal/UpdateSuccess";

const SettingsStoreCtx = createContext(SettingStore);
const AuthStoreCtx = createContext(AuthStore);

const ProfileSettings = observer(() => {
  const authStore = useContext(AuthStoreCtx);
  const settingStore = useContext(SettingsStoreCtx);

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

              <Button
                border
                padding="py-2 px-3"
                buttonText="Change Photo"
                width="w-fit"
                iconLeft={<img src={photoIcon} alt="change photo" />}
              />
            </div>

            <div className="w-fit relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-off-white-2">
                <img src={authStore.user.profilePic != null ? authStore.user.profilePic : photoIcon} alt="verified" />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary-500 h-9 w-9 rounded-full flex items-center justify-center ">
                <img src={checkIcon} alt="verified" />
              </div>
            </div>
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
