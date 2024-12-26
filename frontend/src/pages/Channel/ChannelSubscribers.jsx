import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelSubscribers } from "../../helper/subscriptionapicall";
import { getAllUserChannelSubscribersSuccess } from "../../store/Slice/subscribeSlice";

const ChannelSubscribers = () => {
  const dispatch = useDispatch();

  const channelId = useSelector((state) => state.user?.profileData?._id);

  useEffect(() => {
    if (channelId) {
      getChannelSubscribers({ channelId }).then((data) => {
        dispatch(getAllUserChannelSubscribersSuccess(data));
      });
    }
  }, [dispatch, channelId]);

  const subscribers = useSelector(
    (state) => state.subscribe?.channelSubscribers
  );

  console.log(subscribers[0]);

  return (
    <div>
      <div class="px-4 pb-4">
        <div class="flex flex-col gap-y-4 py-4">
          {subscribers?.map((subscriber) => (
            <div
              class="flex w-full justify-between"
              key={subscriber?.subscriber?._id}
            >
              <div class="flex items-center gap-x-2">
                <div class="h-14 w-14 shrink-0">
                  <img
                    src={subscriber?.subscriber?.avatar}
                    alt={subscriber?.subscriber?.username}
                    class="h-full w-full rounded-full"
                  />
                </div>
                <div class="block">
                  <h6 class="font-semibold">
                    {subscriber?.subscriber?.username}
                  </h6>
                  <p class="text-sm text-gray-300">
                    {subscriber?.subscriber?.subscribersCount} Subscribers
                  </p>
                </div>
              </div>
              <div class="block">
                <button class="group/btn px-3 py-2 text-black bg-[#ae7aff] focus:bg-white">
                  {subscriber?.subscriber?.subscribedToSubscriber
                    ? "Subscribed"
                    : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelSubscribers;
