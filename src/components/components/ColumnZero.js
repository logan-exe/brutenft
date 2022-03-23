import React, { Component } from "react";
import styled from "styled-components";
import Clock from "./Clock";

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
  return (
    <div className="row">
      {props.data.length !== 0 ? (
        props.data.map((nft, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <div className="nft__item">
              {nft.deadline && (
                <div className="de_countdown">
                  <Clock deadline={nft.deadline} />
                </div>
              )}
              <div className="author_list_pp">
                <span
                  onClick={() =>
                    window.open(
                      `/profile/${nft.owned_by.wallet_address}`,
                      "_self"
                    )
                  }
                >
                  <img
                    className="lazy"
                    src={nft.owned_by.profile_image}
                    alt=""
                  />
                  {nft.owned_by.is_verified ? (
                    <i className="fa fa-check"></i>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <div
                className="nft__item_wrap"
                // style={{ height: `${this.state.height}px` }}
                style={{ height: "280px" }}
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
                <div className="nft__item_price">
                  {nft.initial_price}
                  <span>{nft.bid}</span>
                </div>
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
