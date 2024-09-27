import axios from 'axios';
import { API_URLS } from '../utils/constants';
import type { LoginWithCredentialsProps } from './DAL.interface';

type DalProps = {
  client: DAL;
};

let dalClient: DAL;

class DAL {
  client;

  constructor(props: DalProps) {
    const { client } = props;

    this.client = client;
  }

  async loginWithCredentials(props: LoginWithCredentialsProps) {
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

type InitDALProps = {
  httpClient: any;
};

function initDAL(props: InitDALProps) {
  const { httpClient } = props;

  dalClient = new DAL({ client: httpClient });
}

export { dalClient, initDAL };
