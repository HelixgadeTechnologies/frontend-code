import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authBg } from "../../assets/images";

import { useForm } from "react-hook-form";

import { FormInput, Button } from "../../components/elements";
import { Link } from "react-router-dom";

import { axiosRequest } from "../../utils/serverRequest";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { baseUrl } from "../../utils/data";

import { jwtDecode } from "jwt-decode";
import { User } from "../../utils/types";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [, setCookie] = useCookies(["hcdt_admin"]);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect");

  const movePage = redirectPath ? redirectPath : "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = handleSubmit(async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    setIsSubmitting(true);
    try {
      const endpoint = `${baseUrl}/auth/signIn`;
      const ePoint = "https://hcdt-api-09b9ed32e39a.herokuapp.com/signIn"
      const response = await axiosRequest().post(ePoint, payload);

      if (response?.status === 200 || response?.status === 201) {
        const token = response.data.data;
        const user: User = jwtDecode(token);

        setCookie(
          "hcdt_admin",
          JSON.stringify({
            token: response?.data?.data,
            userId: user?.userId,
            email: user?.email,
            role: user?.role,
            firstName: user?.firstName,
            lastName: user?.lastName,
            phoneNumber: user?.phoneNumber,
            state: user?.state,
            community: user?.community,
            localGovernmentArea: user?.localGovernmentArea,
            profilePic: user?.profilePic,
          }),
          { path: "/" },
        );

        setIsSubmitting(false);
        navigate(`${movePage}`);
      }
    } catch (error: unknown) {
      setIsSubmitting(false);

      const err = error as { response?: { data?: { error?: string } } };
      toast.error(`Error: ${err?.response?.data?.error}`);
    }
  });

  return (
    <div className=" h-screen  bg-white grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:block overflow-hidden">
        <img className="w-full h-full" src={authBg} alt="auth" />
      </section>
      <section className="px-4 lg:px-0  flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full lg:w-2/3">
          <h1 className="mb-8 font-semibold text-lg lg:text-4xl">
            Welcome back!
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

          <div className="mt-4">
            <FormInput
              label="Password"
              type="password"
              name="password"
              register={register}
              registerOptions={{
                required: "Password is required",
              }}
              error={errors.password}
              required
              showEye
            />
          </div>

          <div className="mt-8">
            <Button
              disabled={isSubmitting}
              padding="py-3"
              buttonText={isSubmitting ? "Processing..." : "Login"}
            />

            <span className="block text-center mt-6 text-gray-2 text-sm">
              Forgot Password?{" "}
              <Link
                className="text-primary-200 font-semibold"
                to="/forgot-password"
              >
                Recover
              </Link>
            </span>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
