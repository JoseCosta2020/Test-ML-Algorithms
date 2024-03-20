import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GoogleLayer } from "react-leaflet";
import { Table } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
//import L from "leaflet";
import BackendDataDisplay from "./BackendDataDisplay";

function App () {

  return (
    <div>
      <h1>Meu Frontend React</h1>
      <BackendDataDisplay />
    </div>
  );
};

export default App