import React, { useEffect, useState } from "react";
import { Header, Sidebar } from "./components/index";
import { Navigate, Outlet, redirect } from "react-router-dom";
import { getCurrentUser } from "./helper/authapicalls";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/Slice/authSlice";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const response = getCurrentUser()
      .then((response) => {
        if (response) {
          dispatch(login(response));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Header />
      <div className="sm:flex flex-none  bg-[#121212]">
        <div>
          <Sidebar />
        </div>
        <div className="sm:flex-1 ">
          <Outlet />
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            icon: "❌",
            style: { borderRadius: "10px", color: "red" },
          },
          success: {
            icon: "✅",
            style: { borderRadius: "10px", color: "green" },
          },
          duration: 2000,
        }}
      />
    </>
  );
};

export default App;
