import React, { useState, useEffect, useRef } from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../common/Button';

interface StockData {
  symbol: string;
  price: number;
  time: string;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

const LiveStocks: React.FC<{ onShowHistory: () => void }> = ({ onShowHistory }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [stockLimit] = useState<number>(10);
  const tickerOrder = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX'];
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000?type=stocks');
    socket.onopen = () => {
      console.log("🟢 WebSocket opened for stocks");
      setConnectionError(false);
    };
    socket.onmessage = (event) => {
      const fetchedStocks = JSON.parse(event.data);
      if (Array.isArray(fetchedStocks)) {
        const updatedStocks = fetchedStocks.map((stock) => ({
          symbol: stock.symbol,
          price: stock.price,
          time: stock.time || new Date().toISOString(),
          high: stock.high,
          low: stock.low,
          open: stock.open,
          previousClose: stock.previousClose,
        }));
        setStocks((prevStocks) => {
          const latestMap = new Map(prevStocks.map(s => [s.symbol, s]));
          for (const stock of updatedStocks) {
            latestMap.set(stock.symbol, stock);
          }
          return Array.from(latestMap.values()).sort(
            (a, b) => tickerOrder.indexOf(a.symbol) - tickerOrder.indexOf(b.symbol)
          );
        });
        setLoadingStocks(false);
      } else {
        setStocks([]);
        setLoadingStocks(false);
      }
    };
    socket.onerror = () => {
      setConnectionError(true);
      setLoadingStocks(false);
      setStocks([]);
    };
    socket.onclose = () => {
      console.log("🔌 WebSocket closed for stocks.");
      setConnectionError(true);
      setLoadingStocks(false);
    };

    socketRef.current = socket;

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, []);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LineChart size={24} className="text-blue-600" />
          Live Stock Market
        </h2>
        <Button size="sm" className="border-white text-white hover:bg-blue-700" onClick={onShowHistory}>
          Show History
        </Button>
      </div>
      {connectionError ? (
        <div>
          <p className="text-[12px] text-red-400 font-medium italic">
            Error loading stocks. Please check your connection or try again later.
          </p>
        </div>
      ) : loadingStocks ? (
        <p className="text-center text-sm text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stocks.slice(0, stockLimit).map((stock, index) => {
            const price = stock.price?.toFixed(2) ?? '—';
            const open = stock.open?.toFixed(2) ?? '—';
            const close = stock.previousClose?.toFixed(2) ?? '—';
            const high = stock.high?.toFixed(2) ?? '—';
            const low = stock.low?.toFixed(2) ?? '—';
            const change = (stock.previousClose !== undefined)
              ? (stock.price - stock.previousClose).toFixed(2)
              : null;
            const percentChange = (stock.previousClose !== undefined)
              ? (((stock.price - stock.previousClose) / stock.previousClose) * 100).toFixed(2)
              : null;
            const isProfit = change !== null && parseFloat(change) > 0;
            const isLoss = change !== null && parseFloat(change) < 0;
            const colorClass = isProfit ? 'text-green-500' : isLoss ? 'text-red-500' : 'text-gray-500';
            const sign = isProfit ? '+' : isLoss ? '' : '';

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">{stock.symbol}</h3>
                  <p className="text-xl font-semibold text-gray-900 mb-1">${price}</p>
                  {change !== null && percentChange !== null && (
                    <p className={`text-xs ${colorClass} mb-1 flex items-center gap-1`}>
                      {sign}{Number(change).toFixed(2)} ({sign}{Number(percentChange).toFixed(2)}%)
                      {isProfit && <ArrowUpRight size={14} className="text-green-600" />}
                      {isLoss && <ArrowDownRight size={14} className="text-red-600" />}
                      <span className="ml-1 text-gray-500 italic">today</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 italic">
                    {format(new Date(stock.time), 'dd MMM, h:mm a')} IST
                  </p>
                </div>
                <div className="mt-4 text-xs text-gray-600 leading-tight italic">
                  <div className="flex justify-between">
                    <span className="text-gray-500">High: ${high}</span>
                    <span className="text-gray-500" >Open: ${open}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Low: ${low}</span>
                    <span className="text-gray-500">Close: ${close}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LiveStocks;
