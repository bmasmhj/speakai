import axios from "axios";

const Instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
Instance.interceptors.request.use(
  (response) => {
    const token = localStorage.getItem("token");
    response.headers["Authorization"] = "Bearer " + token;
    return response;
  },
  (error) => {    
    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response.status);
      if(error.response.status === 401){
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default Instance;
