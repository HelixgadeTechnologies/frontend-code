import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { authStore as AuthStore } from "../store/authStore"
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import { trustStore as TrustStore } from "../../trust/store/trustStore"
import { authBg } from "../../../assets/images";
const AuthStoreCTX = createContext(AuthStore)
const TrustStoreCTX = createContext(TrustStore)
const AuthMasterPage = observer(() => {
    const authStore = useContext(AuthStoreCTX)
    const trustStore = useContext(TrustStoreCTX)
    useEffect(() => {
        async function getInfo() {
            await trustStore.getAllTrust()
        }
        getInfo();
        return () => { };
    }, []);


    return (
        <div className=" h-screen  bg-white grid grid-cols-1 lg:grid-cols-2">
            <section className="hidden lg:block overflow-hidden">
                <img className="w-full h-full" src={authBg} alt="auth" />
            </section>
            <section className="px-4 lg:px-0 flex items-center justify-center">
                {authStore.pageSwitch == 1 && <Login />}
                {authStore.pageSwitch == 2 && <Register />}
                {authStore.pageSwitch == 3 && <ForgotPassword />}
            </section>
        </div>
    );

});

export default AuthMasterPage;