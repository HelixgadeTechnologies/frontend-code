import { authBg } from "../../../assets/images";

import { useForm } from "react-hook-form";

import { FormInput, Button } from "../../../components/elements";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className=" h-screen  bg-white grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:block overflow-hidden">
        <img className="w-full h-full" src={authBg} alt="auth" />
      </section>
      <section className="px-4 lg:px-0 flex items-center justify-center">
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
              <Link className="text-primary-200 font-semibold" to="/">
                Log in
              </Link>
            </span>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;
