import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import BaseLayout from "@/layouts/BaseLayout.jsx";
import HomePage from "@/pages/HomePage.jsx";
import CallPage from "@/pages/CallPage.jsx";

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "/call/:dialedCode",
    element: <CallPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
