import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";
import { authStore as AuthStore } from "../store/authStore"
import { authBg } from "../../../assets/images";
import AdminLogin from "./AdminLogin";
import ForgotPasswordA from "./ForgotPasswordA";

const AuthStoreCTX = createContext(AuthStore)
const AdminAuthPage = observer(() => {
    const authStore = useContext(AuthStoreCTX)

    return (
        <div className=" h-screen  bg-white grid grid-cols-1 lg:grid-cols-2">
            <section className="hidden lg:block overflow-hidden">
                <img className="w-full h-full" src={authBg} alt="auth" />
            </section>
            <section className="px-4 lg:px-0 flex items-center justify-center">
                {authStore.pageSwitchA == 1 && <AdminLogin />}
                {authStore.pageSwitchA == 2 && <ForgotPasswordA />}
            </section>
        </div>
    );

});

export default AdminAuthPage;
