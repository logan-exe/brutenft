import React, { useEffect, useState } from "react";
import ColumnZero from "../components/ColumnZero";
import ColumnZeroTwo from "../components/ColumnZeroTwo";
import ColumnZeroThree from "../components/ColumnZeroThree";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { setLoading } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { stopLoading } from "../../actions";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";

import ImageCropper from "../../utils/ImageCropper";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
import { storage, db } from "../../firebase";
import { navigate } from "@reach/router";

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

let imgInput = document.getElementById("image-input");
imgInput?.addEventListener("change", function (e) {
  if (e.target.files) {
    let imageFile = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = document.createElement("img");
      img.onload = function (event) {
        // Dynamically create a canvas element
        var canvas = document.createElement("canvas");

        // var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        // Actual resizing
        ctx.drawImage(img, 0, 0, 300, 300);

        // Show resized image in preview element
        var dataurl = canvas.toDataURL(imageFile.type);
        document.getElementById("preview").src = dataurl;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }
});

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      200,
      200
    );
  });

const Profile = function () {
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userData, setUserData] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState("");
  const [image, setImage] = useState();
  const [progress, setProgress] = useState();
  const [imageLoading, setImageLoading] = useState(false);

  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");

  //user states

  const loggedInWallet = useSelector((state) => state.setAddress);

  // const navigate = useNavigate();

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setOpenMenu2(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu2(false);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
    setOpenMenu(false);
    setOpenMenu1(false);
    document.getElementById("Mainbtn2").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

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

  useEffect(() => {
    const wallet_address = window.location.href.split("/")[4];

    setWalletAddress(wallet_address);
    console.log(walletAddress, "this is it");
    axios({
      method: "POST",
      url: baseURL + "/get_user_data",
      data: {
        walletAddress: wallet_address,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("signature")}`,
      },
    })
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.user);
          setUserData(res.data.user);
          setLoading(false);
        }
      })
      .catch((err) => {
        navigate("/");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <GlobalStyles />
      <ToastContainer />

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <section
            id="profile_banner"
            className="jumbotron breadcumb no-bg"
            style={{
              backgroundImage: `url(${userData.cover_image})`,
            }}
          >
            <div className="mainbreadcumb"></div>
          </section>

          <section className="container no-bottom">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {imageLoading ? (
                        "Loading..."
                      ) : (
                        <img
                          src={userData.profile_image}
                          alt=""
                          style={{ width: "150px", height: "150px" }}
                        />
                      )}

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {userData.full_name}
                          {userData.wallet_address === loggedInWallet ? (
                            <a href={`/profile/${walletAddress}/editprofile`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#8364E2"
                                className="bi bi-pencil-square"
                                style={{
                                  background: "none",
                                  marginLeft: "20px",
                                  cursor: "pointer",
                                  zIndex: "100",
                                }}
                                viewBox="0 0 16 16"
                                // onClick={() => alert("hello")}
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                />
                              </svg>
                            </a>
                          ) : (
                            ""
                          )}

                          <span className="profile_username">
                            {"@" + userData.user_name}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {userData.wallet_address}
                          </span>
                          <button
                            id="btn_copy"
                            title="Copy Text"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                userData.wallet_address
                              );
                              notifySuccess("Address copied");
                            }}
                          >
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">500 followers</div>
                    </div>
                    <div className="de-flex-col">
                      <span className="btn-main">Follow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container no-top">
            <div className="row">
              <div className="col-lg-12">
                <div className="items_filter">
                  <ul className="de_nav text-left">
                    <li id="Mainbtn" className="active">
                      <span onClick={handleBtnClick}>On Sale</span>
                    </li>
                    <li id="Mainbtn1" className="">
                      <span onClick={handleBtnClick1}>Created</span>
                    </li>
                    <li id="Mainbtn2" className="">
                      <span onClick={handleBtnClick2}>Collected</span>
                    </li>
                    <li id="Mainbtn2" className="">
                      <span>Offers recieved</span>
                    </li>
                    <li id="Mainbtn2" className="">
                      <span>Offers Made</span>
                    </li>
                    <li id="Mainbtn2" className="">
                      <span>Offers Made</span>
                    </li>
                  </ul>
                </div>
              </div>
              <hr />
            </div>
            {openMenu && (
              <div id="zero1" className="onStep fadeIn">
                <ColumnZero />
              </div>
            )}
            {openMenu1 && (
              <div id="zero2" className="onStep fadeIn">
                <ColumnZeroTwo />
              </div>
            )}
            {openMenu2 && (
              <div id="zero3" className="onStep fadeIn">
                <ColumnZeroThree />
              </div>
            )}
          </section>

          <Footer />
        </>
      )}
    </div>
  );
};
export default Profile;
