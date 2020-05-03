import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import authHelper from '../services/auth-helper';
import FormGroup from '../components/FormGroup';
import networkHelper from '../services/network-helper';

class Login extends Component {
  state = {
    redirectToReferrer: false,
  };

  onSubmit = async e => {
    e.preventDefault();
    const { username, password } = e.target;

    const resultsObj = {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    };

    const result = await networkHelper.fetchHelper(`${process.env.REACT_APP_BACKEND_URI}/api/login`, resultsObj);
    console.log(result);
    if (result.message) {
      this.setState({ msg: result.message, msgClass: 'alert-danger' }, () => {
        setTimeout(() => this.setState({ msg: '' }), 3000);
      });
    } else {
      authHelper.authenticate(result.token).then(result => {
        console.log(localStorage.getItem('token'));
        this.setState({ redirectToReferrer: true, msg: 'Login Successful', msgClass: 'alert-success' });
      });
    }
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div id="login" className="container">
        {this.state.msg && <div className={'alert ' + this.state.msgClass}>{this.state.msg}</div>}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="card-box" onSubmit={this.onSubmit}>
              <h1 className="text-center">Login</h1>
              <FormGroup>
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter Username" />
              </FormGroup>
              <FormGroup>
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" />
              </FormGroup>
              <div className="row">
                <div className="col-md-3">
                  <button type="submit" className="ml-auto btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
