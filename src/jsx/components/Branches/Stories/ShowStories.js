import React, { Fragment, useState, useEffect } from "react";
import "yup-phone";
import { base_url, port } from "../../../../Consts";
import { localization as t } from "../../Localization";
import ReactPlayer from "react-player/lazy";
import axios from "axios";

const ShowStories = (props) => {
  const id = props.history.location.state.id;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async () => {
    try {
      const response = await axios.get(`/api/EditStory/${id}`);
      if (response.data.status === 200) {
        setData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setLoading(true);
    };
  }, []);
  var viewBranches_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewBranches_HTMLTABLE = (
      <div className="row">
        {JSON.parse(data?.storyVideos)?.map((video) => {
          return (
            <div className="col my-3" key={video}>
              <ReactPlayer
                width="300px"
                height="400px"
                url={`http://${base_url}:${port}/videos/branches/${video}`}
                controls={true}
                playing={false}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return <Fragment>{viewBranches_HTMLTABLE}</Fragment>;
};

export default ShowStories;
