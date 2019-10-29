import React, { Component } from "react";
import "./CustomerSignUp.scss";
import axios from "axios";
import { setUser } from "../utils/auth";
import BasicLayout from "../layout/BasicLayout";

class CustomerSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
      counter: 0,
      title: "",
      category: "",
      description: "",
      loginPassword: "",
      loginEmail: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.inputEvent = this.inputEvent.bind(this);
    this.loginHandle = this.loginHandle.bind(this);
  }

  inputEvent = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    const {
      mobile,
      email,
      firstname,
      lastname,
      password,
      category,
      description,
      title,
      loginPassword,
      loginEmail
    } = this.state;

    if (this.state.counter === 1) {
      axios({
        method: "POST",
        data: {
          email,
          firstname,
          lastname,
          password,
          mobile
        },
        url: "http://localhost:5000/api/customer/signup"
      })
        .then(response => {
          debugger
          return axios({
            method: "POST",
            data: {
              category,
              description,
              title,
              customer: response.data._id
            },
            url: "http://localhost:5000/api/projects/create"
          })
            .then(res => {
              localStorage.setItem("customer", JSON.stringify(res.data));
            })
            .then(() => {
              this.props.history.push("/");
            })
            .catch((err) => {
              console.log(err);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios({
        method: "POST",
        data: {
          email: loginEmail,
          password: loginPassword
        },
        url: "http://localhost:5000/api/customer/login"
      })
        .then(response => {
          axios({
            method: "POST",
            data: {
              category,
              description,
              title,
              customer: response.data.id
            },
            url: "http://localhost:5000/api/projects/create"
          })
            .then(res => {
              console.log("project saved");
              this.props.history.push("/");
            })
            .catch(err => {
              console.log(err);
            });
          localStorage.setItem("customer", JSON.stringify(response.data));
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleSelect = event => this.setState({ category: event.target.value });

  handleNext = () => {
    this.setState({
      counter: this.state.counter + 1
    });
  };
  handleBack = () => {
    this.setState({
      counter: this.state.counter - 1
    });
  };

  loginHandle = () => {
    this.setState({
      counter: this.state.counter + 1
    });
  };

  render() {
    return (
      <BasicLayout>
        <div className="customer-container">
          <form onSubmit={this.handleSubmit} className="customer-form">
            {this.state.counter === 0 && (
              <>
                <div className="form-input-container">
                  <label>Title</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.title}
                    name="title"
                    placeholder="Enter Title"
                  />
                </div>
                <div className="form-input-container">
                  <label>Experts you are looking for</label>
                  <select
                    value={this.state.category}
                    onChange={this.handleSelect}
                  >
                    <option value="IT">IT</option>
                    <option selected value="Home Services">
                      Home Services
                    </option>
                    <option value="Pet">Pet</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
                <div className="form-input-container">
                  <label>Description</label>
                  <textarea
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.description}
                    name="description"
                    placeholder="Enter description"
                  />
                </div>
                <button onClick={this.handleNext}>next</button>
              </>
            )}
            {this.state.counter === 1 && (
              <>
                <button onClick={this.loginHandle}>have a account?</button>

                <div className="form-input-signup">
                  <label>Email</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.email}
                    name="email"
                    placeholder="Enter Email"
                  />
                </div>
                <div className="form-input-signup">
                  <label>Firstname</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.firstname}
                    name="firstname"
                    placeholder="firstname"
                  />
                </div>
                <div className="form-input-signup">
                  <label>Lastname</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.lastname}
                    name="lastname"
                    placeholder="lastname"
                  />
                </div>
                <div className="form-input-signup">
                  <label>Mobile</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.mobile}
                    name="mobile"
                    placeholder="mobile"
                  />
                </div>
                <div className="form-input-signup">
                  <label>Password</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="Password"
                    value={this.state.password}
                    name="password"
                    placeholder="password"
                  />
                </div>
                <button onClick={this.handleBack}>back</button>
                <button type="submit">Submit</button>
              </>
            )}
            {this.state.counter === 2 && (
              <>
                <div className="form-input-signup">
                  <label>Lastname</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.loginEmail}
                    name="loginEmail"
                    placeholder="Enter Email"
                  />
                </div>
                <div className="form-input-signup">
                  <label>Lastname</label>
                  <input
                    required
                    onChange={this.inputEvent}
                    type="text"
                    value={this.state.loginPassword}
                    name="loginPassword"
                    placeholder="password"
                  />
                </div>
                <button onClick={this.handleBack}>back</button>
                <button type="submit">Submit</button>
              </>
            )}
          </form>
        </div>
      </BasicLayout>
    );
  }
}

export default CustomerSignUp;
