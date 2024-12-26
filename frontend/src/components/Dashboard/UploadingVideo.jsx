import React from "react";
import { useDispatch } from "react-redux";
import { updateUploadState } from "../../store/Slice/video.slice";
import { Film, X, BadgeCheck } from "lucide-react";

const UploadingVideo = ({
  videoFileName,
  fileSize,
  setUploadVideoPopup,
  uploaded,
}) => {
  const dispatch = useDispatch();

  const handleCancelAndFinish = () => {
    setUploadVideoPopup((prev) => ({
      ...prev,
      uploadVideo: false,
    }));

    dispatch(updateUploadState());
  };

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
        <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              {uploaded ? (
                <span>Uploaded Video</span>
              ) : (
                <span>Uploading Video...</span>
              )}
              <span className="block text-sm text-gray-300">
                <span>Track your video uploading process.</span>
              </span>
            </h2>
            <button className="h-6 w-6">
              <X width={20} height={20} onClick={handleCancelAndFinish} />
            </button>
          </div>
          <div className="mb-6 flex gap-x-2 border p-3">
            <div className="w-8 shrink-0">
              <span className="inline-block w-full rounded-full bg-[#E4D3FF] p-1 text-[#AE7AFF]">
                <Film width={25} height={25} />
              </span>
            </div>
            <div className="flex flex-col">
              <h6>{videoFileName}</h6>
              <p className="text-sm">{fileSize} MB</p>
              {uploaded ? (
                <div className="mt-2 flex  gap-2 items-center justify-center">
                  <BadgeCheck width={20} height={20} />
                  Uploaded.
                </div>
              ) : (
                <div className="mt-2">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="mr-2 inline-block h-5 w-5 animate-spin text-gray-200"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#AE7AFF"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="border px-4 py-3"
              onClick={handleCancelAndFinish}
            >
              Cancel
            </button>
            <button
              className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
              onClick={handleCancelAndFinish}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadingVideo;
