import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { baseURL } from "../../utils/baseURL";
import Clock from "./Clock";
import Spinner from "react-bootstrap/Spinner";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const ColumnZeroTwo = (props) => {
  const [nfts, setNfts] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios({
      url: baseURL + "/get_owned_nfts",
      method: "POST",
      data: {
        userId: props.userId,
      },
    })
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.nftsOwned, "haha");
          setNfts(res.data.nftsOwned);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="row">
      {loading ? (
        <center style={{ height: "200px" }}>
          {" "}
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </center>
      ) : (
        <>
          {" "}
          {nfts.length !== 0 ? (
            nfts.map((nft, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              >
                <div className="nft__item">
                  {/* <div className="de_countdown">
                  <Clock deadline={nft.deadline} />
                </div> */}
                  <div className="author_list_pp">
                    <span onClick={() => window.open(nft.authorLink, "_self")}>
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

                  <div className="nft__item_wrap" style={{ height: "300px" }}>
                    <Outer>
                      <span
                        onClick={() =>
                          window.open(
                            `/nft/${nft.contract_address}/${nft.token_id}`,
                            "_self"
                          )
                        }
                      >
                        <img
                          // onLoad={this.onImgLoad}
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
                      {/* <span>{nft.bid}</span> */}
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
        </>
      )}
    </div>
  );
};

export default ColumnZeroTwo;
