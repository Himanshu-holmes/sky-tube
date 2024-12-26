import { Upload, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import ImagePreview from "../ImagePreview";
import Input from "../Input";
import Button from "../Button";
import { updateAvatar } from "../../helper/authapicalls";
import { data } from "autoprefixer";
import { useDispatch } from "react-redux";
import { updatedAvatarSucess } from "../../store/Slice/authSlice";
const UpdateAvatar = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const saveChanges = (data) => {
    updateAvatar(data)
      .then((data) => {
        dispatch(updatedAvatarSucess(data));
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Update Avatar</h5>
        <p className="text-gray-300">Update your photo </p>
      </div>

      <form onSubmit={handleSubmit(saveChanges)}>
        <div>
          <span className="text-center text-sm font-thin">Profile Picture</span>
          <Input
            lable="Profile Picture"
            type="file"
            placeholder=""
            className="w-full"
            {...register("avatar", {
              required: "*Profile Picture is required",
            })}
            accept="image/png, image/jpeg"
          />
          <div>
            {errors.avatar && (
              <span className="text-red-400 font-thin">
                {errors.avatar.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full rounded-md">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAvatar;
