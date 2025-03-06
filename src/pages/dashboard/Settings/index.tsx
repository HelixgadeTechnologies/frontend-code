import { useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, FormInput } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ProfileSettings = () => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Settings"
        desc="Take a look at your policies and the new policy to see what is covered"
        ctaText="Change Password"
      />

      <div className="mt-14">
        <RoutedTabs />

        <section className="border border-off-white-2 mt-10 py-10 px-8 bg-white w-full rounded-[10px]">
          <article className=" flex items-start gap-x-40 border-b pb-10 border-off-white-2">
            <div>
              <h3 className="font-semibold text-base text-primary-100 mb-1">
                Profile Photo
              </h3>
              <p className="text-gray-400 text-sm mb-5">
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
              <div className="w-28 h-28 rounded-full overflow-hidden bg-off-white-2"></div>
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
              <p className="text-gray-400 text-sm mb-5">
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
                  placeholder="thegabriellamcpherson@email.com"
                />
              </div>

              <div className="my-5">
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+2348023145123"
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
                  placeholder="Super Admin"
                />
              </div>
            </form>
          </article>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
