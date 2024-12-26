import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllVideos } from "../helper/videoapicalls";
import toast from "react-hot-toast";
import {
  getAllVideosSuccess,
  makeVideosNull,
} from "../store/Slice/video.slice";
import { NoVideoFound, VideoListView } from "../components";

const SearchVideos = () => {
  const dispatch = useDispatch();
  const { query } = useParams();

  useEffect(() => {
    const limit = 50;

    getAllVideos({ query, limit })
      .then((data) => {
        dispatch(getAllVideosSuccess(data));
        toast.success(`Fetched All Video Related ${query}`);
        setFilterOpen(false);
      })
      .catch((err) => console.log(err));

    return () => dispatch(makeVideosNull);
  }, [dispatch, query]);

  const videos = useSelector((state) => state.video?.videos);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            {videos?.docs?.map((video) => (
              <VideoListView
                key={video._id}
                title={video?.title}
                description={video?.description}
                duration={video?.duration}
                thumbnail={video?.thumbnail}
                views={video?.views}
                channelName={video?.channelInfo?.username}
                channelAvatar={video?.channelInfo?.avatar}
                createdAt={video?.createdAt}
                videoId={video?._id}
              />
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default SearchVideos;
