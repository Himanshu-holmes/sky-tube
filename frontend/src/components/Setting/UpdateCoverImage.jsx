import { Upload, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import ImagePreview from "../ImagePreview";
import Input from "../Input";
import Button from "../Button";
import { updateCoverImage } from "../../helper/authapicalls";
import { updatedCoverImageSucess } from "../../store/Slice/authSlice";

const UpdateCoverImage = () => {
  const {
    handleSubmit,
    register,

    formState: { errors },
  } = useForm();

  const saveChanges = (data) => {
    updateCoverImage(data)
      .then((data) => {
        dispatch(updatedCoverImageSucess(data));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Update Channel Banner</h5>
        <p className="text-gray-300">Update your photo </p>
      </div>
      <form onSubmit={handleSubmit(saveChanges)}>
        <div>
          <span className="text-center text-sm font-thin">Channel Banner</span>
          <Input
            lable="Cover Image"
            type="file"
            placeholder=""
            className="w-full"
            {...register("coverImage", {
              required: "*Channel Banner is required",
            })}
            accept="image/png, image/jpeg"
          />
          <div>
            {errors.coverImage && (
              <span className="text-red-400 font-thin">
                {errors.coverImage.message}
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

export default UpdateCoverImage;
