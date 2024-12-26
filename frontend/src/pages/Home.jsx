import React, { useEffect, useState } from "react";
import {
  Header,
  Sidebar,
  Container,
  VideoCard,
  NoVideoFound,
} from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../helper/videoapicalls.js";
import { getAllVideosSuccess } from "../store/Slice/video.slice.js";
import toast from "react-hot-toast";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();
  // const videos = useSelector((state) => {
  //   state.video?.videos?.docs;
  // });
  // const loading = useSelector((state) => {
  //   state.video?.loading;
  // });
  // const hasNextPage = useSelector((state) => state.video?.videos?.hasNextPage);

  useEffect(() => {
    const limit = 50;
    getAllVideos({ limit })
      .then((data) => {
        dispatch(getAllVideosSuccess(data));
        setVideos(data.docs);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
      });
  }, [dispatch]);

  if (videos.length === 0) {
    return <NoVideoFound />;
  }

  return (
    <>
      <Container>
        <div>
          <div className="h-screen overflow-y-auto  bg-[#121212] text-white">
            <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
              <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
                  {videos?.map((video) => (
                    <VideoCard
                      key={video._id}
                      title={video?.title}
                      channelAvatar={video?.channelInfo?.avatar}
                      channelName={video?.channelInfo?.username}
                      views={video?.views}
                      duration={video?.duration}
                      createdAt={video?.createdAt}
                      thumbnail={video?.thumbnail}
                      videoId={video._id}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
