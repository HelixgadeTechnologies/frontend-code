import { useLocation } from "react-router-dom";
import { bellIcon } from "../../assets/icons";
import { routes } from "../../utils/data";
import { authStore as AuthStore } from "../../pages/auth/store/authStore";
import { observer } from "mobx-react-lite";
import { createContext, useContext } from "react";
import UserProfileDropdown from "./UserProfileDropdown";

const AuthStoreCTX = createContext(AuthStore);
const Header = observer(() => {
  const authStore = useContext(AuthStoreCTX);
  const { pathname } = useLocation();
  // const navigate = useNavigate();


  // useEffect(() => {
  //   async function getInfo() {
  //     let token = window.sessionStorage.getItem("qrjwt");
  //     if (!token) {
  //       navigate("/auth/1");
  //     }
  //   }
  //   getInfo();
  //   return () => { };
  // }, []);


  const route = routes?.find((route) => route.link === pathname);

  return (
    <header className="bg-white border-b border-gray-5 py-4 pl-4 pr-10 flex items-center justify-between">
      <h1 className="font-semibold  text-black text-lg lg:text-3xl">
        <button
          className="lg:hidden mr-4 text-2xl"
        onClick={() => authStore.sidebarOpen = !authStore.sidebarOpen}
        >
          ☰
        </button>
        {route?.title}
      </h1>

      <div className="flex items-center  gap-x-7">
        <button className="relative">
          <img src={bellIcon} alt="notification" />
          {/* <span className="absolute top-0 -right-1 h-4 w-4 rounded-full flex items-center justify-center bg-primary-200 text-white text-[10px] font-semibold ">
            4
          </span> */}
        </button>

        <UserProfileDropdown user={authStore.user} />
      </div>
    </header>
  );
});

export default Header;



// export default UserProfileDropdown;