import { useState, useRef, useEffect } from "react";
import { FaCheckCircle, FaCopy, FaEllipsisV, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { IUser } from "../../pages/auth/types/interface";
import { userIcon } from "../../assets/icons";



const UserProfileCard = ({ user }: { user: IUser }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 p-4">
    <div className="flex items-center gap-3 mb-2">
      <img
        src={user?.profilePic || userIcon}
        alt={user?.lastName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg">{user?.lastName} {user?.firstName}</span>
          <FaCheckCircle className="text-primary-400" />
        </div>
        <span className="text-gray-500 text-sm">{user?.email}</span>
      </div>
      <button className="ml-auto text-gray-400 hover:text-gray-600">
        <FaEllipsisV />
      </button>
    </div>
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaEnvelope className="text-gray-400" />
        <span className="flex-1">{user?.email}</span>
        <button className="text-gray-400 hover:text-primary-400">
          <FaCopy />
        </button>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaPhone className="text-gray-400" />
        <span className="flex-1">{user?.phoneNumber}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaMapMarkerAlt className="text-gray-400" />
        <span className="flex-1">{user?.state}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaMapMarkerAlt className="text-gray-400" />
        <span className="flex-1">{user?.localGovernmentArea}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaMapMarkerAlt className="text-gray-400" />
        <span className="flex-1">{user?.community}</span>
      </div>
      {/* <div className="flex items-center gap-2 text-gray-700 text-sm">
        <FaCalendarAlt className="text-gray-400" />
        <span className="flex-1">{dayjs(user.).format("DD-MM-YYYY") || "N/A"}</span>
      </div> */}
    </div>
  </div>
);

const UserProfileDropdown = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="h-9 w-9 rounded-full bg-primary-200/20 flex items-center justify-center"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          src={user?.profilePic || userIcon}
          alt="admin"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>
      {open && <UserProfileCard user={user} />}
    </div>
  );
};

export default UserProfileDropdown;