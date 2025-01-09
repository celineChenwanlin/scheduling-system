import React from "react";
import { Navigate } from "react-router-dom";
import Hello from "../pages/home/index.tsx";
import Test from "../pages/test.tsx";
import FlightManagement from "../pages/flightManagement/index.tsx";
import PrivateRoute from "./privateRouter.tsx";
export const routerMap = [
  {
    path: "/",
    label: "Gantte Center",
    element: (
      // <PrivateRoute>
      <Hello />
      // </PrivateRoute>
    ),
  },
  {
    path: "/flightManagement",
    label: "Flight Management",
    element: (
      // <PrivateRoute>
      <FlightManagement />
      // </PrivateRoute>
    ),
  },
];
