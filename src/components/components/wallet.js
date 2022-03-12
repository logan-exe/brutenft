import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";
// import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderModal from "./LoaderModal";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../../actions";
import { ethers } from "ethers";

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    setLoading(true);
    localStorage.clear();

    window.location.reload();
  };
  const notify = (message) =>
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

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const connectWallet = async () => {
    setModalShow(true);

    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      let chainId = await web3.eth.net.getId();
      if (chainId !== 80001) {
        notify("Wrong Network! Kindly change to Polygon Test Network");
        dispatch(setAddress(""));
        localStorage.clear();
        setLoading(false);
        return;
      } else {
        var accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage("Hello signing message");

        axios({
          method: "POST",
          url: baseURL + "/check_user",
          data: {
            walletAddress: accounts[0],
          },
        }).then(async (res) => {
          if (res.data.message === "blocked") {
            notify("You have been blocked by the team. Kindly Reach Support");
            setModalShow(false);
          } else if (res.data.message === "success") {
            notifySuccess("Successfully logged in");
            localStorage.setItem("wallet_address", accounts[0]);
            localStorage.setItem("profile_image", res.data.profile_image);
            localStorage.setItem("signature", signature);
            dispatch(setAddress(accounts[0]));
          }

          setModalShow(false);
        });

        window.ethereum.on("accountsChanged", function (accounts) {
          // alert("You have change account! Please reconnect wallet!");
          logout();
        });

        // detect Network account change
        window.ethereum.on("networkChanged", async function (networkId) {
          // window.location.reload();
          logout();
        });
      }
    } else {
      notify("No Metamask Wallet Detected");
      setModalShow(false);
    }
    setModalShow(false);
  };
  return (
    <div className="row">
      <ToastContainer />
      {/* <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button> */}

      <LoaderModal show={modalShow} />
      <div
        className="col-lg-3 mb30"
        style={{ cursor: "pointer" }}
        onClick={() => connectWallet()}
      >
        <span className="box-url">
          <span className="box-url-label">Most Popular</span>
          <img src="./img/wallet/1.png" alt="" className="mb20" />
          <h4>Metamask</h4>
          <p>
            Start exploring blockchain applications in seconds. Trusted by over
            1 million users worldwide.
          </p>
        </span>
      </div>
      <div className="col-lg-3 mb30">
        <span className="box-url">
          <span className="box-url-label">Comming Soon</span>
          <img src="./img/wallet/4.png" alt="" className="mb20" />
          <h4>WalletConnect</h4>
          <p>
            Open source protocol for connecting decentralised applications to
            mobile wallets.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <span className="box-url-label">comming Soon</span>
          <img src="./img/wallet/5.png" alt="" className="mb20" />
          <h4>Coinbase Wallet</h4>
          <p>
            The easiest and most secure crypto wallet. ... No Coinbase account
            required.
          </p>
        </span>
      </div>
    </div>
  );
};
export default Wallet;
