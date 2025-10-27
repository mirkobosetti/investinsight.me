import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'
const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Page C', uv: 200, pv: 2400, amt: 2400 }
]

const MyChart = () => (
  <LineChart
    style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
    responsive
    data={data}
    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  >
    <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
    <Line type="monotone" dataKey="uv" stroke="purple" strokeWidth={2} name="My data series name" />
    <XAxis dataKey="name" />
    <YAxis width="auto" label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
    <Legend align="right" />
  </LineChart>
)

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <MyChart />
    </>
  )
}

export default App
