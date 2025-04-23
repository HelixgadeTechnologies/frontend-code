import { useForm } from "react-hook-form";
import { Button, FormInput } from "../../../../components/elements";
import { Observer, observer } from "mobx-react-lite";
import { ISettingStore } from "../../types/interface";
import { toast } from "react-toastify";

export const ChangePassword = observer(({ close, store }: { close: () => void, store: ISettingStore }) => {
  // const settingStore = useContext(SettingsStoreCtx);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const newPassword = watch("newPassword");

  const submit = async (data: any) => {
    try {
      const response = await store.changePassword(data)
      if (response) {
        store.isPasswordModelClose = false;
        toast.success("Password successfully changed.");
      }
    } catch (error: any) {
      console.log("Form Data:", error);
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
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
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters",
              },
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
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters",
              },
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
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            }}
            error={errors.confirmPassword}
            required
            showEye
          />
        </div>
        <Observer>
          {() => (
            <div className="flex items-center gap-x-8 lg:gap-x-16 justify-between">
              <Button
                onClick={close}
                className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
                buttonText="Back"
                textTransform="text-black"
                width="w-fit"
                type="button"
              />

              <Button
                padding="py-3"
                buttonText={store.isSubmitting ? "Processing..." : "Change"}
              />
            </div>
          )}
        </Observer>
      </div>
    </form>
  )
});