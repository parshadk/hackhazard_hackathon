import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import LiveClock from '../components/liveupdates/LiveClock';
import LiveStocks from '../components/liveupdates/LiveStocks';
import LiveNews from '../components/liveupdates/LiveNews';

const LiveUpdates: React.FC = () => {
  const navigate = useNavigate(); // Add this hook

  return (
    <div className="p-4 md:p-6">
      <div className="mb-10">
        <section className="bg-gradient-to-r text-indigo-600 bg-indigo-600 text-white rounded-2xl p-10 shadow-lg text-center relative">
          <div className="absolute top-4 right-6">
            <LiveClock />
          </div>
          <h1 className="text-lg font-medium">Live Market & News Updates</h1>
          <p className="text-center text-sm text-blue-100">Stay updated with real-time stock data and financial news.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveStocks onShowHistory={() => navigate('/stock-history')} /> {/* Update this line */}
        <LiveNews />
      </div>
    </div>
  );
};

export default LiveUpdates;