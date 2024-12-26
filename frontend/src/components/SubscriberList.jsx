import React from "react";
import { useNavigate } from "react-router-dom";
import { toggleSubscription } from "../helper/subscriptionapicall";
import { toggleSubscriptionSuccess } from "../store/Slice/subscribeSlice";
import { useDispatch } from "react-redux";

const SubscriberList = ({ username, avatar, channelId }) => {
  //TODO: NAVIGATE TO THE USERCHANNEL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const handelSubscribed = (e) => {
  //     e.preventDefault();
  //     toggleSubscription({ channelId })
  //       .then((data) => {
  //         dispatch(toggleSubscriptionSuccess(data));
  //       })
  //       .catch((err) => console.log(err));
  //   };

  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center gap-x-2">
        <div
          className="h-14 w-14 shrink-0"
          onClick={() => navigate(`/channel/${username}`)}
        >
          <img
            src={avatar}
            alt="Channel Avatar"
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="block">
          <h6 className="font-semibold">{username}</h6>
          {/* <p className="text-sm text-gray-300">20K Subscribers</p> */}
        </div>
      </div>
      <div className="block">
        {/* <button
          className="group/btn px-3 py-2 text-black bg-[#ae7aff] focus:bg-white"
          onClick={handelSubscribed}
        >
          <span>Subscribed</span>
        </button> */}
      </div>
    </div>
  );
};

export default SubscriberList;
