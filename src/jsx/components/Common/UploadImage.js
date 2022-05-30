import React, { useEffect } from "react";
import ImageUploading from "react-images-uploading";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
const UploadImage = (props) => {
  const { images, setImages, values, urlPath } = props;
  const onChangeTest = (imageList, addUpdateIndex) => {
    console.log(imageList);
    setImages(imageList);
  };

  useEffect(() => {
    const valuePush = [];
    console.log(values);
    if (values !== undefined) {
      if (values.length > 0) {
        values.map((v) => {});

        // setImages(valuePush);
      }
    }
  }, []);
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
};

export default UploadImage;
