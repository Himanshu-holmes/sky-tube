import { Upload, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { publishAVideo } from "../../helper/videoapicalls";
import UploadingVideo from "./UploadingVideo";
import ImagePreview from "../ImagePreview";
import {
  publishVideoSuccess,
  publishVideoUploading,
} from "../../store/Slice/video.slice";

const UploadVideoPopup = ({ setUploadVideoPopup }) => {
  const [videoName, setVideoName] = useState("");
  const [videoSize, setVideoSize] = useState(0);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const uploading = useSelector((state) => state.video.uploading);
  const uploaded = useSelector((state) => state.video.uploaded);

  const publishVideo = async (data) => {
    setVideoSize(Math.floor(data.videoFile[0].size / (1024 * 1024)));
    dispatch(publishVideoUploading());
    await publishAVideo(data)
      .then((data) => {
        dispatch(publishVideoSuccess());
      })
      .catch((err) => console.log(err));
  };

  if (uploading) {
    return (
      <>
        <UploadingVideo
          setUploadVideoPopup={setUploadVideoPopup}
          videoFileName={videoName}
          fileSize={videoSize}
        />
      </>
    );
  }

  if (uploaded) {
    return (
      <>
        <UploadingVideo
          setUploadVideoPopup={setUploadVideoPopup}
          videoFileName={videoName}
          fileSize={videoSize}
          uploaded={true}
        />
      </>
    );
  }

  return (
    <section className="relative w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <form
        className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8"
        onSubmit={handleSubmit(publishVideo)}
      >
        <div className="h-full overflow-auto border bg-[#121212]">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">Upload Videos</h2>
            <div className="flex gap-2">
              <button
                type="submit"
                className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              >
                Save
              </button>
              <button
                className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#e655bf] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                onClick={() => setUploadVideoPopup((prev) => !prev)}
              >
                <X width={20} height={20} />
              </button>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
            <div className="w-full border-2 border-dashed px-4 py-12 text-center">
              <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                <Upload height={60} width={60} />
              </span>
              <h6 className="mb-2 font-semibold">
                Drag and drop video files to upload
              </h6>
              <p className="text-gray-400">
                Your videos will be private untill you publish them.
              </p>
              <label
                htmlFor="video-upload"
                className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              >
                <input
                  type="file"
                  id="video-upload"
                  className="sr-only"
                  accept="video/*"
                  {...register("videoFile", {
                    required: "VideoFile is required",
                    onChange: (e) => setVideoName(e.target.files[0]?.name),
                  })}
                />
                Select Files
              </label>
              <span className="text-red-500 text-xs">
                {errors.videoFile?.message}
              </span>
            </div>

            <div className="w-full">
              <label className="mb-1 inline-block">
                Thumbnail<sup>*</sup>
              </label>
              <ImagePreview
                name="thumbnail"
                control={control}
                label="Thumbnail *"
                camerIcon
                cameraSize={30}
                className={"w-full h-56 border object-contain "}
              />
              <span className="text-red-500 text-xs">
                {errors.thumbnail?.message}
              </span>
            </div>

            <div className="w-full">
              <label className="mb-1 inline-block">
                Title<sup>*</sup>
              </label>
              <input
                type="text"
                className="w-full border bg-transparent px-2 py-1 outline-none"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              <span className="text-red-500 text-xs">
                {errors.title?.message}
              </span>
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block">
                Description<sup>*</sup>
              </label>
              <textarea
                className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              <span className="text-red-500 text-xs">
                {errors.description?.message}
              </span>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UploadVideoPopup;
