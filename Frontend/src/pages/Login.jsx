import React, { useEffect, useState, useContext } from "react";
import "./Login.css";
import { Container, TextField, Button, Paper, Box } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "../context/MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const Login = () => {
  const {
    setUser,
    setNewChat,
    setPromt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    setCredits,
  } = useContext(MyContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success("Login successfully");
      setUser(response.data.user);
      setCredits(response.data.user.credits);
      createNewChat();
      console.log(response.data.user);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  const createNewChat = () => {
    setNewChat(true);
    setPromt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  return (
    <div className="login-wrapper">
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "var(--card-bg)", // Theme-based
            color: "var(--fg)",
            maxWidth: "400px",
            mx: "auto",
            borderRadius: "12px",
            border: "2px solid #8b5cf6",
          }}
        >
          <h1
            className="login-title"
            style={{
              textAlign: "center",
              marginBottom: "16px",
              color: "var(--fg)",
            }}
          >
            Login
          </h1>

          <p
            className="login-subtext"
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "var(--secondary-text)",
            }}
          >
            Please login to continue!
          </p>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ style: { color: "var(--secondary-text)" } }}
              InputProps={{
                style: {
                  color: "var(--fg)",
                  backgroundColor: "var(--secondary-bg)",
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              className="input-box"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ style: { color: "var(--secondary-text)" } }}
              InputProps={{
                style: {
                  color: "var(--fg)",
                  backgroundColor: "var(--secondary-bg)",
                  borderRadius: "8px",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1,
                backgroundColor: "#8b5cf6",
                borderRadius: "8px",
                color: "#fff",
                "&:hover": { backgroundColor: "#7c3aed" },
              }}
            >
              Login
            </Button>

            <span className="link">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </span>
          </Box>
        </Paper>

        <ToastContainer theme="dark" />
      </Container>
    </div>
  );
};

export default Login;
