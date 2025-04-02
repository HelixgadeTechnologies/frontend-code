import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { CreateTrustProps } from "../types";

export const useGetAllTrusts = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["trusts"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/trust/all`),
  });

  return query;
};

export const useAddUpdateTrust = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["trust"],
    mutationFn: (payload: CreateTrustProps) =>
      axiosRequest(token).post(`${baseUrl}/trust/createTrust`, payload),
  });
  return mutation;
};
