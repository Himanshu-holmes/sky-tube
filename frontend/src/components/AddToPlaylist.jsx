import { Folder, FolderPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
} from "../helper/playlistapicalls";
import { getAllPlaylistSuccess } from "../store/Slice/playlistSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const AddToPlaylist = ({ videoId }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [allPlaylist, setAllPlaylist] = useState(null);

  const userId = useSelector((state) => state.auth.userData?._id);

  const handlePlaylistInput = (e) => {
    e.preventDefault();

    const playlist = createPlaylist({ name })
      .then((data) => {
        setAllPlaylist(data);
        toast.success("Playlist Created Succesfully");
      })
      .catch((err) => console.log(err));
  };

  const handleAddToPlaylist = (e, playlistId) => {
    e.preventDefault();
    const add = addVideoToPlaylist({ videoId, playlistId })
      .then(() => toast.success("Video Added To Playlist"))
      .catch((err) => console.log(err));
  };

  const getAllPlaylist = (e) => {
    e.preventDefault();

    getUserPlaylists({ userId })
      .then((data) => {
        if (data.length > 0) {
          dispatch(getAllPlaylistSuccess(data));
          setAllPlaylist(data);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="relative block">
      <button
        className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black"
        onClick={getAllPlaylist}
      >
        <span className="inline-block w-5">
          <FolderPlus height={20} width={20} />
        </span>
        Save
      </button>
      <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
        <h3 className="mb-4 text-center text-lg font-semibold">
          Save to playlist
        </h3>
        <ul className="mb-4">
          {allPlaylist && allPlaylist.length > 0 ? (
            allPlaylist.map((playlist) => (
              <li
                className="mb-2 last:mb-0"
                key={playlist._id}
                onClick={(e) => handleAddToPlaylist(e, playlist._id)}
              >
                <label
                  className="group/label inline-flex cursor-pointer items-center gap-x-3"
                  htmlFor="Collections-checkbox"
                >
                  <Folder />

                  {playlist.name}
                </label>
              </li>
            ))
          ) : (
            <li className="text-center font-thin text-gray-300">
              Add Playlist
            </li>
          )}
        </ul>
        <div className="flex flex-col">
          <label
            htmlFor="playlist-name"
            className="mb-1 inline-block cursor-pointer"
          >
            Name
          </label>

          <input
            className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
            id="playlist-name"
            placeholder="Enter playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black"
            onClick={handlePlaylistInput}
          >
            Create new playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylist;
