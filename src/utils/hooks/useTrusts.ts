import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";

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
