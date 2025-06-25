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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Dashboard - System Performance and Security Metrics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Latency Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Latency (ms)
          </h3>
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
        </div>

        {/* Throughput Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Throughput (Requests per Second)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Detection Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Attack Detection Rate
          </h3>
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
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-10 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Metrics Table
        </h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Metric</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Average Latency (Insecure)
              </td>
              <td className="border border-gray-300 px-4 py-2">200</td>
              <td className="border border-gray-300 px-4 py-2">ms</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Average Latency (Secure)
              </td>
              <td className="border border-gray-300 px-4 py-2">250</td>
              <td className="border border-gray-300 px-4 py-2">ms</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Throughput</td>
              <td className="border border-gray-300 px-4 py-2">100</td>
              <td className="border border-gray-300 px-4 py-2">RPS</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Attack Detection Rate
              </td>
              <td className="border border-gray-300 px-4 py-2">98%</td>
              <td className="border border-gray-300 px-4 py-2">%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
