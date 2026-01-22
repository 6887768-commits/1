
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ShieldCheck, Zap } from 'lucide-react';
import { storage } from '../services/storage';

const Home: React.FC = () => {
  const currentUser = storage.getCurrentSession();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Manage your community with <span className="text-indigo-600">precision.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Welcome to UserHub Pro, the enterprise-grade solution for tracking registered members, managing roles, and maintaining a secure ecosystem.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {currentUser ? (
              <Link
                to="/users"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                View Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">User Management</h3>
          <p className="mt-3 text-gray-600">Easily browse and manage all registered accounts in a single, clean interface.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Secure Auth</h3>
          <p className="mt-3 text-gray-600">State-of-the-art authentication flow ensuring your community's data remains protected.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Real-time Insights</h3>
          <p className="mt-3 text-gray-600">Get instant access to registration metrics and user distribution statistics.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
