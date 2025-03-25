import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { CreateSettlor, DeleteSettlorType } from "../types";

export const useAddUpdateSettlor = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["settlors"],
    mutationFn: (payload: CreateSettlor) =>
      axiosRequest(token).post(`${baseUrl}/setting/addSettlor`, payload),
  });
  return mutation;
};

export const useGetSettlors = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["settlors"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/setting/allSettlor`),
  });

  return query;
};

export const useDeleteSettlor = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["settlors"],
    mutationFn: (payload: DeleteSettlorType) =>
      axiosRequest(token).post(`${baseUrl}/setting/removeSettlor`, payload),
  });
  return mutation;
};
