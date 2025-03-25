import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  RawAxiosRequestHeaders,
} from "axios";

type CustomHeaders = RawAxiosRequestHeaders & {
  "Content-Type": string;
  Accept?: string;
  "DOMAIN-ORIGIN-NAME"?: string;
  authorization?: string;
  [key: string]: string | number | boolean | undefined;
};

const axiosRequest = (token?: string): AxiosInstance => {
  const headers: CustomHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const axiosInst = axios.create({
    headers,
  });

  axiosInst.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error),
  );

  axiosInst.interceptors.response.use(
    async (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const errorMessage = error.response?.data as
        | { message?: string }
        | undefined;

      if (
        error.response?.status === 403 ||
        error.response?.status === 401 ||
        errorMessage?.message === "Access denied. No token provided."
      ) {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login?redirect=" + window.location.pathname;
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInst;
};

const axiosRequestFormData = (token: string): AxiosInstance => {
  const headers: CustomHeaders = {
    "Content-Type": "multipart/form-data",
  };

  // if (process.env.DOMAIN_NAME) {
  //   headers['DOMAIN-ORIGIN-NAME'] = process.env.DOMAIN_NAME;
  // }

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const axiosInst = axios.create({
    headers,
  });

  axiosInst.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error),
  );

  axiosInst.interceptors.response.use(
    async (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const errorMessage = error.response?.data as
        | { message?: string }
        | undefined;

      if (
        error.response?.status === 403 ||
        error.response?.status === 401 ||
        errorMessage?.message === "Access denied. No token provided."
      ) {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login?redirect=" + window.location.pathname;
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInst;
};

export { axiosRequest, axiosRequestFormData };
