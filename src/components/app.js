import React, { useEffect } from "react";
import { Router, Location, Redirect, Route } from "@reach/router";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/header";
import Home from "./pages/home";
import Home1 from "./pages/home1";
import Home2 from "./pages/home2";
import Home3 from "./pages/home3";
import Explore from "./pages/explore";
import Explore2 from "./pages/explore2";
import Rangking from "./pages/rangking";
import Auction from "./pages/Auction";
import Helpcenter from "./pages/helpcenter";
import Colection from "./pages/colection";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";
import Wallet from "./pages/wallet";
import Login from "./pages/login";
import LoginTwo from "./pages/loginTwo";
import Register from "./pages/register";
import Price from "./pages/price";
import Works from "./pages/works";
import News from "./pages/news";
import Create from "./pages/create";
import Create2 from "./pages/create2";
import Create3 from "./pages/create3";
import Createoption from "./pages/createOptions";
import Activity from "./pages/activity";
import Contact from "./pages/contact";
import ElegantIcons from "./pages/elegantIcons";
import EtlineIcons from "./pages/etlineIcons";
import FontAwesomeIcons from "./pages/fontAwesomeIcons";
import Accordion from "./pages/accordion";
import Alerts from "./pages/alerts";
import Progressbar from "./pages/progressbar";
import Tabs from "./pages/tabs";
import { useSelector, useDispatch } from "react-redux";
import { stopLoading } from "../actions";

import { createGlobalStyle } from "styled-components";
import ImageUpload from "./pages/EditProfile";
import EditUser from "./pages/EditUser";
import Spinner from "react-bootstrap/Spinner";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => {
  const isLoader = useSelector((state) => state.appLoader);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("wallet_address")) {
      dispatch(stopLoading());
    } else {
      dispatch(stopLoading());
    }
  }, []);
  return isLoader ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "300px",
      }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className="wraper">
      <GlobalStyles />
      <Header />
      <PosedRouter>
        <ScrollTop path="/">
          <Home exact path="/">
            <Redirect to="/home" />
          </Home>
          <Home1 path="/home1" />
          <Home2 path="/home2" />
          <Home3 path="/home3" />
          <Explore path="/explore" />
          <Explore2 path="/explore2" />
          <Rangking path="/rangking" />
          <Auction path="/Auction" />
          <Helpcenter path="/helpcenter" />
          <Colection path="/colection" />
          <ItemDetail path="/ItemDetail" />
          <Profile path="/profile/:wallet_address" />
          <Wallet path="/wallet" />
          <Login path="/login" />
          <LoginTwo path="/loginTwo" />
          <Register path="/register" />
          <Price path="/price" />
          <Works path="/works" />
          <News path="/news" />
          {/* <Create path="/create" /> */}
          <Create2 path="/create/:wallet_address" />
          {/* <Create3 path="/create3" /> */}
          <Createoption path="/createOptions" />
          <Activity path="/activity" />
          <Contact path="/contact" />
          <ElegantIcons path="/elegantIcons" />
          <EtlineIcons path="/etlineIcons" />
          <FontAwesomeIcons path="/fontAwesomeIcons" />
          <Accordion path="/accordion" />
          <Alerts path="/alerts" />
          <Progressbar path="/progressbar" />
          <Tabs path="/tabs" />
          <ImageUpload path="/imageupload" />
          <EditUser path="/profile/:wallet_address/editprofile" />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
    // <Router>
    //   <div>
    //     <Header />
    //     <Routes>
    //       <Route exact path="/" element={<Home />} />
    //       <Route exact path="/profile/:wallet_address" element={<Profile />} />
    //     </Routes>
    //   </div>
    // </Router>
  );
};
export default App;
