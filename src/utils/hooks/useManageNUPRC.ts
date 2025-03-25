import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { CreateAdmin } from "../types";

export const useAddUpdateNUPRC = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["NUPRCs"],
    mutationFn: (payload: CreateAdmin) =>
      axiosRequest(token).post(`${baseUrl}/setting/addnuprc`, payload),
  });
  return mutation;
};

export const useGetNUPRC = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["NUPRCs"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/setting/allnuprc`),
  });

  return query;
};
