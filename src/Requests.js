import { useNavigate } from "react-router-dom";

export const apiRoot = 'https://quizzes.worldm.ru/'

export function fetchApiGet(route, navigateFunc) {
  let headers = {};

  if (navigateFunc) {
    let token = localStorage.getItem('token');
    if (!token) {
      navigateFunc('/login');
    }

    headers['Authorization'] = "Bearer " + localStorage.getItem('token');
  }

  return fetch(apiRoot + route, {
    headers: headers
  })
    .then(async (response) => {
      if (response.status === 401) {
        navigateFunc('/login');
      }

      return [response, await response.json()];
    });
}

export function fetchApiPost(route, body = {}, navigateFunc) {
  let headers = {
    "Content-Type": "application/json"
  };

  if (navigateFunc) {
    let token = localStorage.getItem('token');
    if (!token) {
      navigateFunc('/login');
    }

    headers['Authorization'] = "Bearer " + localStorage.getItem('token');
  }

  return fetch(apiRoot + route, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(async (response) => {
      if (response.status === 401) {
        navigateFunc('/login');
      }

      return [response, await response.json()];
    });
}
