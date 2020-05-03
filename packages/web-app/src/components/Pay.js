import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import logo from "../favicon.ico";
import networkHelper from "../services/network-helper";
import { Link } from "react-router-dom";
import styles from "./pay.module.css";

const useForm = initialState => {
  const [values, setValues] = useState(initialState);

  return [
    values,
    e => {
      console.log(e.target);
      setValues({
        ...values,
        [e.target.name]: e.target.value
      });
    }
  ];
};

const Payment = props => {
  const [{ name, team, paymentAmount }, handleChange] = useForm({
    name: "",
    team: "",
    paymentAmount: ""
  });

  const [isLoading, setLoading] = useState(false);
  const [failureMsg, setFailureMsg] = useState("");

  const teams = ["D1", "D2", "D3", "D4"];

  async function onToken(res) {
    setLoading(true);

    try {
      const resp = await networkHelper.fetchHelper(
        `${process.env.REACT_APP_BACKEND_URI}/api/payment`,
        {
          method: "POST",
          body: JSON.stringify({
            playerName: name,
            team: team,
            paymentAmount: paymentAmount * 100,
            token: res.id,
            email: res.email
          })
        }
      );

      // Redirect on success
      props.history.push("/paymentConfirmation/" + resp.paymentRef);
    } catch (e) {
      setFailureMsg(e + "please try again later!");
    }

    setLoading(false);
  }

  function isFormValid() {
    return name.length > 0 && team.length > 0 && paymentAmount > 0;
  }


  return (
    <React.Fragment>
      <div className={styles.overlay} />
      <div className={styles.modal__container}>
        <main className={styles.modal__main}>
          <header className={styles.modal__header}>
            <div className={styles.modal__header__logo}>
              <div className={styles.modal__header__logoWrap}>
                <div className={styles.modal__header__logoBevel} />
                <div className={styles.modal__header__logoBorder} />
                <img src={logo} alt="team logo" />
              </div>
            </div>

            <Link className={`btn btn-sm ${styles.btn__close}`} to="/">x</Link>
            <div className={styles.modal__header__company}>Lions Membership</div>
            <div className={styles.modal__header__description}>
              Yearly Fees Payment
            </div>
          </header>

          <div className={styles.modal__form}>
            <div className={styles.modal__form__modalBody}>
              <div className={styles.modal__form__modalContent}>
                {isLoading ? (
                  <p>Please wait while we verify your details...</p>
                ) : (
                  <React.Fragment>
                    {failureMsg && (
                      <div className={`alert alert-danger`} role="alert">
                        {failureMsg}
                      </div>
                    )}

                    <div className="form-group">
                      <label hidden htmlFor="inputName">
                        Players name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-border"
                          id="inputName"
                          name="name"
                          placeholder="Players name"
                          value={name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label hidden htmlFor="inputTeam">
                        Players Team
                      </label>
                      <select
                        className="form-control"
                        onChange={handleChange}
                        value={team}
                        name="team"
                        required
                      >
                        <option defaultValue>Select a team</option>
                        {teams.map(val => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label hidden htmlFor="paymentAmount">
                        Payment Amount
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <div className="input-group-text">€</div>
                        </div>
                        <input
                          type="number"
                          className="form-control form-border"
                          autoComplete="off"
                          id="paymentAmount"
                          name="paymentAmount"
                          placeholder="Payment amount"
                          value={paymentAmount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <StripeCheckout
                        name={`Lions Membership`}
                        description={`Payment for ${name}`}
                        image={logo}
                        currency="EUR"
                        amount={paymentAmount * 100}
                        stripeKey={process.env.REACT_APP_STRIPE_CLIENT_KEY}
                        token={res => onToken(res)}
                      >
                        <button disabled={!isFormValid()}>Next</button>
                      </StripeCheckout>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default Payment;
