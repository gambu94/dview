import moment from "moment";

export const getEvents = (initDate = new Date(), endDate = new Date()) => {
  let BASE_URL = "https://x-elasticsearch.de-c1.cloudhub.io/api/priceBook?";
  let startDate = moment(initDate);
  let params = {
    data: startDate.format("YYYY-MM-DD"),
  };
  let URL = BASE_URL + new URLSearchParams(params);
  let options = {
    method: "GET",
    headers: {
      "access-control-allow-origin": "*",
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  return fetch(URL, options);
};

export const getFlowDetails = (
  flowName,
  initDate = new Date(),
  endDate = new Date()
) => {
  let BASE_URL = `https://x-elasticsearch.de-c1.cloudhub.io/api/${flowName}?`;

  let startDate = moment(initDate);
  let params = {
    data: startDate.format("YYYY-MM-DD"),
  };
  let URL = BASE_URL + new URLSearchParams(params);
  let options = {
    method: "GET",
    headers: {
      "access-control-allow-origin": "*",
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  return fetch(URL, options);
};

export const getDashboard = (initDate = new Date(), endDate = new Date()) => {
  let BASE_URL = "https://x-elasticsearch.de-c1.cloudhub.io/api/dashboard?";
  let startDate = moment(initDate);
  let params = {
    data: startDate.format("YYYY-MM-DD"),
  };
  let URL = BASE_URL + new URLSearchParams(params);
  let options = {
    method: "GET",
    headers: {
      "access-control-allow-origin": "*",
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  return fetch(URL, options);
};
