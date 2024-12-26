import React, { useEffect } from "react";
import {
  CommentsList,
  SideVideos,
  TweetAndCommentInput,
  Video,
  VideoAbout,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideoById } from "../helper/videoapicalls";
import { getVideoByIdSuccess } from "../store/Slice/video.slice";
import { getVideoComments } from "../helper/commentapicalls";
import {
  cleanUpComments,
  getAllVideoCommentsSucesss,
} from "../store/Slice/comment.slice";
import { getUserPlaylists } from "../helper/playlistapicalls";
import { getAllPlaylistSuccess } from "../store/Slice/playlistSlice";

const VideoPlay = () => {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const userId = useSelector((state) => state.auth.userData?._id);
  const totalComments = useSelector((state) => state.comment?.totalComments);

  useEffect(() => {
    if (videoId) {
      const video = getVideoById({ videoId })
        .then((data) => {
          dispatch(getVideoByIdSuccess(data));
        })
        .catch((err) => console.log(err?.response?.data));

      const comments = getVideoComments({ videoId })
        .then((data) => {
          dispatch(getAllVideoCommentsSucesss(data));
        })
        .catch((err) => console.log(err));
    }
    return () => dispatch(cleanUpComments());
  }, [videoId, dispatch, totalComments]);

  const currentVideo = useSelector((state) => state.video?.video);

  const comments = useSelector((state) => state.comment?.comments);
  const hasNextPage = useSelector((state) => state.comment?.hasNextPage);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
            {currentVideo && currentVideo?.length > 0 ? (
              <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                <div className="col-span-12 w-full">
                  <div className="relative mb-4 w-full pt-[56%]">
                    <div className="absolute inset-0">
                      <Video
                        videoUrl={currentVideo[0].videoFile}
                        thumbnail={currentVideo[0].thumbnail}
                      />
                    </div>
                  </div>
                  {/* Video About Section Title ,Discription ,Total Views, Video Releadsed Data/hour , total Like , Save To Playlist Subscribed/subscribed */}
                  <VideoAbout
                    key={currentVideo[0]?._id}
                    avatar={currentVideo[0]?.channelInfo.avatar}
                    channelName={currentVideo[0]?.channelInfo.username}
                    createdAt={currentVideo[0]?.createdAt}
                    description={currentVideo[0]?.description}
                    isSubscribed={currentVideo[0]?.isUserSubscribed}
                    isLiked={currentVideo[0]?.isUserLiked}
                    likeCount={currentVideo[0]?.totalLikes}
                    subscribersCount={currentVideo[0]?.subscribersCount}
                    title={currentVideo[0]?.title}
                    views={currentVideo[0]?.views}
                    videoId={currentVideo[0]?._id}
                    channelId={currentVideo[0]?.channelInfo?._id}
                  />
                  {/* Comment Bellow  */}
                  {/* <TweetAndCommentInput comment={true} videoId={videoId} /> */}
                  <button className="peer w-full rounded-lg border p-4  text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
                    <h6 className="font-semibold">
                      {totalComments} Comments...
                    </h6>
                  </button>

                  {/* <TweetAndCommentInput /> */}

                  <CommentsList
                    videoId={currentVideo[0]?._id}
                    key={currentVideo[0].channelInfo._id}
                  />
                </div>
                {/* Side Videos */}
                <SideVideos />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
};

export default VideoPlay;
