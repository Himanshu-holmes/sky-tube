import React, { useEffect, useState } from "react";
import { NoVideoFound, VideoListView } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getLikedVideos } from "../helper/likeapicalls";
import { getLikedVideosSuccess } from "../store/Slice/likeSlice";
import { makeVideosNull } from "../store/Slice/video.slice";

const LikedPage = () => {
  //const [likedVideos, setLikedVideos] = useState([]);

  const dispatach = useDispatch();

  useEffect(() => {
    getLikedVideos().then((data) => {
      //console.log(data);
      dispatach(getLikedVideosSuccess(data));
      //  setLikedVideos(data);
    });

    return () => dispatach(makeVideosNull());
  }, [dispatach]);

  const likedVideos = useSelector((state) => state.like?.allLikedVideos);
  //console.log(likedVideos.map((like)=>console.log(lik)));

  if (likedVideos?.length === 0) {
    return <NoVideoFound />;
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white">
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          {likedVideos?.map((like) => (
            <VideoListView
              key={like._id}
              title={like.video?.title}
              description={like.video?.description}
              duration={like.video?.duration}
              thumbnail={like.video?.thumbnail}
              views={like.video?.views}
              channelName={like.video?.owner?.username}
              channelAvatar={like.video?.owner?.avatar}
              createdAt={like.video.createdAt}
              videoId={like.video?._id}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default LikedPage;
