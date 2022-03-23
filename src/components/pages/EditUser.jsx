import React, { useState, useEffect } from "react";
import "../../assets/own.css";
import { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import { navigate } from "@reach/router";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";
import { storage } from "../../firebase";
import ImageCropper from "../../utils/ImageCropper";
import { ToastContainer, toast } from "react-toastify";

import { Modal } from "react-bootstrap";

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

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Body style={{ display: "flex", alignItems: "center" }}>
        <center>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>{" "}
          {/* <ImageUpload /> */}
        </center>
      </Modal.Body>
    </Modal>
  );
}

export default function EditUser() {
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedInUser = useSelector((state) => state.setAddress);

  const [userData, setUserData] = useState();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [bio, setBio] = useState();
  const [facebook, setFacebook] = useState();
  const [twitter, setTwitter] = useState();
  const [instagram, setInstagram] = useState();
  const [telegram, setTelegram] = useState();
  const [phone, setPhone] = useState();
  const [profileImage, setProfileImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [verified, setVerified] = useState();
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");
  const [progress, setProgress] = useState();
  const [followers, setFollowers] = useState();

  const [changed, setChanged] = useState(false);

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

  const notifyError = (message) =>
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  useEffect(() => {
    const wallet_address = window.location.href.split("/")[4];

    // setWalletAddress(walle)

    const getCurrentUser = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    };

    if (localStorage.getItem("wallet_address")) {
      getCurrentUser()
        .then((res) => {
          if (res !== localStorage.getItem("wallet_address")) {
            alert(
              "Not authorized to perform the action. If you are the address owner connect wallet to continue"
            );
            console.log("accounts mismatch");
          } else {
            axios({
              method: "POST",
              url: baseURL + "/get_user_data",
              data: {
                walletAddress: res,
              },
            })
              .then((response) => {
                const a = response.data.user;
                setFirstName(a.full_name ? a.full_name.split(" ")[0] : "");
                setLastName(a.full_name ? a.full_name.split(" ")[1] : "");
                setEmail(a.email);
                setBio(a.bio);
                setFacebook(a.facebook);
                setInstagram(a.instagram);
                setTelegram(a.telegram);
                setTwitter(a.twitter);
                setPhone(a.phone);
                setVerified(a.is_verified);
                setUserName(a.user_name);
                setUserData(response.data.user);
                setCoverImage(a.cover_image);
                setProfileImage(a.profile_image);
                setLoading(false);
              })
              .catch((e) => {
                console.log("error occurres", e);
              });
            console.log("accounts approved");
          }
        })
        .catch((err) => console.log("some error occurred"));
    } else {
      alert(
        "Not authorized to perform the action. If you are the address owner connect wallet to continue"
      );
      navigate("/wallet");
    }
  }, []);

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
    setModalShow(true);

    const uploadTask = storage
      .ref("images")
      .child(`${window.location.href.split("/")[4]}`)
      .child("profile_image")
      .put(blob, { contentType: blob.type });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(`${window.location.href.split("/")[4]}`)

          .child("profile_image")
          .getDownloadURL()
          .then((url) => {
            axios({
              method: "POST",
              url: baseURL + "/update_profile_image",
              data: {
                walletAddress: window.location.href.split("/")[4],
                profileImage: url,
              },
            })
              .then((response) => {
                console.log(response, "this is response data");

                if (response.data.message === "success") {
                  setProfileImage(response.data.profile_image);
                  notifySuccess("Profile image updated successfully");
                  setInputImg("");

                  setModalShow(false);
                }
              })
              .catch((e) => {
                alert("some error occurred");
              });
          });
      }
    );
  };

  ////update cover image

  const uploadCover = (val) => {
    setModalShow(true);

    const uploadTask = storage
      .ref("images")
      .child(`${window.location.href.split("/")[4]}`)
      .child("cover_image")
      .put(val);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(`${window.location.href.split("/")[4]}`)

          .child("cover_image")
          .getDownloadURL()
          .then((url) => {
            axios({
              method: "POST",
              url: baseURL + "/update_cover_image",
              data: {
                walletAddress: window.location.href.split("/")[4],
                coverImage: url,
              },
            })
              .then((response) => {
                console.log(response, "this is response data");

                if (response.data.message === "success") {
                  setCoverImage(response.data.cover_image);
                  notifySuccess("Cover image updated successfully");
                  setInputImg("");

                  setModalShow(false);
                }
              })
              .catch((e) => {
                alert("some error occurred");
              });
          });
      }
    );
  };

  const updateProfile = async () => {
    setModalShow(true);
    axios({
      method: "POST",
      url: baseURL + "/update_user_info",
      data: {
        walletAddress: window.location.href.split("/")[4],
        fullName: firstName + " " + lastName,
        bio: bio,
        email: email,
        instagram: instagram,
        facebook: facebook,
        telegram: telegram,
        twitter: twitter,
        userName: userName,
        phone: phone,
      },
    })
      .then((res) => {
        if (res.data.message === "username taken") {
          setModalShow(false);
          notifyError("User name already taken");
        } else {
          setChanged(false);
          setModalShow(false);
          notifySuccess("Update profile Info successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        setChanged(false);
        setModalShow(false);

        notifyError("Some error occurred");
      });
  };

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
          {" "}
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <section
            id="profile_banner"
            className="jumbotron breadcumb no-bg"
            style={{
              backgroundImage: `url(${
                coverImage !== undefined
                  ? coverImage
                  : "../../img/author_single/author_banner.jpg"
              })`,
            }}
          >
            <div>
              <label
                className="btn-main"
                style={{
                  position: "absolute",
                  marginTop: "300px",
                  right: 0,
                  left: 0,
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "200px",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  id="inputGroupFile01"
                  onChange={(e) => uploadCover(e.target.files[0])}
                />
                Change Cover
              </label>
            </div>
          </section>
          {/* <p>For better </p> */}
          <div className="edit-profile-section">
            <div className="edit-profile-container">
              <div className="edit-profile-wrapper-bottom w-row">
                <div className="edit-profile-left w-col w-col-3 w-col-stack">
                  <div
                    className="left-wrapper"
                    style={{ position: "relative" }}
                  >
                    {inputImg ? (
                      <div
                        style={{
                          position: "relative",
                          width: "200px",
                          height: "200px",
                          borderRadius: "100px",
                          marginBottom: "20px",
                        }}
                      >
                        <ImageCropper getBlob={getBlob} inputImg={inputImg} />
                      </div>
                    ) : (
                      <img
                        src={
                          profileImage
                            ? profileImage
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt=""
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "100px",
                          marginBottom: "24px",
                          border: "1px solid gray",
                        }}
                      />
                    )}

                    {inputImg ? (
                      <>
                        <div
                          className="btn-main mb-2"
                          onClick={(e) => handleSubmitImage(e)}
                        >
                          Upload Image
                        </div>
                        <div
                          className="btn-main cancel-btn"
                          style={{ width: "172px", background: "black" }}
                          onClick={() => {
                            setModalShow(true);
                            setInputImg("");
                            setModalShow(false);
                          }}
                        >
                          Cancel
                        </div>
                      </>
                    ) : (
                      <label className="btn-main">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={onInputChange}
                        />
                        Change Image
                      </label>
                    )}
                  </div>
                </div>
                <div className="edit-profile-right w-col w-col-9 w-col-stack">
                  <div className="profile-edit-form w-form">
                    <div
                      id="email-form"
                      name="email-form"
                      data-name="Email Form"
                      method="get"
                      className="edit-profile-form"
                    >
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label htmlFor="name" className="edit-profile-label">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="name"
                            data-name="Name"
                            placeholder="Enter your first name"
                            id="name"
                            required=""
                            value={firstName ? firstName : ""}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                        <div className="_2-wrapper">
                          <label
                            htmlFor="name-2"
                            className="edit-profile-label"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="name-2"
                            data-name="Name 2"
                            placeholder="Enter your first name"
                            id="name-2"
                            required=""
                            value={lastName ? lastName : ""}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Email-2"
                            className="edit-profile-label"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Email"
                            data-name="Email"
                            placeholder="Enter your email address"
                            id="Email-2"
                            required=""
                            value={email ? email : ""}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Phone-Number"
                            className="edit-profile-label"
                          >
                            Phone number
                          </label>
                          <input
                            type="tel"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Phone-Number"
                            data-name="Phone Number"
                            placeholder="Enter your phone number"
                            id="Phone-Number"
                            required=""
                            value={phone ? phone : ""}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Username"
                            className="edit-profile-label"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Username"
                            data-name="Username"
                            placeholder="Choose an unique username"
                            id="Username"
                            required=""
                            value={userName ? userName : ""}
                            onChange={(e) => {
                              setUserName(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label htmlFor="Bio" className="edit-profile-label">
                            Bio
                          </label>
                          <textarea
                            placeholder="Tell about yourself"
                            maxLength="5000"
                            id="Bio"
                            name="Bio"
                            data-name="field"
                            className="edit-profile-field w-input"
                            value={bio ? bio : ""}
                            onChange={(e) => {
                              setBio(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          ></textarea>
                        </div>
                      </div>
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Facebook"
                            className="edit-profile-label"
                          >
                            Facebook Profile
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Facebook"
                            data-name="Facebook"
                            placeholder="Enter your Facebook profile"
                            id="Facebook"
                            value={facebook ? facebook : ""}
                            onChange={(e) => {
                              setFacebook(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Instagram"
                            className="edit-profile-label"
                          >
                            Instagram Profile
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Instagram"
                            data-name="Instagram"
                            placeholder="Enter your Instagram profile"
                            id="Instagram"
                            value={instagram ? instagram : ""}
                            onChange={(e) => {
                              setInstagram(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="_1-wrapper">
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Twitter"
                            className="edit-profile-label"
                          >
                            Twitter Profile
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Twitter"
                            data-name="Twitter"
                            placeholder="Enter your Twitter profile"
                            id="Twitter"
                            value={twitter ? twitter : ""}
                            onChange={(e) => {
                              setTwitter(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                        <div className="_2-wrapper">
                          <label
                            htmlFor="Enter-your-LinkedIn-profile"
                            className="edit-profile-label"
                          >
                            Telegram
                          </label>
                          <input
                            type="text"
                            className="edit-profile-field w-input"
                            maxLength="256"
                            name="Enter-your-LinkedIn-profile"
                            data-name="Enter your LinkedIn profile"
                            placeholder="Enter your LinkedIn profile"
                            id="Enter-your-LinkedIn-profile"
                            value={telegram ? telegram : ""}
                            onChange={(e) => {
                              setTelegram(e.target.value);
                              if (!changed) {
                                setChanged(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-button-wrapper">
                        <button
                          className="image-button grey top w-button"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className={`image-button right w-button`}
                          style={{
                            background: `${changed ? "#8364e2" : "gray"}`,
                            boxShadow: `${changed ? "" : "none"}`,
                            cursor: "pointer",
                          }}
                          onClick={() => updateProfile()}
                          disabled={!changed}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                    <div className="w-form-done">
                      <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="w-form-fail">
                      <div>
                        Oops! Something went wrong while submitting the form.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
