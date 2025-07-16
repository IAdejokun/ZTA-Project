import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type SummaryMetrics = {
  latencies: { [key: string]: number };
  requests: { [key: string]: number };
  attack_detection_rate: string;
  total_logs: number;
};

const COLORS = ["#0088FE", "#FF8042"];

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/metrics/summary");
      setSummary(res.data);
      setLastUpdated(new Date().toLocaleString()); // ✅ Set current time
    } catch (err) {
      console.error("Failed to fetch summary metrics:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSummary(); // Initial load
  }, []);

  const latencyData =
    summary && summary.latencies
      ? Object.entries(summary.latencies).map(([mode, value]) => ({
          name: mode,
          value,
        }))
      : [];

  const throughputData =
    summary && summary.requests
      ? Object.entries(summary.requests).map(([mode, value]) => ({
          name: mode,
          requests: value,
        }))
      : [];

  const attackData =
    summary?.attack_detection_rate &&
    !isNaN(parseFloat(summary.attack_detection_rate))
      ? [
          {
            name: "Detected",
            value: parseFloat(summary.attack_detection_rate),
          },
          {
            name: "Undetected",
            value: 100 - parseFloat(summary.attack_detection_rate),
          },
        ]
      : [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 4 }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoT Device Management
          </Typography>
          <Button
            color="inherit"
            onClick={() => (window.location.href = "/devices")}
          >
            Devices
          </Button>
          <Button color="inherit" onClick={() => (window.location.href = "/")}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Dashboard - System Performance and Security Metrics
      </Typography>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button variant="outlined" onClick={fetchSummary}>
          Refresh Metrics
        </Button>
        {lastUpdated && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Last updated: {lastUpdated}
          </Typography>
        )}
      </Box>

      {/* {lastUpdated && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Last updated: {lastUpdated}
        </Typography>
      )} */}

      {loading ? (
        <Typography align="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Typography>
      ) : (
        <>
          {/* Grid for Charts */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: 4,
              maxWidth: "1200px",
              mx: "auto",
              mt: 4,
            }}
          >
            {/* Latency Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Average Latency (sec)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Throughput Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Request Count by Mode
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attack Detection Pie */}
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Attack Detection Rate
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={attackData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {attackData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Table for Metrics */}
          <Box
            sx={{
              mt: 6,
              maxWidth: "1200px",
              mx: "auto",
              bgcolor: "#fff",
              boxShadow: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" align="center" gutterBottom sx={{ p: 2 }}>
              Metrics Summary Table
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Average Latency (Insecure)</TableCell>
                    <TableCell>{summary?.latencies?.insecure ?? "—"}</TableCell>
                    <TableCell>sec</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Latency (Secure)</TableCell>
                    <TableCell>{summary?.latencies?.secure ?? "—"}</TableCell>
                    <TableCell>sec</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Requests</TableCell>
                    <TableCell>{summary?.total_logs ?? "—"}</TableCell>
                    <TableCell>Requests</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Attack Detection Rate</TableCell>
                    <TableCell>
                      {summary?.attack_detection_rate ?? "—"}
                    </TableCell>
                    <TableCell>%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
