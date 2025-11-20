import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Signup.css";
import { Container, TextField, Button, Paper, Box } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "../context/MyContext.jsx";

const Signup = () => {
  const { setUser, setCredits } = useContext(MyContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      toast.success("Signup successful!");
      setUser(response.data.user);
      setCredits(response.data.user.credits);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("Signup failed!");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="signup-wrapper">
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
            className="signup-title"
            style={{
              textAlign: "center",
              marginBottom: "16px",
              color: "var(--fg)",
            }}
          >
            Sign Up
          </h1>

          <p
            className="signup-subtext"
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "var(--secondary-text)",
            }}
          >
            Please signup to continue!
          </p>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="username"
              value={formData.username}
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
              Sign Up
            </Button>
            <span className="link">
              Do you have an account?{" "}
              <Link to="/login" className="login-link">
                Log In
              </Link>
            </span>
          </Box>
        </Paper>

        <ToastContainer theme="dark" />
      </Container>
    </div>
  );
};

export default Signup;
