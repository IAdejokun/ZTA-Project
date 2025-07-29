import { useState, useEffect } from "react";
import axios from "../api/axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Home = () => {
  const [summary, setSummary] = useState<{
    total_logs: number;
    attack_detection_rate: string | number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/metrics/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const unauthorizedRate = summary
    ? (100 - Number(summary.attack_detection_rate)).toFixed(2)
    : 0;

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
          style={{ fontSize: "1.2em" }}
        >
          Go to Dashboard
        </Button>

        <Button
          variant="contained"
          onClick={() => (window.location.href = "/devices")}
          style={{ fontSize: "1.2em" }}
          color="success"
        >
          Manage Devices
        </Button>
      </Box>

      {/* Metrics Overview */}
      <Box
        style={{
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Total Requests */}
        <Card
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
              {loading ? "Loading..." : summary?.total_logs ?? "0"}
            </Typography>
          </CardContent>
        </Card>

        {/* Attack Detection Rate */}
        <Card
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
              {loading
                ? "Loading..."
                : `${summary?.attack_detection_rate ?? 0}%`}
            </Typography>
          </CardContent>
        </Card>

        {/* Unauthorized Access Rate */}
        <Card
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
              {loading ? "Loading..." : `${unauthorizedRate}%`}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
