import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../helper/authapicalls";
import { updatedUserDetailsSucess } from "../../store/Slice/authSlice";
import { Mail } from "lucide-react";

const EditPersonal = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth?.userData);

  useEffect(() => {
    setValue("fullName", auth?.fullName);
    setValue("email", auth?.email);
  }, [auth, setValue]);

  const saveChanges = (data) => {
    updateUserDetails(data)
      .then((data) => {
        dispatch(updatedUserDetailsSucess(data));
      })
      .catch((err) => console.log(err));
  };

  const cancelChanges = (e) => {
    e.preventDefault();
    setValue("fullName", auth?.fullName);
    setValue("email", auth?.email);
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Personal Info</h5>
        <p className="text-gray-300">Update your photo and personal details.</p>
      </div>
      <form
        className="w-full sm:w-1/2 lg:w-2/3"
        onSubmit={handleSubmit(saveChanges)}
      >
        <div className="rounded-lg border">
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full ">
              <label className="mb-1 inline-block">Full name</label>
              <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                placeholder="Enter Full name"
                {...register("fullName", {
                  required: "FullName is requried",
                })}
              />
            </div>
            {errors.fullName && (
              <span className="text-sm text-red-500">
                {errors.fullName?.message}
              </span>
            )}
            <div className="w-full">
              <label className="mb-1 inline-block">Email address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
                  <Mail width={20} height={20} />
                </div>
                <input
                  type="email"
                  className="w-full rounded-lg border bg-transparent py-1.5 pl-10 pr-2"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email?.message}
                </span>
              )}
            </div>
          </div>
          <hr className="border border-gray-300" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button
              className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10"
              onClick={(e) => cancelChanges(e)}
            >
              Cancel
            </button>
            <button
              className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black"
              type="submit"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPersonal;
