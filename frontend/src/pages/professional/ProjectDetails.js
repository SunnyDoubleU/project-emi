import React, { Component } from "react";
import axios from "axios";
import { getProfessional } from "../../utils/auth";
import Prodetail from "./Prodetails";
import "./ProjectDetails.scss";
import ProfessionalChat from "../../components/ProfessionalChat"
import { ChatkitProvider, TokenProvider } from '@pusher/chatkit-client-react';
import { Route } from "react-router-dom";
const tokenProvider = new TokenProvider({
  url: process.env.REACT_APP_CHATKIT_TOKEN,
});
const instanceLocator = process.env.REACT_APP_CHATKIT_INSTANCE;

export default class ProjectDetails extends Component {
  constructor() {
    super()
    this.state = {
      project: null,
      hourlyPrice: "",
      description: "",
      user: getProfessional(),
      quote: null,
      isDesktop: false
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
    this.fetchProjectDetails();
  }

  fetchProjectDetails() {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASEURL}/api/projects/${this.props.match.params.id}`
    })
      .then(res => {
        let check = res.data.quotes.filter(
          element => element.professional === this.state.user.id
        );
        if (check.length > 0) {
          this.setState({
            project: res.data,
            quote: check[0]
          });
        } else {
          this.setState({
            project: res.data,
            hourlyPrice: "",
            description: "",
            quote: null
          });
        }
        return res.data
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps) {

    if (prevProps.match.params.id != this.props.match.params.id) {

      this.fetchProjectDetails()
        .then((project) => {
          let projectId = this.props.match.params.id;
          let customerId = project.customer;
          let professionalId = this.state.user.id;
          this.props.history.push(`/professional/projects/details/${projectId}/${customerId}/${professionalId}`)
        })
    }

  }

  inputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sumbitHandler = e => {
    e.preventDefault();
    const userId = this.state.user.id;
    const projectId = this.state.project._id;
    const { hourlyPrice, description } = this.state;
    axios({
      method: "POST",
      data: {
        userId,
        projectId,
        hourlyPrice,
        description
      },
      url: `${process.env.REACT_APP_BASEURL}/api/quotes/create`
    })
      .then(response => {
        this.fetchProjectDetails();
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 750 });
  }
  render() {
    const isDesktop = this.state.isDesktop;
    return (

      <div className="project-detail-container">
        {this.state.project ? (
          <>
            <Prodetail project={this.state.project} />
            {this.state.quote ? (
              <>
                <div className='project-detail-quoted'>
                  <h3>Your submitted quote</h3>
                  <h4>Quoted Price:</h4>
                  <p>${this.state.quote.hourlyPrice}/hr</p>
                  <h4>Quote Description:</h4>
                  <p>{this.state.quote.description}</p>
                </div>
                {!isDesktop ?
                  <ChatkitProvider
                    instanceLocator={instanceLocator}
                    tokenProvider={tokenProvider}
                    userId={this.state.user.id}>
                    <ProfessionalChat otherUserId={this.state.project.customer} />
                  </ChatkitProvider> :
                  <Route path="/professional/projects/details/:id/:customerId/:professionalId" render={props => (
                    <ChatkitProvider
                      {...props}
                      instanceLocator={instanceLocator}
                      tokenProvider={tokenProvider}
                      userId={props.match.params.professionalId}>
                      <ProfessionalChat otherUserId={props.match.params.customerId} />
                    </ChatkitProvider>
                  )} />

                }
              </>
            ) : (
                <div className="project-quote-container">
                  <h3>Submit Your Quote</h3>
                  <form className="quote-input-field" onSubmit={this.sumbitHandler}>
                    <input
                      required
                      placeholder="Price per hour"
                      onChange={this.inputHandler}
                      name="hourlyPrice"
                      value={this.state.hourlyPrice}
                      type="text"
                    />
                    <input
                      required
                      placeholder="Description"
                      onChange={this.inputHandler}
                      name="description"
                      value={this.state.description}
                      type="text"
                    />
                    <button type="submit"> Sumbit Quote</button>
                  </form>
                </div>
              )}
          </>
        ) : (
            <div className="loading">
              <h1>LOADING!!!</h1>
            </div>
          )}

      </div>
    )
  }
}

// export default function ProjectDetails(props) {
//   const projectId = props.match.params.id;
//   let filterproject = props.projects.filter(
//     project => project._id === projectId
//   )[0];
//     
//   return (
//     <>
//     {props.projects.length ?
//       <div>
//       <h1>{filterproject.title}</h1>
//     </div>:
//     <h1>Loading</h1>
//     }
//     </>
//   );
// }
