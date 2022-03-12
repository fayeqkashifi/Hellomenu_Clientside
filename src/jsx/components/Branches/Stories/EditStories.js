import React, { Fragment, useState, useEffect } from "react";
import "yup-phone";
import { base_url, port } from "../../../../Consts";
import { localization as t } from "../../Localization";
import ReactPlayer from "react-player/lazy";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

const EditStories = (props) => {
  const id = props.history.location.state.id;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const history = useHistory();

  const [tagProducts, setTagProducts] = useState([]);
  const handleSelect = (e) => {
    setTagProducts(e);
  };

  const dataLoad = async () => {
    try {
      const response = await axios.get(`/api/EditStory/${id}`);
      if (response.data.status === 200) {
        const result = response.data.data;
        setData(result);
        const value = [];
        JSON.parse(result.storyVideosUrl).map((item) => {
          value.push({
            name: item,
            errors: {
              name: null,
            },
          });
        });
        setForm(value);
        setTagProducts(JSON.parse(result?.storyTagProducts));
        const res = await axios.get(`/api/GetProducts/${result.branch_id}`);
        if (res.data.status === 200) {
          setProducts(res.data.fetchData);
        }
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
  const save = () => {
    const formData = new FormData();
    formData.append("storyVideos", data.storyVideos);
    formData.append("storyTagProducts", JSON.stringify(tagProducts));
    formData.append("id", data.id);
    formData.append("form", JSON.stringify(form));
    axios.post("/api/UpdateStory", formData).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success").then((check) => {
          if (check) {
            history.push({
              pathname: `/branches/story-branch`,
              state: { id: data.branch_id },
            });
          }
        });
      }
    });
  };
  const removeVideo = (e, video) => {
    e.preventDefault();
    axios.post(`/api/removeBranchStoryVideo/${video}`).then((res) => {
      if (res.data.status === 200) {
        setData({
          ...data,
          storyVideos: JSON.stringify(
            JSON.parse(data.storyVideos).filter((item) => item !== video)
          ),
        });
      }
    });
  };
  const handleVideo = (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file[]", e.target.files[i]);
    }
    const images = [];
    axios.post("/api/uploadBranchStoryVideo", formData).then((res) => {
      if (res.data.status === 200) {
        JSON.parse(data.storyVideos)?.map((item) => {
          images.push(item);
        });
        res.data.filenames.map((item) => {
          images.push(item);
        });

        setData({
          ...data,
          storyVideos: JSON.stringify(images),
        });
      }
    });
  };

  const [form, setForm] = useState([]);

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.name === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];
        // console.log();
        if (form[index].name === "") {
          allPrev[index].errors.name = "URL is required";
        }
        //  if (allPrev.some((val) => val.name == form[index].name)) {
        //   allPrev[index].errors.name = "Duplicate Entry";
        // }
        return setForm(allPrev);
      });
    }

    return !someEmpty;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const inputState = {
      name: "",
      errors: {
        name: null,
      },
    };

    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();

    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        return {
          ...item,
          [event.target.name]: event.target.value,

          errors: {
            ...item.errors,
            [event.target.name]:
              event.target.value.length > 0
                ? null
                : [event.target.name] + " Is required",
          },
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();

    setForm((prev) => prev.filter((item) => item !== prev[index]));
  };

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
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t("edit_story")}</h3>
            </div>
            <div className="card-body">
              <div className="row form-group">
                <div
                  className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  {t("tag_product")}
                </div>
                <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                  <Select
                    defaultValue={tagProducts}
                    isMulti
                    options={products?.map((pro, i) => {
                      return {
                        value: pro.id,
                        label: pro.ProductName,
                      };
                    })}
                    onChange={handleSelect}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="row form-group">
                <div
                  className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  {t("video")}
                </div>
                <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control"
                    name="video"
                    onChange={handleVideo}
                    multiple
                    data-overwrite-initial="false"
                    data-min-file-count="1"
                  />
                </div>
                <div className="row form-group my-2">
                  {JSON.parse(data.storyVideos)?.map((video) => {
                    return (
                      <div className="col-xl-2 col-lg-2 col-sm-2" key={video}>
                        <div className="card ">
                          <div className="text-center">
                            <ReactPlayer
                              width="inherit"
                              height="150px"
                              url={`http://${base_url}:${port}/videos/branches/${video}`}
                              controls={true}
                              playing={false}
                            />
                          </div>

                          <div className="card-footer pt-0 pb-0 text-center">
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={(e) => removeVideo(e, video)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="row form-group">
                <div
                  className="col-xl-3 col-xxl-3 col-lg-3 col-sm-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  {t("video_url")}
                </div>
                <div className="col-xl-9 col-xxl-9 col-lg-9 col-sm-9">
                  {form.map((item, index) => (
                    <div className="row mt-3" key={`item-${index}`}>
                      <div className="col-10">
                        <input
                          type="text"
                          className={
                            item.errors.name
                              ? "form-control  is-invalid"
                              : "form-control"
                          }
                          name="name"
                          placeholder="URL..."
                          value={item.name}
                          onChange={(e) => onChange(index, e)}
                        />

                        {item.errors.name && (
                          <div className="invalid-feedback">
                            {item.errors.name}
                          </div>
                        )}
                      </div>

                      <div className="col-2">
                        <IconButton
                          onClick={(e) => handleRemoveField(e, index)}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                        </IconButton>
                      </div>
                    </div>
                  ))}

                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleAddLink}
                  >
                    {t("add")}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-footer text-right">
              <Button
                variant="danger light"
                className="m-1"
                onClick={() => history.goBack()}
              >
                {t("back")}
              </Button>
              <Button variant="primary" onClick={save}>
                {t("save")}{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Fragment>{viewBranches_HTMLTABLE}</Fragment>;
};

export default EditStories;
