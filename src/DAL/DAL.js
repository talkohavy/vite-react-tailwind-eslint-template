import axios from 'axios';
import { API_URLS } from '../utils/globalConstants';

/** @type {DAL} */
let dalClient;

class DAL {
  client;

  constructor({ client }) {
    this.client = client;
  }

  async loginWithCredentials(props) {
    const { requestParams, headers } = props;

    const response = await axios.post(API_URLS.users_service.loginWithCredentials, requestParams, { headers });

    return response;
  }

  async loginWithCookie() {
    const response = await axios.post(API_URLS.users_service.loginWithCookie);

    return response;
  }

  async loginWithSaml() {
    const response = await axios.post(API_URLS.users_service.loginWithSaml);

    return response;
  }
}

function initDAL(httpClient) {
  dalClient = new DAL({ client: httpClient });
}

export { dalClient, initDAL };
