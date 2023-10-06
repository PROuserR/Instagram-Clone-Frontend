import React, { useContext, useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { StoryContext } from "../StoryContext";
import { time_delta } from '../Functions/TimeDelta'

const StorySlider = ({ story }) => {
  const [storyContext, setStoryContext] = useContext(StoryContext);
  const [stories, setStories] = useState([]);

  const initStories = () => {
    let storiesData = [];
    for (let index = 0; index < story.storyPhotoes.length; index++) {
      storiesData = storiesData.concat({
        url: `http://127.0.0.1:8000/media/${story.storyPhotoes[index]}`,
        header: {
          heading: story.username,
          subheading: time_delta(story.dateAdded),
          profileImage: `http://127.0.0.1:8000${story.profileImage}`,
        },
      });
    }
    setStories(
      <Stories
        stories={storiesData}
        defaultInterval={storiesData.length * 4000}
        width={"100%"}
        height={"95%"}
        onAllStoriesEnd={() => setStoryContext(false)}
      />
    );
  };

  useEffect(() => {
    initStories();
  }, []);

  if (!storyContext) return null;
  else
    return (
      <div className="fixed max-w-4xl h-screen w-screen top-0 -left-4 2xl:left-80 z-20">
        {stories}
        <section className="flex w-full space-x-2 items-center p-2 absolute bottom-2 bg-white dark:bg-black">
          <input
            className="w-5/6 bg-transparent outline-none p-2 border-2 rounded-xl mr-auto"
            placeholder="Send message"
          />
          <div className="flex space-x-3">
            <HeartIcon />
            <SendIcon />
          </div>
        </section>
      </div>
    );
};
export default StorySlider;
