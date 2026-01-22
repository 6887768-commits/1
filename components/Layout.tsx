
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, User as UserIcon, LogIn, UserPlus, Download } from 'lucide-react';
import { storage } from '../services/storage';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    // 检查是否已经可以安装
    if (window.deferredPrompt) {
      setShowInstallBtn(true);
    }

    // 监听来自 index.tsx 的自定义事件
    const handleInstallAvailable = () => {
      setShowInstallBtn(true);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    return () => window.removeEventListener('pwa-install-available', handleInstallAvailable);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;

    // 显示安装提示
    promptEvent.prompt();
    
    // 等待用户的选择
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // 无论结果如何，清理 deferredPrompt
    window.deferredPrompt = null;
    setShowInstallBtn(false);
  };

  const handleLogout = async () => {
    await storage.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">U</div>
          <span className="text-xl font-bold text-gray-800">UserHub <span className="text-indigo-600">Pro</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <LayoutDashboard size={20} /> Home
          </Link>
          <Link to="/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/users') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users size={20} /> Registered Users
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
            {showInstallBtn && (
              <button 
                onClick={handleInstallClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-colors border border-green-200"
              >
                <Download size={20} /> Install App
              </button>
            )}

            {!currentUser ? (
              <>
                <Link to="/login" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/login') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <LogIn size={20} /> Login
                </Link>
                <Link to="/register" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/register') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <UserPlus size={20} /> Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={20} /> Logout
              </button>
            )}
          </div>
        </nav>

        {currentUser && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                {currentUser.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
