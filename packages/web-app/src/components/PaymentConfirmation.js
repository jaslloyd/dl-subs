import React, { useEffect, useState } from "react";
import networkHelper from "../services/network-helper";

export default function PaymentConfirmation(props) {
  const [paymentDetails, setPayymentDetails] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const paymentRef = props.match.params.code;
    networkHelper
      .fetchHelper(
        `${process.env.REACT_APP_BACKEND_URI}/api/payment/${paymentRef}`,
        {
          method: "GET"
        }
      )
      .then(resp => {
        setPayymentDetails(resp);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        props.history.push("/404");
      });
  }, [props.match.params.code]);
  return !isLoading ? (
    <div className="PaymentConfirmation">
      <div className="alert alert-success text-center" role="alert">
        Payment of €{paymentDetails.message.amount / 100} Successful!
      </div>
      <div className="payment__details">
        <p>Name/Email: {paymentDetails.message.billing_details.name}</p>
        <p>Description: {paymentDetails.message.description}</p>
        <p>
          Receipt:
          <a
            href={paymentDetails.message.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here
          </a>
        </p>
        <p>Amount: €{paymentDetails.message.amount / 100}</p>
      </div>
    </div>
  ) : (
    <h1>Loading</h1>
  );
}
