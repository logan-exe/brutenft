import React, { Component, useState } from "react";
import styled from "styled-components";
import Clock from "./Clock";
import noimage from "./noimage.jpeg";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const ColumnZero = (props) => {
  console.log(props.data, "tjis is the datas");
  const [imageHeight, setImageHeight] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = imageHeight;
    if (currentHeight < img.offsetHeight) {
      // this.setState({
      //     height: img.offsetHeight
      // })

      setImageHeight(img.offsetHeight);
    }
  };
  return (
    <div className="row">
      {props.data.length !== 0 ? (
        props.data.map((nft, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <div
              className="nft__item"
              style={{ marginRight: "0px", marginLeft: "0px" }}
            >
              {nft.deadline && (
                <div className="de_countdown">
                  <Clock deadline={nft.deadline} />
                </div>
              )}
              <div
                className={profileLoaded ? "author_list_pp" : ""}
                style={{ height: "50px" }}
              >
                <span
                  onClick={() =>
                    window.open(
                      `/profile/${nft.owned_by.wallet_address}`,
                      "_self"
                    )
                  }
                >
                  <img
                    className={profileLoaded ? "lazy" : ""}
                    src={nft.owned_by.profile_image}
                    alt="loading"
                    onLoad={() => setProfileLoaded(true)}
                  />

                  {/* {!profileLoaded ? (
                    <img className="lazy" src={noimage} alt="" />
                  ) : (
                    ""
                  )} */}

                  {nft.owned_by.is_verified && profileLoaded ? (
                    <i className="fa fa-check"></i>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              <div
                className="nft__item_wrap"
                style={{ height: `${imageHeight}px`, cursor: "pointer" }}
                onLoad={onImgLoad}
                onClick={() =>
                  window.open(
                    `/nft/${nft.contract_address}/${nft.token_id}`,
                    "_self"
                  )
                }
              >
                <Outer>
                  <span>
                    <img
                      src={nft.image_url}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </span>
                </Outer>
              </div>
              <div className="nft__item_info">
                <span
                  onClick={() =>
                    window.open(
                      `/nft/${nft.contract_address}/${nft.token_id}`,
                      "_self"
                    )
                  }
                >
                  <h4>{nft.title}</h4>
                </span>
                {nft.on_sale ? (
                  <div className="nft__item_price">
                    {nft.initial_price + " MATIC"}
                    {/* lorem ipsum dolor hello world how are you */}
                  </div>
                ) : (
                  <div className="nft__item_price">NOT FOR SALE</div>
                )}

                <div className="nft__item_action">
                  <span onClick={() => window.open(nft.bidLink, "_self")}>
                    {nft.on_sale ? "On Sale" : "Make an offer"}
                  </span>
                </div>
                <div className="nft__item_like">
                  {/* <i className="fa fa-heart"></i> */}
                  <span>{nft.likes ? nft.likes.length : 0} Likes</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <center style={{ height: "200px" }}>No Data Found</center>
      )}
    </div>
  );
};

export default ColumnZero;
