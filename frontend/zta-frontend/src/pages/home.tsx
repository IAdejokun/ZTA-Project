//import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";


const Home = () => {
  return (
    <Box component="section" style={{ padding: "2rem" }}>
      {/* Title Section */}
      <Typography
        variant="h1"
        style={{
          textAlign: "center",
          color: "blue",
          fontSize: "2.5rem",
          marginTop: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        Optimizing Insecure Web Interfaces and APIs Vulnerabilities in Legacy
        IoT Devices Through Zero-Trust Architecture (ZTA)
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        style={{
          marginBottom: "3rem",
          textAlign: "center",
          color: "gray",
          fontSize: "1.4em",
          width: "80%",
          margin: "0 auto",
        }}
      >
        A demonstration of how Zero-Trust Architecture can secure legacy IoT
        devices while preserving system performance and scalability.
      </Typography>

      {/* Quick Navigation */}
      <Box
        style={{
          marginTop: "3rem",
          marginBottom: "3rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Button
          variant="contained"
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
          style={{ fontSize: "1.2em" }}
        >
          Go to Dashboard
        </Button>

        <Button
          variant="contained"
          onClick={() => (window.location.href = "/devices")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
          style={{ fontSize: "1.2em" }}
          color="success"
        >
          Manage Devices
        </Button>
      </Box>

      {/* Metrics Overview */}
      <Box
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
        style={{
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Metric Cards */}
        <Card
          className="bg-white rounded-lg shadow p-6 text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "1.7rem",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Total Requests
            </Typography>
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "blue",
              }}
            >
              1,234
            </Typography>
          </CardContent>
        </Card>

        <Card
          className="bg-white rounded-lg shadow p-6 text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "1.7rem",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Attack Detection Rate
            </Typography>
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "green",
              }}
            >
              98%
            </Typography>
          </CardContent>
        </Card>

        <Card
          className="bg-white rounded-lg shadow p-6 text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              className="text-xl font-semibold text-gray-800"
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "1.7rem",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Unauthorized Access Rate
            </Typography>
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "red",
              }}
            >
              5%
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
