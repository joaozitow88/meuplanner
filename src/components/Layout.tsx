import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, BarChart2, HelpCircle, AlertTriangle, AlignJustify, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { NotificationBell } from './NotificationBell';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Início' },
  { path: '/schedule', icon: Calendar, label: 'Cronograma' },
  { path: '/revisions', icon: BookOpen, label: 'Revisões' },
  { path: '/statistics', icon: BarChart2, label: 'Estatísticas' },
  { path: '/questions', icon: HelpCircle, label: 'Questões' },
  { path: '/mistakes', icon: AlertTriangle, label: 'Erros' },
  { path: '/history', icon: History, label: 'Histórico' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-screen">
        <motion.aside
          initial={{ width: isSidebarOpen ? 240 : 0 }}
          animate={{ width: isSidebarOpen ? 240 : 64 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 h-full flex flex-col relative"
        >
          <div className="p-4 flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: isSidebarOpen ? 1 : 0 }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent"
            >
              StudyMaster
            </motion.h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <AlignJustify size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                    isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>
        <main className="flex-1 overflow-auto">
          <div className="p-4 border-b border-gray-800 flex justify-end items-center gap-4">
            <ThemeToggle />
            <NotificationBell />
          </div>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}