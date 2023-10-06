import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { ReactComponent as LeftArrowIcon } from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import Activity from "../components/Activity";
import { time_delta } from "../Functions/TimeDelta";

const NotificationsPage = () => {
  const nav = useNavigate();
  const [activities, setActivities] = useState({
    "This hour": [],
    "This day": [],
    Earlier: [],
  });

  const getActivites = async () => {
    let activitiesTemp = { "This hour": [], "This day": [], Earlier: [] };
    let res = await fetch(`http://127.0.0.1:8000/api/get_activites/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    let data = await res.json();
    for (let index in data) {
      if (
        time_delta(data[index].date_added).includes("min") ||
        time_delta(data[index].date_added).includes("sec")
      ) {
        activitiesTemp["This hour"].push(
          <Activity
            key={index + 1}
            influncerId={data[index].influncer}
            profileImage={data[index].profile_image}
            username={data[index].username}
            action={data[index].action}
            dateAdded={time_delta(data[index].date_added)}
          />
        );
      } else if (time_delta(data[index].date_added).includes("hour")) {
        activitiesTemp["This day"].push(
          <Activity
            key={index + 1}
            influncerId={data[index].influncer}
            profileImage={data[index].profile_image}
            username={data[index].username}
            action={data[index].action}
            dateAdded={time_delta(data[index].date_added)}
          />
        );
      } else if (time_delta(data[index].date_added).includes("day")) {
        activitiesTemp["Earlier"].push(
          <Activity
            key={index + 1}
            influncerId={data[index].influncer}
            profileImage={data[index].profile_image}
            username={data[index].username}
            action={data[index].action}
            dateAdded={time_delta(data[index].date_added)}
          />
        );
      }
    }
    setActivities(activitiesTemp);
  };

  useEffect(() => {
    getActivites();
  }, []);

  return (
    <div>
      <div className="p-2 space-y-6">
        <section className="fixed top-0 left-0 xl:left-80 flex w-screen py-2 z-10 bg-white dark:bg-black">
          <div className="ml-2 flex items-center space-x-6">
            <div className="cursor-pointer" onClick={() => nav("/")}>
              <LeftArrowIcon />
            </div>
            <div className="text-xl font-semibold">Notifications</div>
          </div>
        </section>

        <hr />

        <div className="space-y-6 pb-10">
          <section className="space-y-6 overflow-scroll">
            {activities["This hour"].length ? (
              <div>
                <div className="text-xl mb-2">This hour</div>
                <div>{activities["This hour"]}</div>
              </div>
            ) : null}

            {activities["This day"].length ? (
              <div>
                <div className="text-xl mb-2">This day</div>
                <div className="space-y-4">{activities["This day"]}</div>
              </div>
            ) : null}

            {activities["Earlier"].length ? (
              <div>
                <div className="text-xl mb-2">Earlier</div>
                <div className="space-y-4">{activities["Earlier"]}</div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default NotificationsPage;
