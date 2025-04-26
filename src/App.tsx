import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Revisions } from './pages/Revisions';
import { Statistics } from './pages/Statistics';
import { Questions } from './pages/Questions';
import { Mistakes } from './pages/Mistakes';
import { History } from './pages/History';
import { useThemeStore } from './store/themeStore';
import { useNotificationStore } from './store/notificationStore';

function App() {
  const initializeTheme = useThemeStore((state) => state.initialize);
  const initializeNotifications = useNotificationStore((state) => state.initialize);

  useEffect(() => {
    initializeTheme();
    initializeNotifications();
  }, [initializeTheme, initializeNotifications]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/revisions" element={<Revisions />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;