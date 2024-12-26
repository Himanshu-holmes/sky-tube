import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changePassword } from "../../helper/authapicalls";

const ChangePassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    resetField,
  } = useForm();

  const dispatch = useDispatch();

  const saveChanges = async (data) => {
    await changePassword({
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    });

    resetField("oldPassword");
    resetField("newPassword");
    resetField("confirmPassword");
  };

  const cancelChanges = (e) => {
    e.preventDefault();
    resetField("oldPassword");
    resetField("newPassword");
    resetField("confirmPassword");
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-y-4 py-4">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <h5 className="font-semibold">Password</h5>
          <p className="text-gray-300">
            Please enter your current password to change your password.
          </p>
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3">
          <form
            className="rounded-lg border"
            onSubmit={handleSubmit(saveChanges)}
          >
            <div className="flex flex-wrap gap-y-4 p-4">
              <div className="w-full">
                <label className="mb-1 inline-block">Old password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  placeholder="Old password"
                  {...register("oldPassword", {
                    required: "Old password is required",
                  })}
                />
              </div>
              {errors.oldPassword && (
                <span className="text-sm text-red-500">
                  {errors.oldPassword.message}
                </span>
              )}
              <div className="w-full">
                <label className="mb-1 inline-block">New password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  placeholder="New password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 5,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                <p className="mt-0.5 text-sm text-gray-300">
                  Your new password must be more than 6 characters.
                </p>
              </div>
              {errors.newPassword && (
                <span className="text-sm text-red-500">
                  {errors.newPassword.message}
                </span>
              )}
              <div className="w-full">
                <label className="mb-1 inline-block">Confirm password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: {
                      matchesNewPassword: (value) =>
                        value === getValues("newPassword") ||
                        "Passwords do not match",
                    },
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
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
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
