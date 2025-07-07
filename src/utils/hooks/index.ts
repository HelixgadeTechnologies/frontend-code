import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { DeleteUserType, PasswordType, ProfilePic } from "../types";

export const useDeleteAnyUser = (type: string) => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: [type],
    mutationFn: (payload: DeleteUserType) =>
      axiosRequest(token).post(`${baseUrl}/setting/remove`, payload),
  });
  return mutation;
};

export const useGetRoles = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["roles"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/setting/roles`),
  });

  return query;
};

export const useChangePassword = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["password"],
    mutationFn: (payload: PasswordType) =>
      axiosRequest(token).post(`${baseUrl}/setting/change-password`, payload),
  });
  return mutation;
};

export const useUpdateProfilePic = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["profile"],
    mutationFn: (payload: ProfilePic) =>
      axiosRequest(token).post(
        `${baseUrl}/setting/update-profile-picture`,
        payload,
      ),
  });
  return mutation;
};

export const useGetUserDetails = ({ adminId }: { adminId: string }) => {
  console.log({ adminId });
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["user"],
    enabled: !!adminId,
    queryFn: () =>
      axiosRequest(token).get(`${baseUrl}/setting/getUser/${adminId}`),
  });

  return query;
};
