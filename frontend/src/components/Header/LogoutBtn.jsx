import React from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../helper/authapicalls";
import { logout } from "../../store/Slice/authSlice";
import toast from "react-hot-toast";

const LogoutBtn = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    const response = await userLogout();
    if (response) {
      dispatch(logout());
    }
  };
  return (
    <>
      <button
        onClick={logoutHandler}
        className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
      >
        Log out
      </button>
    </>
  );
};

export default LogoutBtn;
