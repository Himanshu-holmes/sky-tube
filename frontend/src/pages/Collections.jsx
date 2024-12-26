import React, { useEffect } from "react";
import { NoVideoFound, PlayListCard } from "../components";
import { getAllPlaylistSuccess } from "../store/Slice/playlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../helper/playlistapicalls";

// Add Loading State and show spinner
const Collections = () => {
  const userId = useSelector((state) => state.auth?.userData?._id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      getUserPlaylists({ userId })
        .then((data) => {
          dispatch(getAllPlaylistSuccess(data));
        })
        .catch((err) => console.log(err));
    }
  }, [userId, dispatch]);

  const allPlaylists = useSelector((state) => state.playlist?.allPlaylist);

  // Check if allPlaylists is null or undefined
  if (!allPlaylists) {
    return <NoVideoFound playlist={true} />;
  }

  // Check if allPlaylists is empty
  if (allPlaylists.length === 0) {
    return <NoVideoFound playlist={true} />;
  }

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="px-4 pb-4">
              <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
                {allPlaylists.map((playlist) => (
                  <PlayListCard
                    name={playlist?.name}
                    thumbnail={playlist?.latestVideo?.thumbnail}
                    key={playlist?._id}
                    playlistId={playlist._id}
                    updatedAt={playlist?.updatedAt}
                    description={playlist?.description}
                    totalVideos={playlist.totalVideos}
                    totalViews={playlist.totalViews}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Collections;
