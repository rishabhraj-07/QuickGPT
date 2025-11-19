import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MyProvider } from "./context/MyContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MyProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MyProvider>
  </BrowserRouter>
);
