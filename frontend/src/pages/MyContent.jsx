import React, { useEffect, useState } from "react";
import {
  DashboardHeader,
  DashboardStats,
  DeleteConfirm,
  EditVideoPopup,
  NoVideoFound,
  UploadVideoPopup,
  VideoTable,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getChannelStats, getChannelVideos } from "../helper/dashboardapicalls";
import {
  getChannelStatsSuccess,
  getChannelVideosSuccess,
} from "../store/Slice/dashboardSlice";
import { deleteAVideo } from "../helper/videoapicalls";

const MyContent = () => {
  // DashBoard
  const username = useSelector((state) => state.auth?.userData?.username);
  const publishToggled = useSelector((state) => state.video?.publishToggled);
  const uploaded = useSelector((state) => state.video?.uploading);
  const deleteVideo = useSelector((state) => state.video?.loading);
  const dispatch = useDispatch();
  // const channelOldVideo = useSelector(
  //   (state) => state.dashboard?.channelVideos
  // );

  const [popUp, setPopUp] = useState({
    uploadVideo: false,
    editVideo: false,
    deleteVideo: false,
  });

  const [videoDetails, setVideDetails] = useState(null);

  useEffect(() => {
    const channelAllStats = getChannelStats()
      .then((data) => {
        dispatch(getChannelStatsSuccess(data));
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  useEffect(() => {
    const channelAllVideos = getChannelVideos()
      .then((data) => {
        dispatch(getChannelVideosSuccess(data));
      })
      .catch((err) => console.log(err));
  }, [dispatch, publishToggled, uploaded, deleteVideo]);

  const channelStats = useSelector((state) => state.dashboard?.channelStats);
  const channelVideos = useSelector((state) => state.dashboard?.channelVideos);

  if (!channelStats || !channelVideos) {
    return <NoVideoFound />;
  }

  const handleDeleteVideo = async () => {
    const videoId = videoDetails?._id;
    deleteAVideo({ videoId });

    setPopUp((prev) => ({
      ...prev,
      deleteVideo: !prev.deleteVideo,
    }));
  };

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
            {popUp.uploadVideo && (
              <div class="h-screen overflow-y-auto bg-[#121212] text-white">
                <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                  {" "}
                  <UploadVideoPopup setUploadVideoPopup={setPopUp} />
                </div>
              </div>
            )}
            {popUp.editVideo && (
              <div class="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                <div class="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
                  <EditVideoPopup
                    setEditVideoPopup={setPopUp}
                    title={videoDetails?.title}
                    description={videoDetails?.description}
                    videoId={videoDetails?._id}
                    thumbnail={videoDetails?.thumbnail}
                  />
                </div>
              </div>
            )}
            {popUp.deleteVideo && (
              <DeleteConfirm
                video={true}
                onCancel={() =>
                  setPopUp((prev) => ({
                    ...prev,
                    deleteVideo: !prev.deleteVideo,
                  }))
                }
                onDelete={handleDeleteVideo}
              />
            )}

            <DashboardHeader username={username} setPopUp={setPopUp} />

            <DashboardStats channelStats={channelStats[0]} />

            <VideoTable
              channelVideos={channelVideos}
              setPopUp={setPopUp}
              setVideoDetails={setVideDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyContent;
