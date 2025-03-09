import { useState } from "react";
import { useForm } from "react-hook-form";

import { checkIcon, photoIcon } from "../../../assets/icons";
import { Button, FormInput, Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ProfileSettings = () => {
  const [openModal, setOpenModal] = useState(false);

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
        action={() => setOpenModal(true)}
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
  } = useForm();

  return (
    <form className="p-4 bg-off-white-3 h-fit w-[410px]">
      <h3 className="text-lg xl:text-3xl text-center mb-12 font-normal text-dark-2">
        Change Password
      </h3>

      <div className="space-y-8">
        <div>
          <FormInput
            label="Enter Old Password"
            type="password"
            name="oldpassword"
            placeholder="Enter Old Password"
            register={register}
            registerOptions={{
              required: "Password address is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            error={errors.oldpassword}
            errorMessage={`Password is required`}
            required
            showEye
          />
        </div>

        <div>
          <FormInput
            label="Enter New Password"
            type="password"
            name="newpassword"
            placeholder="Enter New Password"
            register={register}
            registerOptions={{
              required: "Password address is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            error={errors.newpassword}
            errorMessage={`Password is required`}
            required
            showEye
          />
        </div>

        <div>
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmpassword"
            placeholder="Confirm New Password"
            register={register}
            registerOptions={{
              required: "Password address is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            error={errors.confirmpassword}
            errorMessage={`Password is required`}
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

          <Button padding="py-3" buttonText="Change" />
        </div>
      </div>
    </form>
  );
};

export default ProfileSettings;
