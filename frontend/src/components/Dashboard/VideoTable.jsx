import React from "react";
import TogglePublish from "../TogglePublish";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoTable = ({ channelVideos, setPopUp, setVideoDetails }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[1200px] border-collapse border text-white">
        <thead>
          <tr>
            <th className="border-collapse border-b p-4">Status</th>
            <th className="border-collapse border-b p-4">Status</th>
            <th className="border-collapse border-b p-4">Uploaded</th>
            <th className="border-collapse border-b p-4">Rating</th>
            <th className="border-collapse border-b p-4">Date uploaded</th>
            <th className="border-collapse border-b p-4"></th>
          </tr>
        </thead>
        <tbody>
          {channelVideos.map((video) => (
            <tr className="group border" key={video._id}>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-center">
                  <TogglePublish
                    isPublished={video?.isPublished}
                    videoId={video?._id}
                  />
                </div>
              </td>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-center">
                  {video?.isPublished ? (
                    <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
                      Published
                    </span>
                  ) : (
                    <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-orange-600 text-orange-600">
                      UnPublished
                    </span>
                  )}
                </div>
              </td>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex items-center gap-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={video?.thumbnail}
                    alt={video?.title}
                    onClick={() => navigate(`/watch/${video?._id}`)}
                  />
                  <h3 className="font-semibold">{video?.title}</h3>
                </div>
              </td>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-center gap-4">
                  <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                    {video?.totalLikes} likes
                  </span>
                  {/* <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
                    49 dislikes
                  </span> */}
                </div>
              </td>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                {video?.createdAt?.day}/{video?.createdAt?.month}/
                {video?.createdAt?.year}
              </td>
              <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex gap-4">
                  <button
                    className="h-5 w-5 hover:text-[#ae7aff]"
                    onClick={() => {
                      setPopUp((prev) => ({
                        ...prev,
                        deleteVideo: !prev.deleteVideo,
                      }));
                      setVideoDetails(video);
                    }}
                  >
                    <Trash2 width={20} height={20} />
                  </button>
                  <button
                    className="h-5 w-5 hover:text-[#ae7aff]"
                    onClick={() => {
                      setPopUp((prev) => ({
                        ...prev,
                        editVideo: !prev.editVideo,
                      }));
                      setVideoDetails(video);
                    }}
                  >
                    <Pencil width={20} height={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;
