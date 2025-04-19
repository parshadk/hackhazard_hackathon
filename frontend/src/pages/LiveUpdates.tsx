import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Newspaper, ArrowUpRight, ArrowDownRight, Link } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import { format, isToday, isYesterday } from 'date-fns';

interface StockData {
  symbol: string;
  price: number;
  time: string;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')} IST`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')} IST`;
  } else {
    return `${format(date, 'dd MMM yyyy, h:mm a')} IST`;
  }
};

const LiveClock = () => {
  const formatTime = (
    locale: string,
    timeZone: string,
    withSeconds: boolean,
    ampmCase: 'upper' | 'lower'
  ) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...(withSeconds && { second: '2-digit' }),
    };

    const timeStr = new Date().toLocaleTimeString(locale, options);
    const [time, modifier] = timeStr.split(' ');
    const formattedModifier = ampmCase === 'upper' ? modifier.toUpperCase() : modifier.toLowerCase();
    return `${time} ${formattedModifier}`;
  };

  const [currentTime, setCurrentTime] = useState(() =>
    formatTime('en-IN', 'Asia/Kolkata', true, 'upper')
  );
  const [usTime, setUsTime] = useState(() =>
    formatTime('en-US', 'America/New_York', false, 'lower')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime('en-IN', 'Asia/Kolkata', true, 'upper'));
      setUsTime(formatTime('en-US', 'America/New_York', false, 'lower'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-right leading-tight">
      <div>
        {currentTime} <span className="font-medium">(IST)</span>
      </div>
      <div className="text-xs italic text-white-500">
        {usTime} <span>(US)</span>
      </div>
    </div>
  );
};

const LiveUpdates: React.FC<{ onShowHistory: () => void }> = ({ onShowHistory }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [stockLimit] = useState<number>(10);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [errorNews, setErrorNews] = useState(false);

  const tickerOrder = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX'];
  const socketRef = useRef<WebSocket | null>(null);
  const newsSocketRef = useRef<WebSocket | null>(null); // Ref for news socket
  const hasInitialized = useRef(false);

  // WebSocket logic for live stock updates
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

  // WebSocket logic for live news updates
  const initializeNewsWebSocket = () => {
    setLoadingNews(true);
    setErrorNews(false);
    const socket = new WebSocket('ws://localhost:3000?type=news');
    newsSocketRef.current = socket;

    socket.onopen = () => console.log('🟢 WebSocket opened for news');
    socket.onmessage = (event) => {
      setLoadingNews(false);
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data.length > 0) {
          const latest = data.slice(0, 5);
          const isSame = JSON.stringify(latest) === JSON.stringify(latestNews);
          if (!isSame) {
            setLatestNews(latest);
          }
        }
      } catch (err) {
        setErrorNews(true);
      }
    };
    socket.onerror = () => {
      setErrorNews(true);
      setLoadingNews(false);
    };
    socket.onclose = () => {
      console.log('🔌 WebSocket closed for news.');
      setErrorNews(true);
    };
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeNewsWebSocket();
    }

    return () => {
      if (newsSocketRef.current && newsSocketRef.current.readyState === WebSocket.OPEN) {
        newsSocketRef.current.close();
      }
      hasInitialized.current = false;
    };
  }, []);

  return (
    <PageContainer title="Live Updates" description="View real-time updates">
      <div className="mb-10">
        {/* Hero Section with Live Clock inside */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-10 shadow-lg text-center relative">
          <div className="absolute top-4 right-6">
            <LiveClock />
          </div>
          <h1 className="text-lg font-medium">Live Market & News Updates</h1>
          <p className="text-center text-sm text-blue-100">Stay updated with real-time stock data and financial news.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Stocks */}
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
            <div className="border border-gray-200 p-4 rounded-lg mt-5 text-left">
              <p className="text-[11px] text-gray-400 italic">Error loading stocks. Please check your connection or try again later.</p>
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

        {/* Live News */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Newspaper size={24} className="text-green-600" />
            Live Financial News
          </h2>
          {loadingNews ? (
            <p className="text-center text-sm text-gray-600">Loading...</p>
          ) : errorNews ? (
            <div className="border border-gray-200 p-4 rounded-lg mt-5 text-left">
              <p className="text-[11px] text-gray-400 italic">Error loading news. Please check your connection or try again later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {latestNews.map((item) => (
                <div key={item.id} className="bg-gray-50 border border border-gray-300 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800">{item.headline}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(item.datetime)}</p>
                  <p className="text-xs text-gray-700 mt-2">{item.summary}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 inline-block">
                    <Link size={14} className="text-xs text-blue-500 mt-1 inline-block" /> Read more
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
};

export default LiveUpdates;
