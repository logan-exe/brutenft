import React, { useEffect, useState } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";
import "../../assets/custom.css";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import { Modal } from "react-bootstrap";
import { contractAbi } from "../../utils/contractAbi";
import { Table } from "react-bootstrap";
import Web3 from "web3";
import {
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  PinterestIcon,
  RedditIcon,
  RedditShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  TelegramIcon,
  WhatsappIcon,
  TumblrShareButton,
  TumblrIcon,
} from "react-share";
import { navigate } from "@reach/router";
import { tradeAbi } from "../../utils/tradeAbi";

const socialStyle = {
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  borderRadius: 3,
  border: 0,
  color: "white",
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
};

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
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

const Colection = function () {
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [nftInfo, setNftInfo] = useState();
  const [nftImageLoader, setNftImageLoader] = useState(true);
  const [bids, setBids] = useState();
  const [history, setHistory] = useState();
  const [isOwner, setIsOwner] = useState();
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(2);
  const [shareModal, setShareModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState();
  const [transferLoading, setTransferLoading] = useState(false);
  const [displayMore, setDisplayMore] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [startSaleModal, setStartSaleModal] = useState(false);
  const [startSaleLoading, setStartSaleLoading] = useState(false);
  const [instantSale, setInstantSale] = useState();
  const [initialPrice, setInitialPrice] = useState();

  const unlockClick = () => {
    setInstantSale(true);
  };
  const unlockHide = () => {
    setInstantSale(false);
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

  const walletAddress = useSelector((state) => state.setAddress);
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      if (window.ethereum && localStorage.getItem("wallet_address")) {
        const accounts = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .catch((err) => {
            localStorage.clear();
          });
        return accounts[0];
      } else {
        return "";
      }
    };

    axios({
      method: "POST",
      url: baseURL + "/get_nft_info",
      data: {
        tokenId:
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ],
      },
    })
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.nftInfo, "nftInfo");
          setNftInfo(res.data.nftInfo[0]);
          axios({
            method: "POST",
            url: baseURL + "/get_nft_activity",
            data: {
              tokenId: res.data.nftInfo[0]._id,
            },
          })
            .then(async (response) => {
              if (response.data.message === "success") {
                const bids = await response.data.nftActivity.filter(
                  (nft) => nft.tx_type === "Bid"
                );
                const history = await response.data.nftActivity.filter(
                  (nft) => nft.tx_type !== "Bid"
                );

                console.log(history, "this is history");

                setBids(bids);
                setHistory(history);
                const loggedInUser = await getCurrentUser();
                if (
                  loggedInUser === res.data.nftInfo[0].owned_by.wallet_address
                ) {
                  console.log("here setting owner");
                  setIsOwner(true);
                }
                if (loggedInUser !== "") {
                  const checkLike = res.data.nftInfo[0].likes.filter(
                    (e) => e.liked_user.wallet_address === loggedInUser
                  );
                  console.log(checkLike, "this is the array");
                  if (checkLike.length !== 0) {
                    setIsUserLiked(true);
                  }
                }
                setLikesCount(res.data.nftInfo[0].likes.length);
                setLoading(false);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likeNft = async () => {
    if (walletAddress === "") {
      notifyError("Connect Wallet to perform action");
      return;
    }
    if (isUserLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }

    setIsUserLiked(!isUserLiked);

    axios({
      method: "POST",
      url: baseURL + "/add_token_like",
      data: {
        walletAddress: walletAddress,
        tokenId: nftInfo.token_id,
        like: !isUserLiked,
      },
    })
      .then((res) => {
        console.log(res.data, "after response");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const purchaseNft = async () => {
    if (purchaseLoading) {
      notifyError("Transaction under process!");
      return;
    }
    setPurchaseLoading(true);
    if (window.ethereum && walletAddress) {
      const web3 = new Web3(window.ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1",
        tradeAbi,
        signer
      );

      const actualPrice = await contract.listings(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        nftInfo.token_id
      );

      const weiValue = web3.utils.toWei(
        ethers.utils.formatEther(actualPrice.price._hex)
      );

      const purchased = await contract.purchase(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        nftInfo.token_id,
        { value: weiValue }
      );

      const purchasedTx = await purchased.wait();

      console.log(purchasedTx, "this is purchased TX");

      axios({
        method: "POST",
        url: baseURL + "/purchase_nft",
        data: {
          from: purchasedTx.from,
          to: walletAddress,
          tokenObjectId: nftInfo._id,
          tokenId: nftInfo.token_id,
          txHash: purchasedTx.transactionHash,
          amount: ethers.utils.formatEther(actualPrice.price._hex),
          contractAddress: "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        },
      }).then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          alert("Token Transfered Successfully!");
          window.location.reload();
        }
      });
    }
  };

  const TransferNft = async () => {
    if (transferLoading) {
      notifyError("Transaction under process!");
      return;
    }

    setTransferLoading(true);
    if (window.ethereum && walletAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        contractAbi,
        signer
      );

      const createNft = await contract.transferFrom(
        walletAddress,
        transferAddress,
        nftInfo.token_id
      );

      const tx = await createNft.wait();

      axios({
        method: "POST",
        url: baseURL + "/transfer_nft",
        data: {
          from: tx.from,
          to: transferAddress,
          tokenObjectId: nftInfo._id,
          tokenId: nftInfo.token_id,
          txHash: tx.transactionHash,
          contractAddress: "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        },
      }).then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          alert("Token Transfered Successfully!");
          window.location.reload();
        }
      });
    } else {
      alert("Some error occurred in mintNFT");
      setTransferModal(false);
    }
  };

  const startSale = async () => {
    if (startSaleLoading) {
      notifyError("Transaction under process!");
      return;
    }

    setStartSaleLoading(true);
    if (window.ethereum && walletAddress) {
      const web3 = new Web3(window.ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const tradeContract = new ethers.Contract(
        "0x49c0e6764BbbD3564bc2070238b35115E00d9ff1",
        tradeAbi,
        signer
      );

      const tokenContract = new ethers.Contract(
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        contractAbi,
        signer
      );

      const checkApproved = await tokenContract.isApprovedForAll(
        nftInfo.owned_by.wallet_address,
        "0x49c0e6764bbbd3564bc2070238b35115e00d9ff1"
      );
      console.log(checkApproved, "check approved");

      if (!checkApproved) {
        const approve = await tokenContract.setApprovalForAll(
          "0x49c0e6764bbbd3564bc2070238b35115e00d9ff1",
          true
        );
      }

      const weiValue = web3.utils.toWei(initialPrice);

      const listing = await tradeContract.addListing(
        weiValue,
        "0x5c1f1dDDDBde175CB668DcFFEa1F452273fd918f",
        nftInfo.token_id
      );

      const listingTx = await listing.wait();

      axios({
        method: "POST",
        url: baseURL + "/start_sale",
        data: {
          tokenId: nftInfo.token_id,
          onSale: true,
          instantSale: instantSale,
          initialPrice: initialPrice,
        },
      })
        .then((res) => {
          if (res.data.message === "success") {
            alert("Listed on sale successfully");
            window.location.reload();
          }
        })
        .catch((err) => {
          alert("some error occurred");
          window.location.reload();
        });
    }

    //checkapproved or approve.

    //addlisting
  };

  return (
    <div>
      <GlobalStyles />
      <ToastContainer />

      {loading ? (
        <center style={{ height: "200px", marginTop: "200px" }}>
          {" "}
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </center>
      ) : (
        <>
          <section className="container">
            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={shareModal}
              onHide={() => setShareModal(false)}
            >
              <Modal.Header>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h5>Share</h5>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setShareModal(false)}
                  >
                    <i className="fa fa-close"></i>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <center className="share-modal-body">
                  <FacebookShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  <LinkedinShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>
                  <TwitterShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <EmailIcon size={32} round={true} />
                  </EmailShareButton>
                  <TelegramShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <TelegramIcon size={32} round={true} />
                  </TelegramShareButton>
                  <WhatsappShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>
                  <RedditShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <RedditIcon size={32} round={true} />
                  </RedditShareButton>
                  <PinterestShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <PinterestIcon size={32} round={true} />
                  </PinterestShareButton>
                  <TumblrShareButton
                    url={window.location.href}
                    openShareDialogOnClick={true}
                    style={{ borderRadius: "20px" }}
                  >
                    <TumblrIcon size={32} round={true} />
                  </TumblrShareButton>
                  {/* <ImageUpload /> */}
                </center>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "32px",
                  }}
                >
                  <input
                    type="text"
                    value={window.location.href}
                    style={{ width: "80%", padding: "6px" }}
                  />
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      notifySuccess("Link coppied successfully");
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="copy-button"
                  >
                    Copy
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={transferModal}
              onHide={() => setTransferModal(false)}
            >
              <Modal.Header>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h5>Transfer NFT</h5>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setTransferModal(false)}
                  >
                    <i className="fa fa-close"></i>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="text"
                  placeholder="Enter Transfer Address"
                  style={{ width: "100%", padding: "8px" }}
                  onChange={(e) => setTransferAddress(e.target.value)}
                />
                <button
                  className="btn-main"
                  style={{ width: "100%", marginTop: "40px" }}
                  onClick={() => TransferNft()}
                >
                  {transferLoading ? "Loading.. Please wait" : "Transfer"}
                </button>
              </Modal.Body>
            </Modal>

            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={purchaseModal}
              // onHide={() => setPurchaseModal(false)}
            >
              <Modal.Header>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h5>Purchase</h5>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setPurchaseModal(false)}
                  >
                    <i className="fa fa-close"></i>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h6>Token Info</h6>
                    <div>
                      {nftInfo.title +
                        " - owner @" +
                        nftInfo.created_by.user_name}
                    </div>
                  </div>
                  <div>
                    <h6>Price</h6>
                    <div>{nftInfo.initial_price + " MATIC"}</div>
                  </div>
                </div>

                <button
                  className="btn-main"
                  style={{ width: "100%", marginTop: "40px" }}
                  onClick={() => purchaseNft()}
                >
                  {purchaseLoading ? "Loading.. Please wait" : "Purchase"}
                </button>
              </Modal.Body>
            </Modal>

            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={startSaleModal}
              // onHide={() => setPurchaseModal(false)}
            >
              <Modal.Header>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h5>Start Sale</h5>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setStartSaleModal(false)}
                  >
                    <i className="fa fa-close"></i>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <h6 className="mt-4">Enter Selling Price:</h6>
                <input
                  type="number"
                  style={{ width: "100%", padding: "6px" }}
                  onChange={(e) => setInitialPrice(e.target.value)}
                />
                <div className="switch-with-title mt-4">
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
                    NFT be sold directly on a fixed price without owner
                    acceptance if on sale.
                  </p>
                </div>
                <button
                  className="btn-main"
                  style={{ width: "100%", marginTop: "40px" }}
                  onClick={() => startSale()}
                >
                  {startSaleLoading ? "Loading.. Please wait" : "Start Sale"}
                </button>
              </Modal.Body>
            </Modal>

            <div className="row mt-md-5 pt-md-4">
              <div className="col-md-6 text-center ">
                <div
                  style={{
                    width: "96%",
                    border: "1px solid #e2e2e2",
                    padding: "16px",
                    borderRadius: "16px",
                    height: "65vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={nftInfo?.image_url}
                    className="img-fluid img-rounded mb-sm-30"
                    alt=""
                    style={{ maxHeight: "90%" }}
                    onLoad={() => setNftImageLoader(false)}
                  />
                  {nftImageLoader ? (
                    ""
                  ) : nftInfo.on_sale ? (
                    <div className="price-tag-wrapper">
                      <p className="card-price-1">
                        {nftInfo.initial_price + " "}MATIC
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {nftImageLoader ? <>Loading..</> : ""}
                </div>
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  {nftInfo.on_auction ? (
                    <>
                      {" "}
                      Auctions ends in
                      <div className="de_countdown">
                        <Clock deadline="December, 30, 2021" />
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2>{nftInfo.title} </h2>
                    {nftInfo.on_sale ? (
                      ""
                    ) : (
                      <>
                        <div className="icons-wrapper">
                          <div
                            className="icons-container r"
                            onClick={() =>
                              window.open(
                                `https://mumbai.polygonscan.com/tx/${nftInfo.tx_hash}`
                              )
                            }
                          >
                            <div className="icon w-embed">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.24921 4.5H10.7486C11.1628 4.5 11.4986 4.83579 11.4986 5.25C11.4986 5.6297 11.2164 5.94349 10.8504 5.99315L10.7486 6H7.24885C6.06991 5.99944 5.10261 6.90639 5.00697 8.06095L4.9994 8.21986L5.00223 16.7505C5.00255 17.9414 5.92797 18.9159 7.09878 18.9948L7.25283 18.9999L15.7509 18.9882C16.9406 18.9866 17.9136 18.0618 17.9926 16.8921L17.9978 16.7382V13.2319C17.9978 12.8177 18.3336 12.4819 18.7478 12.4819C19.1275 12.4819 19.4413 12.7641 19.491 13.1302L19.4978 13.2319V16.7382C19.4978 18.7405 17.9284 20.3767 15.9519 20.4828L15.753 20.4882L7.25739 20.4999L7.05406 20.4948C5.1415 20.3952 3.60807 18.8626 3.50749 16.95L3.50223 16.7509L3.5 8.25253L3.50441 8.05003C3.6045 6.13732 5.13778 4.60432 7.05008 4.50511L7.24921 4.5H10.7486H7.24921ZM14.0028 3L20.0534 3.00146L20.1529 3.01152L20.2346 3.02756L20.3422 3.05991L20.4607 3.11196L20.5136 3.14222C20.7732 3.29719 20.9561 3.56642 20.9936 3.88033L21.0007 4V10.007C21.0007 10.5593 20.5529 11.007 20.0007 11.007C19.4878 11.007 19.0652 10.621 19.0074 10.1236L19.0007 10.007L19 6.413L12.7062 12.7071C12.3458 13.0676 11.7785 13.0953 11.3862 12.7903L11.292 12.7071C10.9315 12.3466 10.9038 11.7794 11.2088 11.3871L11.292 11.2929L17.584 5H14.0028C13.4899 5 13.0672 4.61396 13.0095 4.11662L13.0028 4C13.0028 3.44772 13.4505 3 14.0028 3Z"
                                  fill="#727272"
                                ></path>
                              </svg>
                            </div>
                          </div>

                          <div
                            className="icons-container r"
                            onClick={() => setShareModal(!shareModal)}
                          >
                            <div className="icon w-embed">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.0002 3.00195C18.656 3.00195 19.9983 4.34424 19.9983 6.00003C19.9983 7.65582 18.656 8.9981 17.0002 8.9981C16.158 8.9981 15.3969 8.65085 14.8523 8.09171L9.39523 11.2113C9.46358 11.4626 9.50005 11.7271 9.50005 12C9.50005 12.273 9.46358 12.5374 9.39523 12.7887L14.8531 15.9076C15.3976 15.3489 16.1584 15.002 17.0002 15.002C18.656 15.002 19.9983 16.3442 19.9983 18C19.9983 19.6558 18.656 20.9981 17.0002 20.9981C15.3444 20.9981 14.0021 19.6558 14.0021 18C14.0021 17.7271 14.0386 17.4626 14.107 17.2113L8.64985 14.0917C8.10525 14.6508 7.34417 14.9981 6.50198 14.9981C4.84619 14.9981 3.50391 13.6558 3.50391 12C3.50391 10.3442 4.84619 9.00195 6.50198 9.00195C7.34379 9.00195 8.10457 9.3489 8.64912 9.9076L14.107 6.78874C14.0386 6.53743 14.0021 6.27299 14.0021 6.00003C14.0021 4.34424 15.3444 3.00195 17.0002 3.00195Z"
                                  fill="#727272"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div
                            className="icons-container"
                            onClick={() => {
                              // alert("hello");
                              setDisplayMore(!displayMore);
                            }}
                            style={{
                              backgroundColor: `${
                                displayMore ? "#8364e21a" : ""
                              }`,
                            }}
                          >
                            <div className="icon w-embed">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12ZM18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z"
                                  fill="#727272"
                                ></path>
                              </svg>
                            </div>
                            <div
                              className="more-wrapper"
                              style={{
                                display: `${displayMore ? "block" : "none"}`,
                              }}
                            >
                              <div
                                className="more-item"
                                onClick={() => window.open(nftInfo.image_ipfs)}
                              >
                                <div className="more-item-icon-container">
                                  <div className="more-item-icon w-embed">
                                    <i className="fa fa-cube"></i>
                                  </div>
                                </div>
                                <div className="more-tet">View on IPFS</div>
                              </div>
                              <div className="more-item">
                                <div className="more-item-icon-container">
                                  <div className="more-item-icon w-embed">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2ZM13.5 9.5H6.5L6.41012 9.50806C6.17688 9.55039 6 9.75454 6 10C6 10.2761 6.22386 10.5 6.5 10.5H13.5L13.5899 10.4919C13.8231 10.4496 14 10.2455 14 10C14 9.72386 13.7761 9.5 13.5 9.5Z"
                                        fill="#727272"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="more-tet">Block</div>
                              </div>
                              <div className="more-item">
                                <div className="more-item-icon-container">
                                  <div className="more-item-icon w-embed">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.5 13H15.5C15.8993 13 16.1375 12.5549 15.916 12.2226L13.1009 8L15.916 3.77735C16.1375 3.44507 15.8993 3 15.5 3H4C3.72386 3 3.5 3.22386 3.5 3.5V17.5C3.5 17.7761 3.72386 18 4 18C4.27614 18 4.5 17.7761 4.5 17.5V13Z"
                                        fill="#727272"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="more-tet">Report</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="item_info_counts">
                    <div className="item_info_type">
                      <i className="fa fa-music"></i>
                      {nftInfo.nft_type ? nftInfo.nft_type : "Art"}
                    </div>

                    <div className="item_info_like">
                      <i
                        className="fa fa-heart"
                        style={{
                          color: `${isUserLiked ? "red" : "lightgrey"}`,
                          cursor: "pointer",
                        }}
                        onClick={() => likeNft()}
                      ></i>
                      {likesCount > 1000 ? likesCount / 1000 + "k" : likesCount}
                    </div>
                    {/* <div
                      className="item_info_like"
                      onClick={() => setShareModal(!shareModal)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa fa-share-alt fa-sm"></i>
                      Share
                    </div> */}
                  </div>
                  <p>{nftInfo.description}</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      width: "60%",
                    }}
                  >
                    <div className="owner_display_">
                      {/* <h6>Creator</h6> */}
                      <h5>Creator</h5>
                      <div
                        className="item_author"
                        style={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <div
                          className="author_list_pp"
                          style={{ marginLeft: "0px" }}
                        >
                          <span
                            onClick={() =>
                              navigate(
                                `/profile/${nftInfo.created_by.wallet_address}`
                              )
                            }
                          >
                            <img
                              className="lazy"
                              src={nftInfo.created_by.profile_image}
                              alt=""
                            />

                            <i className="fa fa-check"></i>
                          </span>
                        </div>
                        <div
                          className="author_list_info"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "0px",
                          }}
                        >
                          <span>
                            {nftInfo.created_by.user_name !== ""
                              ? nftInfo.created_by.user_name
                              : "unnamed"}
                          </span>

                          <span style={{ color: "grey", fontSize: "12px" }}>
                            @
                            {nftInfo.created_by?.wallet_address.slice(0, 6) +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5>Owner</h5>
                      <div
                        className="item_author"
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div
                          className="author_list_pp"
                          style={{ marginLeft: "0px" }}
                        >
                          <span
                            onClick={() =>
                              navigate(
                                `/profile/${nftInfo.owned_by.wallet_address}`
                              )
                            }
                          >
                            <img
                              className="lazy"
                              src={nftInfo.owned_by.profile_image}
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </span>
                        </div>
                        <div
                          className="author_list_info"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span>{nftInfo.owned_by.user_name}</span>

                          <span style={{ color: "grey", fontSize: "12px" }}>
                            @
                            {nftInfo.owned_by.wallet_address.slice(0, 6) +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",

                      marginTop: "20px",
                    }}
                    className="nft-buttons"
                  >
                    {isOwner ? (
                      nftInfo.on_sale ? (
                        <button
                          className="nft-btn-1"
                          style={{ marginRight: "16px" }}
                        >
                          Stop Sale
                        </button>
                      ) : (
                        <button
                          className="nft-btn-1"
                          style={{ marginRight: "16px" }}
                          onClick={() => setStartSaleModal(true)}
                        >
                          Start Sale
                        </button>
                      )
                    ) : (
                      <button
                        className="nft-btn-1"
                        style={{ marginRight: "16px" }}
                      >
                        Make Offer
                      </button>
                    )}

                    {!isOwner && nftInfo.on_sale && nftInfo.instant_sale ? (
                      <button
                        className="nft-btn-1"
                        style={{ marginRight: "16px" }}
                        onClick={() => setPurchaseModal(true)}
                      >
                        Purchase
                      </button>
                    ) : (
                      ""
                    )}

                    {nftInfo.on_auction ? (
                      isOwner ? (
                        <button
                          className="nft-btn-1"
                          style={{ marginRight: "16px" }}
                        >
                          Stop Auction
                        </button>
                      ) : (
                        <button
                          className="nft-btn-1"
                          style={{ marginRight: "16px" }}
                        >
                          Place a bid
                        </button>
                      )
                    ) : isOwner ? (
                      <button
                        className="nft-btn-1"
                        style={{ marginRight: "16px" }}
                      >
                        Start Auction
                      </button>
                    ) : (
                      ""
                    )}

                    {isOwner ? (
                      <button
                        className="nft-btn-3"
                        onClick={() => setTransferModal(true)}
                      >
                        Transfer
                      </button>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="spacer-40"></div>
                  <div className="de_tab">
                    <ul className="de_nav" style={{ display: "flex" }}>
                      <div
                        style={{
                          // width: "48px",
                          paddingLeft: "16px",
                          paddingRight: "16px",

                          paddingBottom: "6px",
                          marginRight: "8px",
                          cursor: "pointer",
                          borderBottom: `${
                            openMenu ? "2px solid #8364e2" : ""
                          }`,
                          color: `${openMenu ? "#8364e2" : ""}`,
                          display: "flex",
                          justifyContent: "center",
                        }}
                        onClick={handleBtnClick}
                        id="Mainbtn"
                      >
                        History
                      </div>
                      <div
                        id="Mainbtn1"
                        style={{
                          // width: "48px",
                          paddingLeft: "16px",
                          paddingRight: "16px",

                          paddingBottom: "6px",
                          cursor: "pointer",
                          borderBottom: `${
                            openMenu1 ? "2px solid #8364e2" : ""
                          }`,
                          color: `${openMenu1 ? "#8364e2" : ""}`,
                          display: "flex",
                          justifyContent: "center",
                        }}
                        onClick={handleBtnClick1}
                      >
                        Bids
                      </div>
                    </ul>

                    <div className="de_tab_content">
                      {openMenu1 && (
                        <div className="tab-1 onStep fadeIn">
                          {bids.length !== 0 ? (
                            <>
                              {bids.map((bid, index) => {
                                return (
                                  <div className="p_list " key={index}>
                                    <div className="p_list_pp">
                                      <span>
                                        <img
                                          className="lazy"
                                          src={bid.from.profile_image}
                                          alt=""
                                        />
                                        {bid.from.is_verified ? (
                                          <i className="fa fa-check"></i>
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    </div>
                                    <div className="p_list_info">
                                      <b>{bid.amount} MATIC</b>
                                      <span>
                                        by <b>@{bid.user_name}</b> at {bid.date}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <div>No data Found</div>
                          )}
                        </div>
                      )}

                      {openMenu && (
                        <div className="tab-2 onStep fadeIn history-wrapper">
                          <table className="history-table">
                            <thead>
                              <tr>
                                <th>Event</th>
                                <th>Price</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                              </tr>
                            </thead>

                            {history.length !== 0 ? (
                              <tbody>
                                {history.map((nft, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      onClick={() =>
                                        window.open(
                                          `https://mumbai.polygonscan.com/tx/${nft.tx_hash}`
                                        )
                                      }
                                    >
                                      <td>{nft.tx_type}</td>
                                      <td>{nft.price}</td>
                                      <td>
                                        {nft.tx_type === "Minting Token"
                                          ? "NFT Contract"
                                          : nft.from.user_name}
                                      </td>
                                      <td>{nft.to.user_name}</td>
                                      <td>{nft.date.slice(0, 16)}</td>
                                    </tr>

                                    // <div className="p_list">
                                    //   <div className="p_list_pp">
                                    //     <span>
                                    //       <img
                                    //         className="lazy"
                                    //         src={nft.from.profile_image}
                                    //         alt=""
                                    //       />
                                    //       {nft.from.is_verified ? (
                                    //         <i className="fa fa-check"></i>
                                    //       ) : (
                                    //         ""
                                    //       )}
                                    //     </span>
                                    //   </div>
                                    //   <div className="p_list_info">
                                    //     {nft.tx_type}
                                    //     <span>
                                    //       by <b>@{nft.from.user_name}</b> at{" "}
                                    //       {nft.date.slice(0, 15)}
                                    //     </span>
                                    //   </div>
                                    // </div>
                                  );
                                })}
                              </tbody>
                            ) : (
                              ""
                            )}
                          </table>
                        </div>
                      )}
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
};
export default Colection;
