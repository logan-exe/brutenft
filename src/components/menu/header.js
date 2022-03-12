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
                  <svg
                    width="140"
                    height="40"
                    viewBox="0 0 209 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.55292 6.60799C11.7279 2.62194 17.397 0.295263 23.1428 0.00590526C25.1093 0.00590526 27.0816 0.0177158 29.0481 0C28.9477 2.10818 29.0481 4.22226 28.989 6.33044C28.7115 11.0428 26.9694 15.6489 24.0345 19.3456C20.2197 24.3179 14.3853 27.6543 8.19069 28.5165C5.48608 28.9535 2.74013 28.6759 0.0178071 28.7527C0.0650492 26.432 -0.0825823 24.1053 0.100481 21.7904C0.631954 16.0505 3.34247 10.5527 7.55292 6.60799Z"
                      fill="#8364E2"
                    />
                    <path
                      d="M30.8691 0C32.9773 0.023621 35.0855 -0.0118105 37.1996 0.0118105C42.4612 0.383842 47.6519 2.40344 51.6143 5.90526C55.9842 9.6551 58.9782 15.0171 59.7459 20.7452C60.0825 23.4025 59.8699 26.0894 59.9998 28.7586C58.1573 28.7527 56.3208 28.7468 54.4784 28.7586C49.949 28.6346 45.4965 27.1701 41.7053 24.7017C39.9573 23.4498 38.1621 22.1802 36.8512 20.444C33.9753 17.2316 32.0207 13.1983 31.2825 8.94647C30.7274 5.99384 30.9518 2.98216 30.8691 0Z"
                      fill="#8364E2"
                    />
                    <path
                      d="M0.0218289 30.4473C1.8938 30.5536 3.77167 30.3587 5.63773 30.5654C13.6275 30.7366 21.3812 35.2246 25.5207 42.057C27.8947 45.8836 29.1702 50.4189 29.0049 54.9246C28.9989 56.4009 29.0226 57.8713 28.9812 59.3417C26.0168 59.2531 23.0228 59.4952 20.0879 58.9224C13.5685 57.8241 7.57466 53.9443 3.96654 48.4052C1.23241 44.3778 -0.131708 39.4587 0.0100184 34.5987C0.0100184 33.2109 0.0100184 31.8291 0.0218289 30.4473Z"
                      fill="#8364E2"
                    />
                    <path
                      d="M50.0221 31.073C53.2346 30.3584 56.5475 30.4765 59.8131 30.4765L59.9548 30.6183C59.8839 33.7067 60.126 36.8306 59.506 39.8836C58.2009 46.7337 53.6657 52.8516 47.5656 56.2117C43.7685 58.3257 39.4104 59.3651 35.07 59.3178C33.6823 59.3237 32.2886 59.2942 30.9009 59.3355C30.9009 56.7786 30.7946 54.2098 31.084 51.6646C31.7572 45.5054 35.0877 39.7714 39.8769 35.8976C42.8413 33.5591 46.3254 31.8643 50.0221 31.073Z"
                      fill="#8364E2"
                    />
                    <path
                      d="M75 49.3258V10H90.8814C94.9884 10 98.1157 10.9551 100.263 12.8652C102.449 14.7378 103.541 17.1536 103.541 20.1124C103.541 22.5843 102.863 24.5693 101.507 26.0674C100.188 27.5281 98.5678 28.5206 96.6462 29.0449C98.9069 29.4944 100.772 30.618 102.241 32.4157C103.711 34.176 104.446 36.236 104.446 38.5955C104.446 41.7041 103.315 44.2697 101.055 46.2921C98.7939 48.3146 95.5912 49.3258 91.4466 49.3258H75ZM82.2342 26.5169H89.8076C91.8422 26.5169 93.4059 26.0487 94.4986 25.1124C95.5912 24.176 96.1376 22.8464 96.1376 21.1236C96.1376 19.4757 95.5912 18.1835 94.4986 17.2472C93.4436 16.2734 91.8422 15.7865 89.6946 15.7865H82.2342V26.5169ZM82.2342 43.4831H90.3163C92.4639 43.4831 94.1218 42.9963 95.2898 42.0225C96.4955 41.0112 97.0984 39.6067 97.0984 37.809C97.0984 35.9738 96.4767 34.5318 95.2333 33.4831C93.9899 32.4345 92.3132 31.9101 90.2032 31.9101H82.2342V43.4831Z"
                      fill="black"
                    />
                    <path
                      d="M108.224 49.3258V21.4607H114.667L115.346 26.6854C116.363 24.8876 117.738 23.4644 119.471 22.4157C121.242 21.3296 123.315 20.7865 125.688 20.7865V28.3708H123.654C122.071 28.3708 120.658 28.6142 119.415 29.1011C118.171 29.588 117.192 30.4307 116.476 31.6292C115.798 32.8277 115.459 34.4944 115.459 36.6292V49.3258H108.224Z"
                      fill="black"
                    />
                    <path
                      d="M138.884 50C135.38 50 132.667 48.9139 130.746 46.7416C128.862 44.5693 127.92 41.3858 127.92 37.191V21.4607H135.098V36.5169C135.098 38.9139 135.587 40.7491 136.567 42.0225C137.547 43.2959 139.091 43.9326 141.201 43.9326C143.198 43.9326 144.837 43.221 146.119 41.7978C147.437 40.3745 148.097 38.3895 148.097 35.8427V21.4607H155.331V49.3258H148.944L148.379 44.6067C147.513 46.2547 146.25 47.5655 144.593 48.5393C142.972 49.5131 141.07 50 138.884 50Z"
                      fill="black"
                    />
                    <path
                      d="M172.987 49.3258C170.048 49.3258 167.693 48.6142 165.922 47.191C164.151 45.7678 163.266 43.2397 163.266 39.6067V27.4719H158.462V21.4607H163.266L164.114 13.9888H170.5V21.4607H178.073V27.4719H170.5V39.6629C170.5 41.0112 170.783 41.9476 171.348 42.4719C171.951 42.9588 172.968 43.2022 174.4 43.2022H177.904V49.3258H172.987Z"
                      fill="black"
                    />
                    <path
                      d="M194.927 50C192.101 50 189.596 49.4007 187.41 48.2022C185.225 47.0037 183.511 45.3184 182.267 43.1461C181.024 40.9738 180.402 38.4644 180.402 35.618C180.402 32.7341 181.005 30.1685 182.211 27.9213C183.454 25.6742 185.15 23.9326 187.297 22.6966C189.483 21.4232 192.045 20.7865 194.984 20.7865C197.734 20.7865 200.164 21.3858 202.274 22.5843C204.384 23.7828 206.023 25.4307 207.191 27.5281C208.397 29.588 209 31.8914 209 34.4382C209 34.8502 208.981 35.2809 208.943 35.7303C208.943 36.1798 208.925 36.6479 208.887 37.1348H187.58C187.731 39.3071 188.484 41.0112 189.841 42.2472C191.235 43.4831 192.911 44.1011 194.871 44.1011C196.34 44.1011 197.565 43.7828 198.544 43.1461C199.562 42.4719 200.315 41.6105 200.805 40.5618H208.152C207.625 42.3221 206.739 43.9326 205.496 45.3933C204.29 46.8165 202.783 47.9401 200.975 48.764C199.204 49.588 197.188 50 194.927 50ZM194.984 26.6292C193.213 26.6292 191.649 27.1348 190.293 28.1461C188.936 29.1199 188.07 30.618 187.693 32.6404H201.653C201.54 30.8052 200.861 29.3446 199.618 28.2584C198.375 27.1723 196.83 26.6292 194.984 26.6292Z"
                      fill="black"
                    />
                  </svg>
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
