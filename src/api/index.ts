import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么，例如处理 401 错误
    if (error.response && error.response.status === 401) {
      // 处理 401 错误，例如重定向到登录页面
      console.error("Unauthorized: Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default instance;
