import React from 'react';
import FormGroup from './FormGroup';
import networkHelper from '../services/network-helper';

class Register extends React.PureComponent {
  state = { msg: '' };
  onSubmit = async e => {
    e.preventDefault();
    const { username, password } = e.target;

    const result = await networkHelper.fetchHelper(`${process.env.REACT_APP_BACKEND_URI}/api/register`, {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    console.log(result);
  };
  render() {
    return (
      <div id="login" className="container">
        {this.state.msg && <div className={`alert ${this.state.msgClass}`}>{this.state.msg}</div>}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="card-box" onSubmit={this.onSubmit}>
              <h1 className="text-center">Register</h1>
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

export default Register;
