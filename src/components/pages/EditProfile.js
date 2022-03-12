import React, { useState } from "react";
import { storage, db } from "../../firebase";
import ImageCropper from "../../utils/ImageCropper";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const ImageUpload = () => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");

  const getBlob = (blob) => {
    // pass blob up from the ImageCropper component
    setBlob(blob);
  };

  const onInputChange = (e) => {
    // convert image file to base64 string
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        setInputImg(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImage = (e) => {
    // upload blob to firebase 'images' folder with filename 'image'
    e.preventDefault();

    storage
      .ref("images")
      .child("image")
      .put(blob, { contentType: blob.type })
      .then((res) => {
        // redirect user
      });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* <GlobalStyles /> */}
      <form onSubmit={handleSubmitImage}>
        <input
          type="file"
          accept="image/*"
          onChange={onInputChange}
          style={{ marginBottom: "40px" }}
        />

        <button type="submit">Submit</button>
      </form>
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0,0,0,0.2",
          border: "1px solid black",
        }}
      >
        {inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} />}
        {!inputImg && <div style={{ color: "white" }}>No Image to preview</div>}
      </div>
    </div>
  );
};

export default ImageUpload;
