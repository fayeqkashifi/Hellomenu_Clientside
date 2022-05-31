import React, { useEffect } from "react";
import ImageUploading from "react-images-uploading";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import axios from "axios";

const UploadImage = (props) => {
  const { images, setImages, values, urlPath } = props;
  const onChangeTest = (imageList, addUpdateIndex) => {
    console.log(imageList);
    setImages(imageList);
  };
  // let url =
  //   "https://cdn.shopify.com/s/files/1/0234/8017/2591/products/young-man-in-bright-fashion_925x_f7029e2b-80f0-4a40-a87b-834b9a283c39.jpg";
  // const toDataURL = (url) =>
  //   fetch(url)
  //     .then((response) => response.blob())
  //     .then(
  //       (blob) =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     );

  // function dataURLtoFile(dataurl, filename) {
  //   var arr = dataurl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // }

  useEffect(() => {
    const valuePush = [];
    console.log(values);
    if (values !== undefined && values !== null) {
      if (values.length > 0) {
        values.map((v) => {
          let url =
            "http://127.0.0.1:8000/images/branches/1653889971775266796.jpg";
          const res = axios.get(url);
          console.log(res);

          // toDataURL(url).then((dataUrl) => {
          //   console.log("Here is Base64 Url", dataUrl);
          //   var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
          //   console.log("Here is JavaScript File Object", fileData);
          //   // fileArr.push(fileData);
          // });
        });

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
