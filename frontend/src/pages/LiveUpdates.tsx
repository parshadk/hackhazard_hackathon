import React, { useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import LiveClock from '../components/liveupdates/LiveClock'
import LiveStocks from '../components/liveupdates/LiveStocks'
import LiveNews from '../components/liveupdates/LiveNews'

const LiveUpdates: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('live') 

  const handleShowHistory = () => {
    setCurrentPage('stockHistory')
  }

  return (
    <PageContainer title="Live Updates" description="View real-time updates">
      <div className="mb-10">
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-10 shadow-lg text-center relative">
          <div className="absolute top-4 right-6">
            <LiveClock />
          </div>
          <h1 className="text-lg font-medium">Live Market & News Updates</h1>
          <p className="text-center text-sm text-blue-100">Stay updated with real-time stock data and financial news.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveStocks onShowHistory={handleShowHistory} />
        <LiveNews />
      </div>
    </PageContainer>
  )
}

export default LiveUpdates
