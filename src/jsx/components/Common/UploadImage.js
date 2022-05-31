import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";

const UploadImage = (props) => {
  const { images, setImages, values, urlPath } = props;
  const [loading, setLoading] = useState(true);

  const onChangeTest = (imageList, addUpdateIndex) => {
    // console.log(imageList);
    setImages(imageList);
  };

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  const AccessImage = () => {
    const valuePush = [];

    values.map(async (v) => {
      const res = await toDataURL(urlPath + v);
      // console.log(res);
      //   .then((dataUrl) => {
      //   // console.log("Here is Base64 Url", res);
      var fileData = dataURLtoFile(res, v);
      //   // console.log("Here is JavaScript File Object", fileData);
      valuePush.push({
        data_url: res,
        file: fileData,
      });
      // console.log(valuePush);
      if (valuePush.length === values.length) {
        setLoading(false);
        setImages(valuePush);
      }
      // });
    });
  };
  useEffect(() => {
    if (values !== undefined && values !== null) {
      if (values.length > 0) {
        AccessImage();
      }
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only"></span>
      </div>
    );
  } else {
    return (
      <div className="App">
        <ImageUploading
          multiple
          value={images}
          onChange={onChangeTest}
          dataURLKey="data_url"
          acceptType={["jpg", "gif", "png"]}
          maxFileSize={5000000}
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
            errors,
          }) => (
            <div className="upload__image-wrapper">
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
                type="button"
                className="btn btn-outline-secondary btn-sm"
              >
                Click or Drop here
              </button>
              &nbsp;
              <button
                type="button"
                onClick={onImageRemoveAll}
                className="btn btn-outline-danger btn-sm"
              >
                Remove all images
              </button>
              <div className="row my-2">
                {imageList.map((image, index) => (
                  <div key={index} className="image-item col">
                    <img
                      src={image["data_url"]}
                      alt=""
                      width="100"
                      className="rounded"
                    />
                    <div className="image-item__btn-wrapper">
                      <IconButton onClick={() => onImageRemove(index)}>
                        <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                      </IconButton>
                      <IconButton onClick={() => onImageUpdate(index)}>
                        <BrowserUpdatedIcon
                          fontSize="small"
                          sx={{ color: "green" }}
                        />
                      </IconButton>
                      {/* <button>Remove</button> */}
                    </div>
                  </div>
                ))}
              </div>
              {errors && (
                <div className="text-danger">
                  {errors.maxNumber && (
                    <small>Number of selected images exceed maxNumber</small>
                  )}
                  {errors.acceptType && (
                    <small>Your selected file type is not allow</small>
                  )}
                  {errors.maxFileSize && (
                    <small>Selected file size exceed maxFileSize</small>
                  )}
                </div>
              )}
            </div>
          )}
        </ImageUploading>
      </div>
    );
  }
};

export default UploadImage;
