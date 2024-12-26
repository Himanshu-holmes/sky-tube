import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../helper/playlistapicalls";
import { getPlaylistByUserSuccess } from "../../store/Slice/playlistSlice";
import { NoVideoFound, PlayListCard } from "../../components";
import { calculateTimeAgo } from "../../../constants";
import { useNavigate } from "react-router-dom";

const ChannelPlaylist = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state?.playlist?.channelPlaylists);
  const authId = useSelector((state) => state?.auth?.userData?._id);
  const userId = useSelector((state) => state?.user?.profileData?._id);

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      getUserPlaylists({ userId }).then((data) => {
        dispatch(getPlaylistByUserSuccess(data));
      });
    }
  }, [dispatch, userId]);

  if (playlists.length === 0) {
    return (
      <div className="text-center text-white">
        {" "}
        <NoVideoFound playlist={true} />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pb-4">
        <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
          {playlists?.map((playlist) => (
            <div
              className="w-full"
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              key={playlist._id}
            >
              <div className="relative mb-2 w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={playlist.latestVideo?.thumbnail}
                    alt={playlist.name}
                    className="h-full w-full"
                  />
                  <div className="absolute inset-x-0 bottom-0">
                    <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                      <div className="relative z-[1]">
                        <p className="flex justify-between">
                          <span className="inline-block">Playlist</span>
                          <span className="inline-block">
                            {playlist.totalVideos} videos
                          </span>
                        </p>
                        <p className="text-sm text-gray-200">
                          {playlist.totalViews} Views · 
                          {calculateTimeAgo(playlist.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h6 className="mb-1 font-semibold">{playlist.name}</h6>
              <p className="flex text-sm text-gray-200">
                {playlist.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChannelPlaylist;
