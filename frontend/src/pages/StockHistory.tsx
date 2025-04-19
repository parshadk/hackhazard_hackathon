import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import { LineChart as LineChartIcon } from 'lucide-react';
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

type StockHistoryProps = {
  onBack: () => void;
};

const StockHistory: React.FC<StockHistoryProps> = ({ onBack }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [updatesPerStock, setUpdatesPerStock] = useState<number>(5);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'history' | 'chart'>('history');

  const formatDate = (date: string): string =>
    new Date(date).toLocaleString('en-IN', { hour12: true });

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks?_=' + Date.now(), {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const fetchedStocks: StockData[] = await response.json();
        setStocks(fetchedStocks);
        setLoading(false);
        setConnectionError(false);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setConnectionError(true);
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const getGroupedStocks = () => {
    const grouped: { [symbol: string]: StockData[] } = {};
    stocks.forEach((stock) => {
      if (!grouped[stock.symbol]) grouped[stock.symbol] = [];
      grouped[stock.symbol].push(stock);
    });

    Object.keys(grouped).forEach((symbol) => {
      grouped[symbol] = grouped[symbol]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, updatesPerStock);
    });

    return grouped;
  };

  const groupedStocks = getGroupedStocks();
  const symbolCount = Object.keys(groupedStocks).length || 1;
  const chartData = selectedSymbol ? stocks.filter(stock => stock.symbol === selectedSymbol) : [];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active) {
      // Check if payload exists and has valid data
      if (!payload || payload.length === 0 || payload[0].value === null) {
        return (
          <div className="bg-white p-3 rounded-md border border-gray-300 text-sm shadow-sm">
            <div className="text-gray-600 italic">Data not available</div>
          </div>
        );
      }
  
      // Existing tooltip content for when data is available
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

  return (
    <PageContainer title="Stock History" description="View past stock price updates">
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LineChartIcon size={24} className="text-blue-600" />
            Stock History
          </h2>
          <Button onClick={onBack} size="sm" className="border-white text-white hover:bg-blue-700">
            ← Back to Live
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('history')}
          >
            Stock History
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'chart' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('chart')}
          >
            Stock Line Chart
          </button>
        </div>

        {/* Conditional Rendering */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="text-sm text-gray-700">
                <label htmlFor="updatesPerStock" className="mr-2 font-medium">
                  Updates per stock:
                </label>
                <select
                  id="updatesPerStock"
                  value={updatesPerStock}
                  onChange={(e) => setUpdatesPerStock(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  {[2, 5, 10, 15].map((value) => (
                    <option key={value} value={value}>
                      {value} Updates
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {connectionError ? (
              <p className="text-red-600 text-center text-sm">Error loading stocks. Please check your connection or try again later.</p>
            ) : loading ? (
              <p className="text-center text-sm text-gray-600">Loading...</p>
            ) : stocks.length > 0 ? (
              <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${symbolCount}, minmax(0, 1fr))` }}>
                {Object.entries(groupedStocks)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([symbol, records]) => (
                    <div key={symbol} className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm">
                      <h3 className="text-center font-semibold text-sm text-gray-800 mb-2">{symbol}</h3>
                      <div className="space-y-2">
                        {records.map((stock, index) => (
                          <div key={index} className="text-xs text-gray-700 p-2 bg-white border border-gray-200 rounded-md">
                            <div><strong>Price:</strong> ₹{stock.price}</div>
                            <div><strong>Time:</strong> {formatDate(stock.timestamp)}</div>
                          </div>
                        ))}
                        {records.length < updatesPerStock &&
                          Array.from({ length: updatesPerStock - records.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="text-xs text-gray-400 italic text-center bg-gray-100 p-2 rounded-md">
                              No data
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">No data available.</p>
            )}
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="bg-white-100 rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-700">
                <label htmlFor="symbolSelect" className="mr-2 font-medium">
                  Select stock:
                </label>
                <select
                  id="symbolSelect"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm"
                >
                  <option value="">Select a stock</option>
                  {Object.keys(groupedStocks).map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSymbol && chartData.length > 0 && (
                <>
                  <h3 className="text-md font-semibold text-gray-800 mb-2 text-center tracking-wide">
                    {selectedSymbol} Price Trend History
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[...chartData].reverse()}
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
                          interval={Math.ceil(chartData.length / 5)}
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
                          connectNulls={false} // Correct placement for Line component
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
              )}
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
};

export default StockHistory;