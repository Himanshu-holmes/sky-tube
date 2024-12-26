import React, { useEffect } from "react";
import { NoVideoFound, VideoListView } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getUserWatchHistroy } from "../helper/userapicalls";
import { getWatchHistroySuccess } from "../store/Slice/userSlice";

const WatchHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUserWatchHistroy()
      .then((data) => {
        console.log(data);
        dispatch(getWatchHistroySuccess(data));
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  const Videos = useSelector((state) => state.user?.watchHistory);

  if (Videos?.length === 0) {
    return <NoVideoFound />;
  }
  return (
    <div class="h-screen overflow-y-auto bg-[#121212] text-white">
      <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          {Videos?.map((video) => (
            <VideoListView
              key={video._id}
              title={video?.title}
              description={video?.description}
              duration={video?.duration}
              thumbnail={video?.thumbnail}
              views={video?.views}
              channelName={video?.owner?.username}
              channelAvatar={video?.owner?.avatar}
              createdAt={video?.createdAt}
              videoId={video?._id}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default WatchHistory;
