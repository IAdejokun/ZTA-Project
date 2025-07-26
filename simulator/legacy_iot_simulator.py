import requests
import time
import hashlib
import random
import json
from datetime import datetime

class LegacyIoTDevice:
    def __init__(self, device_id, device_type, shared_secret, firmware_version="1.0.0"):
        self.device_id = device_id
        self.device_type = device_type
        self.shared_secret = shared_secret
        self.firmware_version = firmware_version
        self.token = None
        self.last_token_time = 0
        self.sensor_data = self._initialize_sensor_data()

    def _initialize_sensor_data(self):
        base_data = {
            "timestamp": None,
            "device_id": self.device_id,
            "firmware": self.firmware_version,
        }
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
        current_time = int(time.time())
        timestamp = current_time // 300
        token_data = f"{self.device_id}{self.shared_secret}{timestamp}"
        token = hashlib.sha256(token_data.encode()).hexdigest()[:16]
        self.token = token
        self.last_token_time = current_time
        print(f"[Simulator] {self.device_id} | Token: {token}")
        return token

    def simulate_sensor_reading(self):
        self.sensor_data["timestamp"] = datetime.now().isoformat()
        if self.device_type == "thermostat":
            self.sensor_data["temperature"] = max(15, min(30, self.sensor_data["temperature"] + random.uniform(-0.5, 0.5)))
            self.sensor_data["humidity"] = max(0, min(100, self.sensor_data["humidity"] + random.uniform(-2, 2)))
        elif self.device_type == "camera":
            self.sensor_data["motion_detected"] = random.random() < 0.1
        elif self.device_type == "lock":
            self.sensor_data["battery_level"] = max(0, self.sensor_data["battery_level"] - random.uniform(0.01, 0.05))
        return {
            "device_id": self.device_id,
            "device_type": self.device_type,
            **self.sensor_data,
        }

    def send_insecure_request(self, gateway_url, endpoint):
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
        payload = self.simulate_sensor_reading()
        url = f"http://{gateway_url}/{endpoint}"
        headers = {
            "X-Access-Token": self.token,
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            return self.log_response(response, "replay", payload)
        except requests.exceptions.RequestException as e:
            print(f"[{self.device_id}] Replay attack failed: {e}")
            return None

    def log_response(self, response, mode, payload):
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
        self.gateway_url = gateway_url
        self.devices = []

    def fetch_devices_from_backend(self):
        try:
            response = requests.get(f"http://{self.gateway_url}/api/devices")
            response.raise_for_status()
            devices = response.json()
            for device in devices:
                if "shared_secret" in device:
                    self.devices.append(LegacyIoTDevice(
                        device_id=device["device_id"],
                        device_type=device["device_type"],
                        shared_secret=device["shared_secret"],
                        firmware_version="1.0.0"
                        ))
                    self.devices[-1].mode = device["mode"]  # ✅ Inject mode from backend
            print(f"[Simulator] {len(self.devices)} devices fetched from backend.")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching devices: {e}")

    def run_simulation_cycle(self):
        """Run a simulation cycle based on each device's mode."""
        for device in self.devices:
            if device.mode == "insecure":
                device.send_insecure_request(self.gateway_url, "api/legacy/insecure")
            elif device.mode == "secure":
                device.send_secure_request(self.gateway_url, "api/legacy/secure")
            elif device.mode == "replay":
                # Generate a valid token once so it can be reused for the replay
                # attack. Without this step ``send_replay_attack`` would send a
                # ``None`` token on the first cycle, resulting in an invalid
                # request rather than a replay of a previously issued token.
                if device.token is None:
                    device.send_secure_request(self.gateway_url, "api/legacy/secure")
                device.send_replay_attack(self.gateway_url, "api/legacy/replay")


    def run_continuous_simulation(self, cycles=5, interval=30):
        with open("metrics_log.csv", "w") as log_file:
            log_file.write("device_id,mode,status_code,response_time,payload_size\n")
        for _ in range(cycles):
            self.run_simulation_cycle()
            time.sleep(interval)


if __name__ == "__main__":
    simulator = LegacyIoTFleetSimulator("localhost:8000")
    simulator.fetch_devices_from_backend()
    simulator.run_continuous_simulation(cycles=5, interval=30)
