import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../helper/videoapicalls";
import { getAllVideosSuccess } from "../../store/Slice/video.slice";
import { VideoCard } from "../../components";

const ChannelVideos = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.user?.profileData?._id);

  useEffect(() => {
    getAllVideos({ userId })
      .then((data) => {
        dispatch(getAllVideosSuccess(data));
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
      });
  }, [dispatch]);

  const videos = useSelector((state) => state?.video?.videos?.docs);

  return (
    <>
      <div class="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
        {videos?.map((video) => (
          <VideoCard
            key={video._id}
            channelAvatar={video?.channelInfo?.avatar}
            channelName={video?.channelInfo?.username}
            views={video?.views}
            duration={video?.duration}
            createdAt={video?.createdAt}
            thumbnail={video?.thumbnail}
            videoId={video._id}
          />
        ))}
      </div>
    </>
  );
};

export default ChannelVideos;
