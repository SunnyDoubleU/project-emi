import axios from "axios";
import { logout, clearUser } from "./auth";
import qs from "qs";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

export const getProjects = function () {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASEURL}/api/projects`
  })
    .then(projects => {
      return projects;
    })
    .catch(err => {
      if (err.status(403)) clearUser();
      throw new Error("unauthorized")
        .then(response => {
          history.push("/customer/login");
        })
        .catch(error => {
          console.log(error);
        });
    });
};

export const getSingleProject = function (projectId) {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASEURL}/api/customer/projects/${projectId}`
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
};

export const newProject = function (
  category,
  description,
  title,
  customer,
  startDate,
  location
) {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_BASEURL}/api/projects/create`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify({ category, description, title, customer, startDate, location })
  })
    .then(project => {
      return project;
    })
    .catch(error => {
      console.log(error);
    });
};
