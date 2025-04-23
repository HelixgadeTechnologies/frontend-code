import * as yup from "yup";
export const LoginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .email()
        .required("Email is required"),

    password: yup.string().required("Password is required"),
});