import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateTimeAgo, formatDuration } from "../../constants";

//TODO:ONCLICK CHANNEL Avatar SHOULD NAVIGATE TO THE CHANNEL
const SideVideos = () => {
  const videos = useSelector((state) => state.video?.videos?.docs);

  const navigate = useNavigate();

  return (
    <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
      {videos && videos.length > 0 ? (
        videos.map((video) => (
          <div
            className="w-full gap-x-2 border pr-2 md:flex"
            onClick={() => navigate(`/watch/${video?._id}`)}
            key={video._id}
          >
            <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
              <div className="w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                  {formatDuration(video.duration)}
                </span>
              </div>
            </div>
            <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
              <div className="h-12 w-12 shrink-0 md:hidden">
                <img
                  src={video.channelInfo?.avatar}
                  alt={video.title}
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full pt-1 md:pt-0">
                <h6 className="mb-1 text-sm font-semibold">{video.title}</h6>
                <p className="mb-0.5 mt-2 text-sm text-gray-200">
                  {video.channelInfo?.username}
                </p>
                <p className="flex text-sm text-gray-200">
                  {video.views} Views · {calculateTimeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <span>no Video</span>
      )}
    </div>
  );
};

export default SideVideos;
