import {API_URL} from "./constants.js";

export function fetchToApi(url, method, body, headers) {
  return fetch(API_URL+ url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers
    },
    body: body ? JSON.stringify(body) : null
  }).then((res) => res.json());
}