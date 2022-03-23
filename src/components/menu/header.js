import React, { useEffect, useState } from "react";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
import { header } from "react-bootstrap";
import { Link } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
// import { getChain, useMoralis } from "react-moralis";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../../actions";
import wallet from "../pages/wallet";
import { newLogo } from "./New-B.svg";
setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);

const Header = function () {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [warning, setWarning] = useState(false);

  const dispatch = useDispatch();

  const walletAddress = useSelector((state) => state.setAddress);

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

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    let chainId;
    const getChainId = async () => {
      if (typeof window.ethereum !== "undefined") {
        chainId = await web3.eth.net.getId();
      }
      return chainId;
    };

    getChainId().then((res) => {
      console.log(chainId);
      if (chainId !== 80001) {
        notify("You are on the Wrong Network!");
        dispatch(setAddress(""));
        localStorage.clear();
      }
    });

    if (
      localStorage.getItem("wallet_address") &&
      localStorage.getItem("signature")
    ) {
      if (!window.ethereum) {
        dispatch(setAddress(""));
        localStorage.clear();
        return;
      }

      const accountWasChanged = (accounts) => {
        dispatch(setAddress(""));
        localStorage.clear();
        window.location.reload();
        console.log("accountWasChanged");
        return;
      };
      const getAndSetAccount = async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        //usecheck user method

        dispatch(setAddress(accounts[0]));
        console.log("getAndSetAccount");
        return;
      };
      const clearAccount = () => {
        dispatch(setAddress(""));
        localStorage.clear();
        console.log("clearAccount");
        return;
      };

      window.ethereum.on("accountsChanged", accountWasChanged);

      window.ethereum.on("disconnect", clearAccount);
      getAndSetAccount();
    } else {
      dispatch(setAddress(""));
      localStorage.clear();
    }
  }, []);

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };
  const closeMenu3 = () => {
    setOpenMenu3(false);
  };
  const ref = useOnclickOutside(() => {
    closeMenu();
  });
  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });
  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });

  const [showmenu, btn_icon] = useState(false);
  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  return (
    <>
      {warning ? (
        <div
          className=""
          role="alert"
          style={{
            color: "white",
            background: "red",
            height: "18px",
            width: "100vw",
            fontSize: "14px",
          }}
        >
          <center>
            You are on the wrong Network! Kindly Switch to binance Testnet.
          </center>
        </div>
      ) : (
        ""
      )}

      <header id="myHeader" className="navbar white">
        <div className="container">
          <div className="row w-100-nav">
            <div className="logo px-0">
              <div className="navbar-title navbar-item">
                <a href="/">
                  <img
                    src="https://uploads-ssl.webflow.com/623224a9ec91247e62aa9827/6232328f941c7b5ef3cf82be_New-B-A.svg"
                    alt=""
                    style={{ width: "140px" }}
                  />
                </a>
              </div>
            </div>

            <div className="search">
              <input
                id="quick_search"
                className="xs-hide"
                name="quick_search"
                placeholder="search item here..."
                type="text"
              />
            </div>

            <BreakpointProvider>
              <Breakpoint l down>
                {showmenu && (
                  <div className="menu">
                    <div className="navbar-item">
                      <div ref={ref}>
                        <NavLink to="/" onClick={() => btn_icon(!showmenu)}>
                          Home
                        </NavLink>
                        {/* {openMenu && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu}>
                              <NavLink to=" " onClick={()=> window.open("http://gigaland.grey.on3-step.com", "_self")}>New Grey Scheme</NavLink>
                              <NavLink to=" " onClick={()=> window.open("http://gigaland.retro.on3-step.com", "_self")}>New Retro Scheme</NavLink>
                              <NavLink to="/" onClick={() => btn_icon(!showmenu)}>Homepage</NavLink>
                              <NavLink to="/home1" onClick={() => btn_icon(!showmenu)}>Homepage 1</NavLink>
                              <NavLink to="/home2" onClick={() => btn_icon(!showmenu)}>Homepage 2</NavLink>
                              <NavLink to="/home3" onClick={() => btn_icon(!showmenu)}>Homepage 3</NavLink>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="navbar-item">
                      <div ref={ref1}>
                        <div
                          className="dropdown-custom dropdown-toggle btn"
                          onClick={handleBtnClick1}
                        >
                          Explore
                        </div>
                        {openMenu1 && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu1}>
                              <NavLink
                                to="/explore"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Explore
                              </NavLink>
                              <NavLink
                                to="/explore2"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Explore 2
                              </NavLink>
                              <NavLink
                                to="/rangking"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Rangking
                              </NavLink>
                              <NavLink
                                to="/colection"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Collection
                              </NavLink>
                              <NavLink
                                to="/ItemDetail"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Items Details
                              </NavLink>
                              <NavLink
                                to="/Auction"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Live Auction
                              </NavLink>
                              <NavLink
                                to="/helpcenter"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Help Center
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="navbar-item">
                      <div ref={ref2}>
                        <div
                          className="dropdown-custom dropdown-toggle btn"
                          onClick={handleBtnClick2}
                        >
                          Pages
                        </div>
                        {openMenu2 && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu2}>
                              <NavLink
                                to="/Author"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Author
                              </NavLink>
                              <NavLink
                                to="/wallet"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Wallet
                              </NavLink>
                              <NavLink
                                to="/create"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Create
                              </NavLink>
                              <NavLink
                                to="/create2"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Create 2
                              </NavLink>
                              <NavLink
                                to="/createOptions"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Create options
                              </NavLink>
                              <NavLink
                                to="/news"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                News
                              </NavLink>
                              <NavLink
                                to="/works"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Gallery
                              </NavLink>
                              <NavLink
                                to="/login"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                login
                              </NavLink>
                              <NavLink
                                to="/loginTwo"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                login 2
                              </NavLink>
                              <NavLink
                                to="/register"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Register
                              </NavLink>
                              <NavLink
                                to="/contact"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Contact Us
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="navbar-item">
                      <NavLink
                        to="/activity"
                        onClick={() => btn_icon(!showmenu)}
                      >
                        Activity
                      </NavLink>
                    </div>
                    <div className="navbar-item">
                      <NavLink
                        to={
                          walletAddress ? `/create/${walletAddress}` : "/wallet"
                        }
                      >
                        Create
                        <span className="lines"></span>
                      </NavLink>
                    </div>
                  </div>
                )}
              </Breakpoint>

              <Breakpoint xl>
                <div className="menu">
                  <div className="navbar-item">
                    <NavLink to="/">
                      Home
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <div ref={ref1}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleBtnClick1}
                        onMouseLeave={closeMenu1}
                      >
                        Explore
                        <span className="lines"></span>
                        {openMenu1 && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu1}>
                              <NavLink to="/explore">Explore</NavLink>
                              <NavLink to="/explore2">Explore 2</NavLink>
                              <NavLink to="/rangking">Rangking</NavLink>
                              <NavLink to="/colection">Collection</NavLink>
                              <NavLink to="/ItemDetail">Items Details</NavLink>
                              <NavLink to="/Auction">Live Auction</NavLink>
                              <NavLink to="/helpcenter">Help Center</NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="navbar-item">
                    <div ref={ref2}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleBtnClick2}
                        onMouseLeave={closeMenu2}
                      >
                        Pages
                        <span className="lines"></span>
                        {openMenu2 && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu2}>
                              <NavLink to="/Author">Author</NavLink>
                              <NavLink to="/wallet">Wallet</NavLink>
                              <NavLink to="/create">Create</NavLink>
                              <NavLink to="/create2">Create 2</NavLink>
                              <NavLink to="/createOptions">
                                Create Option
                              </NavLink>
                              <NavLink to="/news">News</NavLink>
                              <NavLink to="/works">Gallery</NavLink>
                              <NavLink to="/login">login</NavLink>
                              <NavLink to="/loginTwo">login 2</NavLink>
                              <NavLink to="/register">Register</NavLink>
                              <NavLink to="/contact">Contact Us</NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="navbar-item">
                    <NavLink to="/activity">
                      Activity
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <NavLink
                      to={
                        walletAddress ? `/create/${walletAddress}` : "/wallet"
                      }
                    >
                      create
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                </div>
              </Breakpoint>
            </BreakpointProvider>

            <div className="mainside">
              <a
                href={
                  walletAddress !== "" ? "/profile/" + walletAddress : "/wallet"
                }
                className="btn-main"
              >
                {walletAddress !== ""
                  ? walletAddress?.slice(0, 3) +
                    "..." +
                    walletAddress?.slice(
                      walletAddress.length - 3,
                      walletAddress.length
                    )
                  : "Connect wallet"}
              </a>
            </div>
          </div>

          <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
            <div className="menu-line white"></div>
            <div className="menu-line1 white"></div>
            <div className="menu-line2 white"></div>
          </button>
        </div>
      </header>
    </>
  );
};
export default Header;
