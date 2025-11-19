import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/verify`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RingLoader color="#ffffff" loading={loading} />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
