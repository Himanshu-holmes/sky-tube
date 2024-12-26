import React from "react";
import { Eye, Heart, Plus, User } from "lucide-react";

const DashboardStats = ({ channelStats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
      <div className="border p-4">
        <div className="mb-4 block">
          <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
            <Eye width={20} height={20} />
          </span>
        </div>
        <h6 className="text-gray-300">Total views</h6>
        <p className="text-3xl font-semibold">{channelStats?.totalViews}</p>
      </div>
      <div className="border p-4">
        <div className="mb-4 block">
          <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
            <User width={20} height={20} />
          </span>
        </div>
        <h6 className="text-gray-300">Total subscribers</h6>
        <p className="text-3xl font-semibold">
          {channelStats?.totalSubscribers}
        </p>
      </div>
      <div className="border p-4">
        <div className="mb-4 block">
          <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
            <Heart width={20} height={20} />
          </span>
        </div>
        <h6 className="text-gray-300">Total likes</h6>
        <p className="text-3xl font-semibold">{channelStats?.totalLikes}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
