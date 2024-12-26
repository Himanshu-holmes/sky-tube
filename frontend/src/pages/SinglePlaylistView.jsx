import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistById } from "../helper/playlistapicalls";
import { getPlaylistSuccess } from "../store/Slice/playlistSlice";
import { NoVideoFound } from "../components";
import { calculateTimeAgo, formatDuration } from "../../constants";

const SinglePlaylistView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { playlistId } = useParams();

  useEffect(() => {
    if (playlistId) {
      getPlaylistById({ playlistId })
        .then((data) => {
          dispatch(getPlaylistSuccess(data));
        })
        .catch((err) => console.log(err));
    }
  }, [playlistId, dispatch]);

  const playlistData = useSelector((state) => state.playlist?.playlists);

  //console.log(playlistData);

  if (!playlistData) {
    return <NoVideoFound playlist={true} />;
  }

  if (playlistData.length === 0) {
    return <NoVideoFound playlist={true} />;
  }
  return (
    <>
      <div class="h-screen overflow-y-auto bg-[#121212] text-white">
        <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div class="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
              <div class="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                <div class="relative mb-2 w-full pt-[56%]">
                  <div class="absolute inset-0">
                    <img
                      src={
                        playlistData[0].videos[playlistData[0].totalVideos - 1]
                          .thumbnail
                      }
                      alt={playlistData[0].name}
                      class="h-full w-full"
                    />
                    <div class="absolute inset-x-0 bottom-0">
                      <div class="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                        <div class="relative z-[1]">
                          <p class="flex justify-between">
                            <span class="inline-block">Playlist</span>
                            <span class="inline-block">
                              {playlistData[0].totalVideos} videos
                            </span>
                          </p>
                          <p class="text-sm text-gray-200">
                            {playlistData[0].totalViews} Views · 
                            {calculateTimeAgo(playlistData[0].updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 class="mb-1 font-semibold">{playlistData[0].name}</h6>
                <p class="flex text-sm text-gray-200">
                  {playlistData[0].description || ""}
                </p>
                <div class="mt-6 flex items-center gap-x-3">
                  <div class="h-16 w-16 shrink-0">
                    <img
                      src={playlistData[0].playlistOwner.avatar}
                      alt={playlistData[0].playlistOwner.username}
                      class="h-full w-full rounded-full"
                    />
                  </div>
                  <div class="w-full">
                    <h6 class="font-semibold">
                      {playlistData[0].playlistOwner.username}
                    </h6>
                    <p class="text-sm text-gray-300">
                      {playlistData[0].playlistOwner.totalSubscriber}{" "}
                      Subscribers
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex w-full flex-col gap-y-4">
                {playlistData[0].videos.map((video) => (
                  <div class="border" key={video._id}>
                    <div class="w-full max-w-3xl gap-x-4 sm:flex">
                      <div class="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                        <div class="w-full pt-[56%]">
                          <div
                            class="absolute inset-0"
                            onClick={() => navigate(`/watch/${video._id}`)}
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              class="h-full w-full"
                            />
                          </div>
                          <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                            {formatDuration(video.duration)}
                          </span>
                        </div>
                      </div>
                      <div class="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                        <div
                          class="h-10 w-10 shrink-0 sm:hidden"
                          onClick={() =>
                            navigate(`/channel/${video.owner.username}`)
                          }
                        >
                          <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            class="h-full w-full rounded-full"
                          />
                        </div>
                        <div class="w-full">
                          <h6
                            class="mb-1 font-semibold sm:max-w-[75%]"
                            onClick={() => navigate(`/watch/${video._id}`)}
                          >
                            {video.title}
                          </h6>
                          <p class="flex text-sm text-gray-200 sm:mt-3">
                            {video.views} Views ·{" "}
                            {calculateTimeAgo(video.createdAt)} minutes ago
                          </p>
                          <div class="flex items-center gap-x-4">
                            <div class="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                              <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                class="h-full w-full rounded-full"
                                onClick={() =>
                                  navigate(`/channel/${video.owner.username}`)
                                }
                              />
                            </div>
                            <p class="text-sm text-gray-200">
                              {video.owner.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SinglePlaylistView;
