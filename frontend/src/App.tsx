import { useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetails';
import Quiz from './pages/Quiz';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MobileSidebar from './components/layout/MobileSidebar';
import StockHistory from './pages/StockHistory';
import LiveUpdates from './pages/LiveUpdates';



function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user data
  const userData = {
    xp: 350,
    maxXp: 500,
    coins: 375,
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Reset selected items when navigating to main pages
    if (['dashboard', 'lessons', 'quizzes', 'wallet', 'profile','live'].includes(page)) {
      setSelectedLessonId(null);
      setSelectedQuizId(null);
    }
  };

  const handleGetStarted = () => {
    //change to login or signup page
    setCurrentPage('dashboard');
  };

  const handleLogin = () => {
    //change to login or signup page
    setCurrentPage('dashboard');
  };

  const handleViewLesson = (id: string) => {
    setSelectedLessonId(id);
    setCurrentPage('lessonDetail');
  };

  const handleStartQuiz = (id: string) => {
    setSelectedQuizId(id);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    console.log(`Quiz completed: ${score}/${totalQuestions}`);
    // save the quiz results and update user XP/coins
  };

  const handleShowHistory = () => {
    setCurrentPage('stockHistory');  // Navigate to StockHistory page
  };
  

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onGetStarted={handleGetStarted} 
            onLogin={handleLogin} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            onViewLesson={handleViewLesson} 
            onStartQuiz={handleStartQuiz} 
          />
        );
      case 'lessons':
        return (
          <Lessons 
            onStartLesson={handleViewLesson} 
          />
        );
      case 'lessonDetail':
        return (
          <LessonDetail
            lessonId={selectedLessonId || '1'}
            onBack={() => handleNavigate('lessons')}
            onStartQuiz={handleStartQuiz}
          />
        );
      case 'quiz':
        return (
          <Quiz
            quizId={selectedQuizId || '1'}
            onBack={() => handleNavigate(selectedLessonId ? 'lessonDetail' : 'lessons')}
            onComplete={handleQuizComplete}
          />
        );
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      case 'live':
        return (
          <LiveUpdates onShowHistory={handleShowHistory} />
        );
      case 'stockHistory':
        return (
          <StockHistory onBack={() => handleNavigate('live')} />
        );
        
      default:
        return <Dashboard onViewLesson={handleViewLesson} onStartQuiz={handleStartQuiz} />;
    }
  };

  // hide sidebar/topbar on landing page
  if (currentPage === 'landing') {
    return renderPageContent();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activePage={currentPage} 
        onNavigate={handleNavigate} 
      />
      
      <Topbar 
        xp={userData.xp} 
        maxXp={userData.maxXp} 
        coins={userData.coins} 
        toggleSidebar={() => setSidebarOpen(true)} 
      />
      
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activePage={currentPage}
        onNavigate={handleNavigate}
      />
      
      {renderPageContent()}
    </div>
  );
}

export default App;