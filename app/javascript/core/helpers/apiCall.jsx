import request from 'axios';
import { keysToSnake } from "./utils";

const getHeaders = () => {
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrf,
  };
};

export default {
  fetchEntities(endpoint, parameters, responseType = 'json') {
    return request({
      method: 'GET',
      url: endpoint,
      headers: getHeaders(),
      params: keysToSnake(parameters),
      responseType,
    });
  },

  submitEntity(entity, endpoint, method = 'POST', changeData = true) {
    return request({
      method,
      url: endpoint,
      headers: getHeaders(),
      responseType: 'json',
      data: changeData === true ? keysToSnake(entity) : entity,
    });
  },
};
