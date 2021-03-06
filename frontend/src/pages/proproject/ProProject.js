import React, { Component } from "react";
import axios from "axios";
import { Link, Route } from "react-router-dom";
import ProjectDetails from "../professional/ProjectDetails";
import "./ProProject.scss";
import BasicLayout from "../../layout/BasicLayout";
import Female from "../../images/female.svg";

export default class ProProjects extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      loading: true,
      isDesktop: false
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASEURL}/api/projects`
    })
      .then(res => {
        this.setState({ projects: res.data });
      })
      .catch(err => {
        this.setState(err);
      });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 750 });
  }

  render() {
    const isDesktop = this.state.isDesktop;
    return (
      <BasicLayout>
        <>
          {isDesktop ? (
            <div className="pro-project-container">
              <div className="project-side-bar">
                {this.state.projects.map(project => (
                  <div className="side-bar-item">
                    <h3>{project.title}</h3>
                    <p>
                      <span>Category:</span> {project.category}
                    </p>
                    <div className="side-bar-img-container">
                      <img className="avatar-img" src={Female} />
                      <Link
                        className="project-detail-button"
                        to={`/professional/projects/details/${project._id}`}
                      >
                        Check Project
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Route
                path="/professional/projects/details/:id"
                render={props => (
                  <ProjectDetails {...props} projects={this.state.projects} />
                )}
              />
            </div>
          ) : (
            <div className="project-mobile">
              {this.state.projects.map(project => (
                <div className="project-mobile-item">
                  <h3>{project.title}</h3>
                  <p>
                    <span>Category:</span> {project.category}
                  </p>
                  <div className="side-bar-img-container">
                    <img className="avatar-img" src={Female} />
                    <Link
                      className="project-detail-button"
                      to={`/professional/projects/details/m/${project._id}`}
                    >
                      Check Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      </BasicLayout>
    );
  }
}
