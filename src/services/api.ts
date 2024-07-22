import axios from "axios";
//import { decryptResponse, encryptPayload } from "./encrypt";


// interceptors
axios.interceptors.request.use(
  async (config) => {
    if (config.data) {
      if (config.url && (config.url.includes("upload") || config.url.includes("/organization/create")) ) {
        return config;
      }
      //config.data = await encryptPayload(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  async (response) => {
    if (response.data && response.data.iv) {
      //response.data = await decryptResponse(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const POST = (url: string, data: any, headers?: any) => {

  return new Promise((resolve, reject) => {
    axios
      .post(url, data, headers)
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err?.response?.data);
      });
  });
};
export const PATCH = (url: string, data: any, headers?: any) => {

  return new Promise((resolve, reject) => {
    axios
      .patch(url, data, headers)
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err?.response?.data);
      });
  });
};

export const PUT = (url: string, data: any, headers?: any) => {

  return new Promise((resolve, reject) => {
    axios
      .put(url, data, headers)
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err?.response?.data);
      });
  });
};

export const GET = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err?.response?.data);
      });
  });
};

export const DELETE = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err?.response?.data);
      });
  });
};
