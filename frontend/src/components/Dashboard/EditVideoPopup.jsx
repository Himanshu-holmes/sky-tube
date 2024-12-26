import { X } from "lucide-react";
import React, { useEffect } from "react";
import ImagePreview from "../ImagePreview";
import { useForm } from "react-hook-form";
import { updateVideo } from "../../helper/videoapicalls";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSuccess,
  updateUploadState,
} from "../../store/Slice/video.slice";

const EditVideoPopup = ({
  videoId,
  title,
  description,
  setEditVideoPopup,
  thumbnail,
}) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const dispatch = useDispatch();
  const oldUpdatedState = useSelector((state) => state.video?.uploading);

  const handleClosePopUp = () => {
    setEditVideoPopup((prev) => ({
      ...prev,
      uploadVideo: false,
      editVideo: false,
    }));
  };

  const handleUpdateVideo = async (data) => {
    await updateVideo({ data, videoId })
      .then((data) => {
        dispatch(updateSuccess(!oldUpdatedState));
        setEditVideoPopup((prev) => ({
          ...prev,
          uploadVideo: false,
          editVideo: false,
        }));
      })
      .catch((err) => console.log(err));

    dispatch(updateUploadState());
  };

  useEffect(() => {
    setValue("title", title);
    setValue("description", description);
  }, [title, description, setValue]);

  if (oldUpdatedState) {
    <>
      <div className="w-52 border border-slate-600 bg-black flex gap-2 p-3 text-center">
        <span className="text-md font-bold">Updating video...</span>
      </div>
    </>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleUpdateVideo)}>
        <div class="mb-4 flex items-start justify-between">
          <h2 class="text-xl font-semibold">
            Edit Video
            <span class="block text-sm text-gray-300">
              Share where you&#x27;ve worked on your profile.
            </span>
          </h2>
          <button class="h-6 w-6" onClick={handleClosePopUp}>
            <X width={20} height={20} />
          </button>
        </div>
        <label class="mb-1 inline-block">
          Thumbnail<sup>*</sup>
        </label>
        <ImagePreview
          name={"thumbnail"}
          control={control}
          label={""}
          camerIcon
          cameraSize={30}
          image={thumbnail}
          className={"object-contain w-full min-w-xl h-72 min-h-32 "}
        />
        <span className="text-red-500 text-xs">
          {errors.thumbnail?.message}
        </span>
        <div class="mb-6 flex flex-col gap-y-4">
          <div class="w-full">
            <label class="mb-1 inline-block">
              Title<sup>*</sup>
            </label>
            <input
              type="text"
              class="w-full border bg-transparent px-2 py-1 outline-none"
              {...register("title", {
                required: "Title is required",
              })}
            />
            <span className="text-red-500 text-xs">
              {errors.title?.message}
            </span>
          </div>
          <div class="w-full">
            <label for="desc" class="mb-1 inline-block">
              Description<sup>*</sup>
            </label>
            <textarea
              rows="4"
              class="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            <span className="text-red-500 text-xs">
              {errors.description?.message}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button class="border px-4 py-3" onClick={handleClosePopUp}>
            Cancel
          </button>
          <button
            type="submit"
            class="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default EditVideoPopup;
