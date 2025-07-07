import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, CustomSelect, FormInput, Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { Observer, observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { authStore as AuthStore } from "../../auth/store/authStore"
import { ChangePassword } from "./form/ChangePassword";
import { toast } from "react-toastify";
import { IDropdownProp, ILoginUpdate, IProfilePicsPayload } from "../types/interface";
import { IUser } from "../../auth/types/interface";
import { toJS } from "mobx";
import { UpdateSuccess } from "./modal/UpdateSuccess";
import { useCookies } from "react-cookie";
import { trustStore as TrustStore } from "../../trust/store/trustStore";

const SettingsStoreCtx = createContext(SettingStore);
const AuthStoreCtx = createContext(AuthStore);
const TrustStoreCtx = createContext(TrustStore);

const ProfileSettings = observer(() => {
  const authStore = useContext(AuthStoreCtx);
  const settingStore = useContext(SettingsStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cookie, setCookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const [lg, setSetLg] = useState<Array<string>>([]);

  const { register, formState: { errors }, handleSubmit, setValue, control } = useForm();
  useEffect(() => {
    async function getData() {
      trustStore.getAllStates()
    }
    getData();
    return () => { };
  }, []);
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
        const formData: ILoginUpdate = {
          trusts: user?.trusts as string,
          userId: user?.userId as string,
          community: data.communities,
          localGovernmentArea: data.localGovernmentArea.value,
          state: data.state.value,
          phoneNumber: data.phoneNumber,
        }

        const response = await settingStore.editLoginUser(formData)
        if (response) {
          authStore.user = {
            ...toJS(authStore.user),
            phoneNumber: data.phoneNumber,
            community: data.communities,
            localGovernmentArea: data.localGovernmentArea.value,
            state: data.state.value,
          } as IUser;
          toast.success(`${authStore.user.role} Update successful.`);
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
              const res: any = await settingStore.uploadProfilePic(payload);
              authStore.updateProfilePic(res)
              let myAdmin: IUser = admin
              let update = { ...myAdmin, profilePic: res.profilePic } as IUser
              setCookie("hcdt_admin", JSON.stringify(update), { path: "/" });
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
  const selectState = useCallback((v: IDropdownProp) => {
    trustStore.allLGA.clear();
    let localGov = trustStore.getLG(String(v?.value));
    if (localGov.length > 0) {
      setSetLg(localGov);
    }
    trustStore.selectedState = String(v?.value);
    setValue("state", v); //set state field
    setValue("localGovernmentArea", null); // Reset LGA field
  }, [trustStore]);

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
                buttonText={settingStore.isUploading ? "Uploading..." : "Change Photo"}
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
              <div>
                <Observer>
                  {() => (
                    <>
                      <Controller
                        control={control}
                        name="state"
                        // rules={{}}
                        render={({ field }) => (
                          <CustomSelect
                            id="state-select"
                            {...field}
                            // isLoading={trustLoading}
                            options={[...trustStore.allStates.values()].map((s: string) => {
                              return {
                                label: s,
                                value: s
                              }
                            })}
                            label="State"
                            isMulti={false}
                            placeholder={authStore.user.state as string}
                            onChange={(v) => selectState(v as IDropdownProp)}
                          />
                        )}
                      />
                      {errors.state && (
                        <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a state</p>
                      )}
                    </>
                  )}
                </Observer>
              </div>
              <div>
                <Controller
                  control={control}
                  name="localGovernmentArea"
                  // rules={{}}

                  render={({ field }) => (
                    <CustomSelect
                      id="lga-select"
                      {...field}
                      // isLoading={trustLoading}
                      options={lg.map((s: string) => {
                        return {
                          label: s,
                          value: s
                        }
                      })}
                      label="Local Government Area"
                      isMulti={false}
                      // isDisabled={true}
                      isDisabled={trustStore.selectedState ? false : true}
                      placeholder={authStore.user.localGovernmentArea as string}
                    />
                  )}
                />
                {errors.localGovernmentArea && (
                  <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign LG</p>
                )}
              </div>
              <div>
                <FormInput
                  label="Communities"
                  name="communities"
                  type="text"
                  register={register}
                  registerOptions={{
                    required: "This field is required.",
                  }}
                  placeholder={authStore.user.community as string}
                  error={errors.communities}
                  errorMessage={`This field  is required`}
                  required
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
