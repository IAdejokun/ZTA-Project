import requests
import time
import hashlib
import random
import json
from datetime import datetime

# Legacy IoT Device Simulator
# This module simulates legacy IoT devices that do not support modern security protocols.

# -----------------------------------------------------------------------------
# Legacy IoT Device Simulator
# This module simulates legacy IoT devices that do not support modern security.
# -----------------------------------------------------------------------------

class LegacyIoTDevice:
    def __init__(self, device_id, device_type, shared_secret, firmware_version="1.0.0"):
        """
        Initialize a legacy IoT device with basic attributes.
        """
        self.device_id = device_id
        self.device_type = device_type
        self.shared_secret = shared_secret
        self.firmware_version = firmware_version
        self.token = None
        self.last_token_time = 0

        # Initialize device-specific sensor data
        self.sensor_data = self._initialize_sensor_data()

    def _initialize_sensor_data(self):
        """
        Set up initial sensor data based on device type.
        """
        base_data = {
            "timestamp": None,
            "device_id": self.device_id,
            "firmware": self.firmware_version,
        }

        # Simulate realistic changes for each device type
        # Add type-specific fields
        
        if self.device_type == "thermostat":
            base_data.update({
                "temperature": 22.0,
                "humidity": 45.0,
                "target_temp": 24.0,
            })
        elif self.device_type == "camera":
            base_data.update({
                "motion_detected": False,
                "recording": True,
                "resolution": "720p",
            })
        elif self.device_type == "lock":
            base_data.update({
                "locked": True,
                "battery_level": 85,
            })

        return base_data

    def generate_lightweight_token(self):
        """
        Generate a simple, time-based token using SHA-256 hash.
        Token is valid for a 5-minute window.
        """
        current_time = int(time.time())
        timestamp = current_time // 300  # 5-minute validity window
        token_data = f"{self.device_id}{self.shared_secret}{timestamp}"
        token = hashlib.sha256(token_data.encode()).hexdigest()[:16]  # Truncate for simplicity
        self.token = token
        self.last_token_time = current_time
        return token

    def simulate_sensor_reading(self):
        """
        Simulate sensor readings with realistic fluctuations.
        Updates the sensor data in place.
        """
        current_time = datetime.now().isoformat()
        self.sensor_data["timestamp"] = current_time

        # Simulate realistic changes for each device type
        if self.device_type == "thermostat":
            
            # Simulate temperature fluctuations (in Celsius)
            self.sensor_data["temperature"] = max(15, min(30, self.sensor_data["temperature"] + random.uniform(-0.5, 0.5)))
           
            # Simulate humidity fluctuations (in percentage)
            self.sensor_data["humidity"] = max(0, min(100, self.sensor_data["humidity"] + random.uniform(-2, 2)))
        
        elif self.device_type == "camera":
            
             self.sensor_data["motion_detected"] = random.random() < 0.1  # 10% chance
             self.sensor_data["resolution"] = "720p"  # Legacy devices have limited resolution

        elif self.device_type == "lock":
            # Simulate battery level usage
            self.sensor_data["battery_level"] = max(0, self.sensor_data["battery_level"] - random.uniform(0.01, 0.05))


         # Include device_id and device_type in the payload
        return {
        "device_id": self.device_id,
        "device_type": self.device_type,
        **self.sensor_data,  # Merge simulated sensor data
    }

    def send_insecure_request(self, gateway_url, endpoint):
        """Send data without authentication."""
        payload = self.simulate_sensor_reading()
        url = f"http://{gateway_url}/{endpoint}"
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(url, json=payload, headers=headers)
            return self.log_response(response, "insecure", payload)
        except requests.exceptions.RequestException as e:
            print(f"[{self.device_id}] Insecure request failed: {e}")
            return None

    def send_secure_request(self, gateway_url, endpoint):
        """Send authenticated data. Send sensor data with a lightweight authentication token."""
        payload = self.simulate_sensor_reading()
        token = self.generate_lightweight_token()
        url = f"http://{gateway_url}/{endpoint}"
        headers = {
            "X-Access-Token": token,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            return self.log_response(response, "secure", payload)
        except requests.exceptions.RequestException as e:
            print(f"[{self.device_id}] Secure request failed: {e}")
            return None

    def send_replay_attack(self, gateway_url, endpoint):
        """Simulate a replay attack by reusing a previously generated token."""
        payload = self.simulate_sensor_reading()
        url = f"http://{gateway_url}/{endpoint}"
        headers = {
            "X-Access-Token": self.token,  # Reuse the old token
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            return self.log_response(response, "replay", payload)
        except requests.exceptions.RequestException as e:
            print(f"[{self.device_id}] Replay attack failed: {e}")
            return None

    def log_response(self, response, mode, payload):
        """Log the metrics of each request to a CSV File."""
        log_data = {
            "device_id": self.device_id,
            "mode": mode,
            "status_code": response.status_code if response else None,
            "response_time": response.elapsed.total_seconds() if response and response.ok else None,
            "payload_size": len(json.dumps(payload))
        }

        with open("metrics_log.csv", "a") as log_file:
            log_file.write(
                f"{log_data['device_id']},{log_data['mode']},{log_data['status_code']},"
                f"{log_data['response_time']},{log_data['payload_size']}\n"
            )
        return log_data


class LegacyIoTFleetSimulator:
    def __init__(self, gateway_url="localhost:8000"):
        """
        Initialize the fleet simulator with a gateway URL.
        """
        self.gateway_url = gateway_url
        self.devices = []

    def add_device(self, device):
        """Add a legacy IoT device to the fleet."""
        self.devices.append(device)

    def create_typical_legacy_fleet(self):
        """
        Add a sample set of legacy devices to the fleet.
        """
        self.add_device(LegacyIoTDevice("thermo-001", "thermostat", "d8a5fd2c"))
        self.add_device(LegacyIoTDevice("cam-001", "camera", "4b1e9f0a"))
        self.add_device(LegacyIoTDevice("lock-001", "lock", "7c3f6e91"))

    def run_simulation_cycle(self):
        """
        Run a single simulation cycle for all devices:
        - Insecure request
        - Secure request
        - Replay attack
        """
        for device in self.devices:
            device.send_insecure_request(self.gateway_url, "api/legacy/insecure")
            device.send_secure_request(self.gateway_url, "api/legacy/secure")
            device.send_replay_attack(self.gateway_url, "api/legacy/replay")

    def run_continuous_simulation(self, cycles=10, interval=30):
        """Run continuous simulation."""
        # Write the CSV header
        with open("metrics_log.csv", "w") as log_file:
            log_file.write("device_id,mode,status_code,response_time,payload_size\n")

        # Run the simulation cycles
        for _ in range(cycles):
            self.run_simulation_cycle()
            time.sleep(interval)


# -----------------------------------------------------------------------------
# Main execution: create a fleet, simulate, and log results
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    simulator = LegacyIoTFleetSimulator("localhost:8000")
    simulator.create_typical_legacy_fleet()
    simulator.run_continuous_simulation(cycles=5, interval=30)
