import { useState, useEffect, useRef } from 'react';
import { Newspaper, Link } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

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

const LiveNews = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [errorNews, setErrorNews] = useState(false);
  const newsSocketRef = useRef<WebSocket | null>(null);
  const hasInitialized = useRef(false);

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
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Newspaper size={24} className="text-green-600" />
        Live Financial News
      </h2>
      {loadingNews ? (
        <p className="text-center text-sm text-gray-600">Loading...</p>
      ) : errorNews ? (
        <div>
          <p className="text-[12px] text-red-400 font-medium italic">
            Error loading news. Please check your connection or try again later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {latestNews.map((item) => (
            <div key={item.id} className="bg-gray-50 border border-gray-300 p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800">{item.headline}</h3>
              <p className="text-xs text-gray-500 mt-1">{formatDate(item.datetime)}</p>
              <p className="text-xs text-gray-700 mt-2">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 mt-1 inline-block"
              >
                <Link size={14} className="inline-block" /> Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LiveNews;
