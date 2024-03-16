import "./App.css";
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import ForgotPassword from "./auth/ForgotPassword";
import Login from "./auth/Login";
import Register from "./auth/Register";
import taskReducer from "./reducer/taskReducer";
import tokenReducer from "./reducer/tokenReducer";
import userReducer from "./reducer/userReducer";
import Logout from "./auth/Logout";

import ResetPassword from "./components/forgotPassword/ResetPassword";
import axios from "./Axios/axios.js";

function App() {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token);
  const [user, userDispatch] = useReducer(userReducer, {});
  useEffect(() => {
    console.log("App.js");
    const fetchUser = async () => {
      try {
        console.log("fetchUser");
        const res = await axios.get("/user/getUser", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        //tokenDispatch({type: "SET_TOKEN", payload: res.token})
        console.log("res.data: ", res.data);
        userDispatch({ type: "SET_USER", payload: res.data.user });
      } catch (error) {
        console.log(error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("fetchTasks");
        const res = await axios.get("/task/getTask", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        dispatch({ type: "SET_TASK", payload: res.data });
      } catch (error) {
        console.log(error);
      }
    };
    if (userToken) {
      fetchTasks();
    }
  }, [userToken]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
