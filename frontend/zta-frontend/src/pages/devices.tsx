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
} from "@mui/material";
import axios from "../api/axios"; // Import Axios instance

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

  // Fetch devices from the backend
  useEffect(() => {
    async function fetchDevices() {
      try {
        const response = await axios.get("/devices"); // Replace with API endpoint
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    }
    fetchDevices();
  }, []);

  // Add a new device to the backend
  const handleAddDevice = async () => {
    try {
      await axios.post("/devices", newDevice); // Replace with API endpoint
      setDevices([...devices, newDevice]);
      setOpen(false);
      setNewDevice({
        device_id: "",
        device_type: "thermostat",
        mode: "insecure",
      });
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  // Remove a device from the backend
  const handleRemoveDevice = async (device_id: string) => {
    try {
      await axios.delete(`/devices/${device_id}`); // Replace with API endpoint
      setDevices(devices.filter((device) => device.device_id !== device_id));
    } catch (error) {
      console.error("Error removing device:", error);
    }
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

      {/* Add Device Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddDevice} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Devices;
