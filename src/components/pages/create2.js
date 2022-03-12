import React, { useState, useEffect } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";
import { navigate } from "@reach/router";
import { contractAbi } from "../../utils/contractAbi";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { setAddress } from "../../actions";
import { ethers } from "ethers";
import Web3 from "web3";
import { useDispatch } from "react-redux";
import { tradeAbi } from "../../utils/tradeAbi";
import Form from "react-bootstrap/Form";
import { Checkmark } from "../components/Checkmark";
import { storage } from "../../firebase";

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

export default function CreatePage() {
  const [nftName, setNftName] = useState("");
  const [file, setFile] = useState();
  const [royalty, setRoyalty] = useState();
  const [onSale, setOnSale] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialPrice, setIntialPrice] = useState();
  const [tokenId, setTokenId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [nftType, setNftType] = useState("");
  const [instantSale, setInstantSale] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [userData, setUserData] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const [modalShow, setModalShow] = useState(false);

  const [onAuction, setOnAuction] = useState(false);

  const [progress, setProgress] = useState();

  const [mintingLoader, setMintingLoader] = useState(true);
  const [approveLoader, setApproveLoader] = useState(true);
  const [listingLoader, setListingLoader] = useState(true);
  const [minted, setMinted] = useState(false);

  const dispatch = useDispatch();

  const handleShow = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_1").classList.remove("hide");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow1 = () => {
    document.getElementById("tab_opt_1").classList.add("hide");
    document.getElementById("tab_opt_1").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.add("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow2 = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.add("active");
  };

  const unlockClick = () => {
    setInstantSale(true);
  };
  const unlockHide = () => {
    setInstantSale(false);
  };

  useEffect(() => {
    const wallet_address = window.location.href.split("/")[4];

    setWalletAddress(wallet_address);
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
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const mintNft = async (metaDataURI) => {
    if (window.ethereum) {
      console.log("inisde mint NFT");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        contractAbi,
        signer
      );

      const createNft = await contract.createNFT(metaDataURI, royalty);

      const tx = await createNft.wait();

      return tx;
    } else {
      alert("Some error occurred in mintNFT");
    }
  };

  const setApproval = async () => {
    if (window.ethereum) {
      console.log("inisde set approval for All");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        contractAbi,
        signer
      );

      const tradeApprove = await contract.setApprovalForAll(
        "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1",
        true
      );

      const tradeApproveTx = await tradeApprove.wait();

      return tradeApproveTx;
    } else {
      alert("some error occurred in setApproval");
    }
  };

  const checkApprovalStatus = async () => {
    console.log("inisde set approval for All");
    if (window.ethereum) {
      // const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        contractAbi,
        signer
      );

      const tradeApprove = await contract.isApprovedForAll(
        accounts[0],
        "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1"
      );

      console.log(tradeApprove, "this is tradeApprove");

      // const tradeApproveTx = await tradeApprove.wait();

      // return tradeApproveTx;
    } else {
      alert("some error occurred in setApproval");
    }
  };

  const createListing = async (newTokenId) => {
    if (window.ethereum) {
      console.log("inisde create Listing approval");
      const web3 = new Web3(window.ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1",
        tradeAbi,
        signer
      );

      const weiValue = web3.utils.toWei(initialPrice);

      const listing = await contract.addListing(
        weiValue,
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        newTokenId
      );

      const listingTx = await listing.wait();

      console.log(listingTx);

      return listingTx;
    }
  };

  const uploadToFireBase = async (newTokenId) => {
    //  setImageLoading(true);
    //  setImage(val);
    const uploadTask = storage
      .ref("images")
      .child("nfts")
      .child(newTokenId)
      .put(file);

    let localImageUrl = "";
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
          .child("nfts")
          .child(newTokenId)
          .getDownloadURL()
          .then((url) => {
            console.log(url, "this is url");
            localImageUrl = url;
          });
      }
    );

    return localImageUrl;
  };

  const createImageUrl = async () => {
    const newImgUrl = await uploadToFireBase("5");

    console.log(newImgUrl);
  };

  const createNft = async () => {
    setModalShow(true);
    if (!file || !nftName || !description || !nftType || !description) {
      setModalShow(false);
      notifyError("Mandatory Fields are empty!");
      return;
    }
    if (royalty > 50 || royalty < 0) {
      setModalShow(false);
      notifyError("Royalty should be in a range of 0-50");
      return;
    }

    if (nftType === "music") {
      setModalShow(false);
      notifyError("OOPS! Minting of Music Nfts are paused for a while");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      let chainId = await web3.eth.net.getId();
      if (chainId !== 80001) {
        notifyError("Wrong Network! Kindly change to Binance Test Network");
        dispatch(setAddress(""));
        navigate("/");
        localStorage.clear();
        // setLoading(false);
        return;
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage("Hello signing message");

        const contract = new ethers.Contract(
          "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
          contractAbi,
          signer
        );

        //////////UPLOAD IMAGE
        const formData = new FormData();
        formData.append("myImage", file);

        const config = {
          headers: {
            "content-type": "multipart/form-data",
            authorization: `Bearer ${signature}`,
          },
        };

        axios
          .post(baseURL + "/upload", formData, config)
          .then((res) => {
            console.log("this is response", res);
            notifySuccess("uploaded successfully!");
            const myData = {
              name: nftName,
              creator: accounts[0],
              description: description,
              imagePath: res.data,
              cover: "",
              type: nftType,
              royalty: royalty,
              initialPrice: initialPrice,
              onSale: onSale,
            };
            axios({
              method: "POST",
              url: baseURL + "/create_meta_data",
              data: myData,
            })
              .then(async (response) => {
                notifySuccess("Meta data generated successfully !");
                console.log(response, "creation of metadata");
                const nft = await mintNft(response.data.metaDataURI);

                console.log(
                  "new token minted",
                  parseInt(nft.events[0].args.tokenId["_hex"], 16)
                );
                setMintingLoader(!mintingLoader);

                setTokenId(parseInt(nft.events[0].args.tokenId["_hex"], 16));
                setTxHash(nft.transactionHash);
                let myNftImage = `https://ipfs.io/ipfs/${response.data.imageHash}`;
                let metaDataURI = response.data.metaDataURI;

                const checkApprovedForAll = await contract.isApprovedForAll(
                  accounts[0],
                  "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1"
                );

                if (!checkApprovedForAll) {
                  await setApproval();
                  setApproveLoader(!approveLoader);
                } else {
                  setApproveLoader(!approveLoader);
                }

                if (onSale) {
                  await createListing(
                    parseInt(nft.events[0].args.tokenId["_hex"], 16)
                  );
                  setListingLoader(!listingLoader);
                }

                if (onAuction) {
                }

                const uploadTask = storage
                  .ref("images")
                  .child("nfts")
                  .child(nft.events[0].args.tokenId["_hex"], 16)
                  .put(file);

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
                      .child("nfts")
                      .child(nft.events[0].args.tokenId["_hex"], 16)
                      .getDownloadURL()
                      .then((url) => {
                        console.log(url, "this is url");
                        axios({
                          method: "POST",
                          url: baseURL + "/save_new_nft",
                          data: {
                            walletAddress: userData.wallet_address,
                            tokenId: parseInt(
                              nft.events[0].args.tokenId["_hex"],
                              16
                            ).toString(),
                            onSale: onSale,
                            nftType: nftType,
                            creatorImage: userData.profile_image,
                            ownerImage: userData.profile_image,
                            ownedBy: accounts[0],
                            createdBy: accounts[0],
                            imageIpfs: myNftImage,
                            metadataIpfs: metaDataURI,
                            imageUrl: url,
                            royalty: royalty,
                            title: nftName,
                            description: description,
                            onAuction: onAuction,
                            auctionStartDate: startDate,
                            auctionEndDate: endDate,
                            auctionStartTime: "",
                            auctionEndTime: "",
                            txHash: nft.transactionHash,
                            music: "",
                          },
                        })
                          .then((res) => {
                            if (res.data.message === "success") {
                              setMinted(!minted);
                            }
                          })
                          .catch((e) => {
                            alert("some error occurred storing NFT");
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                        alert("some error occurred!");
                      });
                  }
                );
              })
              .catch((err) => {
                console.log(err.message, "iniside error");
              });
          })
          .catch((err) => {
            console.log(err);
            // alert("s")
          });
      }
    } else {
      notifyError("No Metamask Wallet Detected");
    }
  };

  return (
    <div>
      <GlobalStyles />
      <ToastContainer style={{ marginTop: "60px" }} />
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            <h5 style={{ marginBottom: "32px" }}>
              {!minted
                ? "Mitning Your NFT! Please Wait.."
                : "Successfully Minted NFT"}
            </h5>{" "}
            <div
              style={{
                display: "flex",
                color: "black",
                fontWeight: "bold",
                border: "1px solid grey",
                borderRadius: "4px",
                marginBottom: "20px",

                padding: "8px",
                justifyContent: "space-between",
                // background: "red",

                alignItems: "center",
                width: "100%",
              }}
            >
              <div>1. Minting NFT</div>
              {mintingLoader ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Checkmark size="20px" style={{ marginLeft: "0px" }} />
              )}
            </div>
            <div
              style={{
                display: "flex",
                color: "black",
                fontWeight: "bold",
                border: "1px solid grey",
                borderRadius: "4px",

                padding: "8px",
                justifyContent: "space-between",
                marginBottom: "20px",
                // background: "red",

                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ displau: "flex", flexDirection: "column" }}>
                <div>2. Approving NFT</div>
                <div style={{ fontWeight: "normal", fontSize: "12px" }}>
                  Note: This is a one time fee
                </div>
              </div>

              {approveLoader ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <Checkmark size="20px" style={{ marginLeft: "0px" }} />
              )}
            </div>
            {onSale ? (
              <div
                style={{
                  display: "flex",
                  color: "black",
                  fontWeight: "bold",
                  border: "1px solid grey",
                  borderRadius: "4px",

                  padding: "8px",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  // background: "red",

                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div>3. Listing On Sale</div>
                {listingLoader ? (
                  <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <Checkmark size="20px" style={{ marginLeft: "0px" }} />
                )}
              </div>
            ) : (
              ""
            )}
            {minted ? (
              <div style={{ color: "black" }}>
                <a
                  href={`/0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f/${tokenId}`}
                >
                  Click Here to view your NFT
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Modal>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {" "}
          <section className="container mt-5">
            <div className="row">
              <div className="col-lg-7 offset-lg-1 mb-5">
                <div className="field-set">
                  <h5>Upload file</h5>

                  <div className="d-create-file">
                    <p id="file_name">
                      {file
                        ? file.name +
                          " - " +
                          Number(file.size / 1000000, 2).toFixed(2) +
                          " MB"
                        : "PNG, JPG, GIF, WEBP or MP4. Max 100mb."}
                    </p>

                    <div className="browse">
                      <label className="btn-main">
                        <input
                          type="file"
                          name="myImage"
                          id="inputGroupFile01"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            setPreviewUrl(
                              URL.createObjectURL(e.target.files[0])
                            );
                            setFile(e.target.files[0]);
                          }}
                        />
                        Upload Image
                      </label>
                    </div>
                  </div>

                  <div className="spacer-single"></div>

                  <h5>Select method</h5>
                  <div className="de_tab tab_methods">
                    <ul className="de_nav">
                      <li id="btn1" className="active" onClick={handleShow}>
                        <span>
                          <i className="fa fa-tag"></i>Fixed price
                        </span>
                      </li>
                      <li id="btn2" onClick={handleShow1}>
                        <span>
                          <i className="fa fa-hourglass-1"></i>Timed auction
                        </span>
                      </li>
                      <li id="btn3" onClick={handleShow2}>
                        <span>
                          <i className="fa fa-users"></i>Open for bids
                        </span>
                      </li>
                    </ul>

                    <div className="de_tab_content pt-3">
                      <div id="tab_opt_1">
                        <h5>Price</h5>
                        <input
                          type="number"
                          name="item_price"
                          id="item_price"
                          className="form-control"
                          placeholder="enter price (MATIC)"
                          onChange={(e) => setIntialPrice(e.target.value)}
                        />
                      </div>

                      <div id="tab_opt_2" className="hide">
                        <h5>Minimum bid</h5>
                        <input
                          type="text"
                          name="item_price_bid"
                          id="item_price_bid"
                          className="form-control"
                          placeholder="enter minimum bid"
                        />

                        <div className="spacer-20"></div>

                        <div className="row">
                          <div className="col-md-6">
                            <h5>Starting date</h5>
                            <input
                              type="date"
                              name="bid_starting_date"
                              id="bid_starting_date"
                              className="form-control"
                              min="1997-01-01"
                            />
                          </div>
                          <div className="col-md-6">
                            <h5>Expiration date</h5>
                            <input
                              type="date"
                              name="bid_expiration_date"
                              id="bid_expiration_date"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div id="tab_opt_3"></div>
                    </div>
                  </div>

                  <div className="spacer-20"></div>

                  <div className="switch-with-title">
                    <h5>
                      <i className="fa fa- fa-unlock-alt id-color-2 mr10"></i>
                      Instant Sale
                    </h5>
                    <div className="de-switch">
                      <input
                        type="checkbox"
                        id="switch-unlock"
                        className="checkbox"
                      />
                      {instantSale ? (
                        <label
                          htmlFor="switch-unlock"
                          onClick={unlockHide}
                        ></label>
                      ) : (
                        <label
                          htmlFor="switch-unlock"
                          onClick={unlockClick}
                        ></label>
                      )}
                    </div>
                    <div className="clearfix"></div>
                    <p className="p-info pb-3">
                      Will be sold directly on a fixed price without owner
                      acceptance (Only available on fixed price sale).
                    </p>
                  </div>

                  <div className="switch-with-title">
                    <h5>
                      <i className="fa fa- fa-unlock-alt id-color-2 mr10"></i>
                      Put on Sale
                    </h5>
                    <div className="de-switch">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        // value={true}
                        onChange={() => {
                          console.log(onSale);
                          setOnSale(!onSale);
                        }}
                      />
                    </div>
                    <div className="clearfix"></div>
                    <p className="p-info pb-3">
                      Will be sold directly on a fixed price without owner
                      acceptance (Only available on fixed price sale).
                    </p>
                  </div>

                  <h5>
                    Title <span style={{ color: "red" }}>*</span>{" "}
                  </h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder="e.g. 'Crypto Funk"
                    onChange={(e) => setNftName(e.target.value)}
                  />
                  <h5 style={{ marginTop: "32px" }}>
                    Nft Type <span style={{ color: "red" }}>*</span>
                  </h5>
                  <select
                    className=""
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #CCCCCC",
                      borderRadius: "6px",
                      marginBottom: "32px",
                      color: "black",
                    }}
                    onChange={(e) => setNftType(e.target.value)}
                  >
                    <option>Select</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                  </select>

                  <div className="spacer-10"></div>

                  <h5>
                    Description <span style={{ color: "red" }}>*</span>
                  </h5>
                  <textarea
                    data-autoresize
                    name="item_desc"
                    id="item_desc"
                    className="form-control"
                    placeholder="e.g. 'This is very limited item'"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>

                  {/* <div className="spacer-10"></div> */}

                  {/* <h5>Price</h5>
                <input
                  type="text"
                  name="item_price"
                  id="item_price"
                  className="form-control"
                  placeholder="enter price for one item (ETH)"
                /> */}

                  <div className="spacer-10"></div>

                  <h5>Royalties</h5>
                  <input
                    type="number"
                    name="item_royalties"
                    id="item_royalties"
                    className="form-control"
                    placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 50%"
                    onChange={(e) => setRoyalty(e.target.value)}
                  />

                  <div className="spacer-10"></div>

                  <button className="btn-main" onClick={() => createNft()}>
                    Mint Nft
                  </button>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-xs-12">
                <h5>Preview item</h5>
                <div className="nft__item m-0">
                  <div className="de_countdown">
                    <Clock deadline="December, 30, 2021" />
                  </div>
                  <div className="author_list_pp">
                    <span>
                      <img
                        className="lazy"
                        src={userData.profile_image}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </span>
                  </div>
                  <div className="nft__item_wrap">
                    <span>
                      <img
                        src={
                          file
                            ? previewUrl
                            : "../img/collections/coll-item-3.jpg"
                        }
                        id="get_file_2"
                        className="lazy nft__item_preview"
                        alt=""
                      />
                    </span>
                  </div>
                  <div className="nft__item_info">
                    <span>
                      <h4>{nftName ? nftName : "Your Title"}</h4>
                    </span>
                    <div>
                      {description
                        ? description.length > 55
                          ? description.substring(0, 55) + "..."
                          : description
                        : "This is a description. Hellooo world! welcome to my NFT..."}
                    </div>
                    <div className="nft__item_price" style={{ color: "black" }}>
                      {initialPrice ? initialPrice : 0.01} MATIC
                    </div>
                    <div className="nft__item_action">
                      <span>Place a bid</span>
                    </div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
}
