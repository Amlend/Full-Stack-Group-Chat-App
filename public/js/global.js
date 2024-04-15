let api = "http://16.170.239.102/";

axios.defaults.headers.common["token"] = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";
