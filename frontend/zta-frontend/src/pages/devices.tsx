import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  AppBar,
  Toolbar,
  TextField,
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../api/axios"; // Axios instance

type Device = {
  device_id: string;
  device_type: string;
  mode: string;
};

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]); // State for devices
  const [open, setOpen] = useState(false); // State for Add Device dialog
  const [newDevice, setNewDevice] = useState<Device>({
    device_id: "",
    device_type: "thermostat",
    mode: "insecure",
  }); // State for new device
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

  // Fetch devices from the backend
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/devices");
      setDevices(response.data);
    } catch {
      setErrorMessage("Failed to fetch devices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Add a new device to the backend
  const handleAddDevice = async () => {
    try {
      await axios.post("/devices", newDevice);
      setSuccessMessage("Device added successfully!");
      fetchDevices(); // Re-fetch devices
      handleCloseDialog(); // Close dialog
    } catch {
      setErrorMessage("Failed to add device. Please try again.");
    }
  };

  // Remove a device from the backend
  const handleRemoveDevice = async (device_id: string) => {
    try {
      await axios.delete(`/devices/${device_id}`);
      setSuccessMessage("Device removed successfully!");
      fetchDevices(); // Re-fetch devices
    } catch {
      setErrorMessage("Failed to remove device. Please try again.");
    }
  };

  // Close dialog and reset newDevice state
  const handleCloseDialog = () => {
    setOpen(false);
    setNewDevice({
      device_id: "",
      device_type: "thermostat",
      mode: "insecure",
    });
  };

  // Close Snackbar notifications
  const handleCloseSnackbar = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 4 }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoT Device Management
          </Typography>
          <Button
            color="inherit"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => (window.location.href = "/")}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        color="primary"
        gutterBottom
        sx={{ mt: 4 }}
      >
        Devices Management
      </Typography>

      {/* Add Device Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Device
        </Button>
      </Box>

      {/* Device Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : devices.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: "gray" }}>
          No devices found. Add a new device to get started.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device, index) => (
                <TableRow key={index}>
                  <TableCell>{device.device_id}</TableCell>
                  <TableCell>{device.device_type}</TableCell>
                  <TableCell>{device.mode}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveDevice(device.device_id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Device Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Device ID"
            fullWidth
            value={newDevice.device_id}
            onChange={(e) =>
              setNewDevice({ ...newDevice, device_id: e.target.value })
            }
          />
          <Typography sx={{ mt: 2 }}>Device Type</Typography>
          <Select
            fullWidth
            value={newDevice.device_type}
            onChange={(e) =>
              setNewDevice({ ...newDevice, device_type: e.target.value })
            }
          >
            <MenuItem value="thermostat">Thermostat</MenuItem>
            <MenuItem value="camera">Camera</MenuItem>
            <MenuItem value="lock">Lock</MenuItem>
          </Select>

          <Typography sx={{ mt: 2 }}>Mode</Typography>
          <Select
            fullWidth
            value={newDevice.mode}
            onChange={(e) =>
              setNewDevice({ ...newDevice, mode: e.target.value })
            }
          >
            <MenuItem value="insecure">Insecure</MenuItem>
            <MenuItem value="secure">Secure</MenuItem>
            <MenuItem value="replay">Replay</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddDevice} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!errorMessage || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        {errorMessage ? (
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default Devices;
