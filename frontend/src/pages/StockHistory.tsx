import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { LineChart as LineChartIcon } from 'lucide-react';
import LineGraph from '../components/stockhistory/LineGraph';
import { server } from '@/main';

interface StockData {
  symbol: string;
  price: number;
  timestamp: string;
}

const StockHistory: React.FC = () => {
  const navigate = useNavigate();

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
        const response = await fetch(server + '/api/stocks?_=' + Date.now(), {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const fetchedStocks: StockData[] = await response.json();
        setStocks(fetchedStocks);
        console.log(fetchedStocks);
        
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

  return (
    <div className="p-4 md:p-6">
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LineChartIcon size={24} className="text-blue-600" />
            Stock History
          </h2>
          <Button
            onClick={() => navigate('/live-updates')}
            size="sm"
            className="border-white text-white hover:bg-blue-700"
          >
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
              <p className="text-[12px] text-red-400 font-medium italic">Error loading stocks. Please check your connection or try again later.</p>
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
                            <div><strong>Price:</strong> ${stock.price}</div>
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
                  <LineGraph data={chartData} selectedSymbol={selectedSymbol} />
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default StockHistory;