import React from "react";
import { CssBaseline, Container } from "@mui/material";
import TimelineChart from "./components/TimelineChart";

function App() {
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <TimelineChart />
    </Container>
  );
}

export default App;
