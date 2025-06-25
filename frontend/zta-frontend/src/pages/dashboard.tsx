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
} from "@mui/material";

// Sample data for charts
const latencyData = [
  { name: "1 min", insecure: 200, secure: 250 },
  { name: "2 min", insecure: 210, secure: 230 },
  { name: "3 min", insecure: 190, secure: 220 },
];

const throughputData = [
  { name: "1 min", requests: 100 },
  { name: "2 min", requests: 120 },
  { name: "3 min", requests: 90 },
];

const attackData = [
  { name: "Detected", value: 98 },
  { name: "Undetected", value: 2 },
];

const COLORS = ["#0088FE", "#FF8042"];

const Dashboard = () => {
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

      {/* Header */}
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Dashboard - System Performance and Security Metrics
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 4,
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Latency Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Latency (ms)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="insecure"
                  stroke="#FF8042"
                  name="Insecure"
                />
                <Line
                  type="monotone"
                  dataKey="secure"
                  stroke="#0088FE"
                  name="Secure"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Throughput (Requests per Second)
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

        {/* Attack Detection Chart */}
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

      {/* Table Section */}
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
          Metrics Table
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
                <TableCell>200</TableCell>
                <TableCell>ms</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Latency (Secure)</TableCell>
                <TableCell>250</TableCell>
                <TableCell>ms</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Throughput</TableCell>
                <TableCell>100</TableCell>
                <TableCell>RPS</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Attack Detection Rate</TableCell>
                <TableCell>98%</TableCell>
                <TableCell>%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
