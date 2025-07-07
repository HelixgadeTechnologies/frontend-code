import { useForm } from "react-hook-form";

import { FormInput, Button } from "../../../components/elements";
import { createContext, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { authStore as AuthStore } from "../store/authStore";

const authStoreCTX = createContext(AuthStore)
const ForgotPassword = observer(() => {
  const authStore = useContext(authStoreCTX)
  const {
    register,
    formState: { errors },
  } = useForm();
  const changeForm = useCallback((page: number) => {
    authStore.pageSwitch = page;
  }, [authStore]);
  return (
        <form className="w-full lg:w-2/3">
          <h1 className="mb-8 font-semibold text-lg lg:text-4xl">
            Forgot Password
          </h1>
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

          <div className="mt-8">
            <Button
              // disabled={isSubmitting}
              padding="py-3"
              buttonText="Reset Password"
            // buttonText={isSubmitting ? "Processing..." : "Sign in"}
            />

            <span className="block text-center mt-6 text-gray-2 text-sm">
              Remember your password? {""}
              <button className="text-primary-200 font-semibold" onClick={() => changeForm(1)}>
                Log in
              </button>
            </span>
          </div>
        </form>
  );
});

export default ForgotPassword;
