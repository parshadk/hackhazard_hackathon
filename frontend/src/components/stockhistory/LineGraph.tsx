import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps
} from 'recharts';

interface StockData {
  symbol: string;
  price: number;
  timestamp: string;
}

interface LineGraphProps {
  data: StockData[];
  selectedSymbol: string;
}

const renderXAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
  const date = new Date(payload.value);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
        <tspan x="0" dy="0">{time}</tspan>
        <tspan x="0" dy="12">{`${day} ${month}`}</tspan>
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active) {
    if (!payload || payload.length === 0 || payload[0].value === null) {
      return (
        <div className="bg-white p-3 rounded-md border border-gray-300 text-sm shadow-sm">
          <div className="text-gray-600 italic">Data not available</div>
        </div>
      );
    }

    const price = `${payload[0].value?.toFixed(2)} USD`;
    const date = new Date(label as string);
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const dateStr = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="bg-white p-3 rounded-md border border-gray-300 text-sm shadow-sm">
        <div className="font-semibold text-black">{price}</div>
        <div className="text-gray-600 italic">{`${time} ${dateStr}`}</div>
      </div>
    );
  }

  return null;
};

const LineGraph: React.FC<LineGraphProps> = ({ data, selectedSymbol }) => {
  return (
    <>
      <h3 className="text-md font-semibold text-gray-800 mb-2 text-center tracking-wide">
        {selectedSymbol} Price Trend History
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[...data].reverse()}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <defs>
              <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#3B82F6" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              vertical={false} 
              horizontal={true}
              stroke="rgba(229, 231, 235, 0.5)"
            />

            <XAxis
              dataKey="timestamp"
              interval={Math.ceil(data.length / 5)}
              axisLine={false}
              tickLine={false}
              height={50}
              tick={renderXAxisTick}
              tickMargin={15}
            />

            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              fontSize={10}
              stroke="#999"
              width={40}
              padding={{ bottom: 10 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
              activeDot={{
                r: 6,
                stroke: "#3B82F6",
                strokeWidth: 2,
                fill: "#FFFFFF",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default LineGraph;