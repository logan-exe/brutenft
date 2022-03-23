import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Clock from "./Clock";
import { Table, Dropdown } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../utils/baseURL";
import Spinner from "react-bootstrap/Spinner";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const ColumnZeroThree = (props) => {
  const [loading, setLoading] = useState();
  const [nfts, setNfts] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  useEffect(() => {
    axios({
      url: baseURL + "/get_user_activity",
      method: "POST",
      data: {
        userId: props.userId,
      },
    })
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data, "haha");
          setFrom(res.data.from);
          setTo(res.data.to);
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
          <select style={{ height: "40px" }}>
            <option value="0">All Items</option>
            <option value="1">Offers Made</option>
            <option value="3">Offers Recieved</option>
            <option value="4">Minted</option>
            <option value="5">Transfer</option>
          </select>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Event</th>
                <th>Price</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {from?.map((act, index) => {
                return (
                  <tr key={index}>
                    <td>{act.tx_type}</td>
                    <td>{act.price}</td>
                    <td>
                      {act.tx_type === "Minting Token"
                        ? act.contract_address
                        : act.from}
                    </td>
                    <td>{act.to}</td>
                    <td>{act.date.slice(0, 16)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ColumnZeroThree;
