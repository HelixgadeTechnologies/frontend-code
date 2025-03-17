import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../serverRequest";
import { baseUrl } from "../data";
import { CreateAdmin } from "../types";

export const useAddUpdateAdmin = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const mutation = useMutation({
    mutationKey: ["admins"],
    mutationFn: (payload: CreateAdmin) =>
      axiosRequest(token).post(`${baseUrl}/setting/addAdmin`, payload),
  });
  return mutation;
};

export const useGetAdmins = () => {
  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;
  const token = admin?.token;

  const query = useQuery({
    queryKey: ["admins"],
    queryFn: () => axiosRequest(token).get(`${baseUrl}/setting/admins`),
  });

  return query;
};

// export const useGetPlayerHighlights = (id: any) => {
//   const cookies = getCookie("dsa_user");
//   const user = cookies && JSON.parse(cookies);
//   const token = user?.token;

//   const query = useQuery({
//     queryKey: ["player-highlights"],
//     enabled: !!id,
//     queryFn: () =>
//       axiosRequest(token).get(`${baseURL}/players/${id}/highlights`),
//   });

//   return query;
// };
