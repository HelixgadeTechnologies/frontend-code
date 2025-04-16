import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { CreateDRA } from "../types";

export const useAddUpdateDRA = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["DRAs"],
    mutationFn: (payload: CreateDRA) =>
      axiosRequest(token).post(`${baseUrl}/setting/addDRA`, payload),
  });
  return mutation;
};

export const useGetDRAs = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["DRAs"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/setting/allDRA`),
  });

  return query;
};
