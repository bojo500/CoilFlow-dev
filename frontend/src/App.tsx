import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import TodayLoads from './pages/TodayLoads';
import TomorrowLoads from './pages/TomorrowLoads';
import Coils from './pages/Coils';
import Locations from './pages/Locations';
import Stats from './pages/Stats';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <nav className="bg-primary-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="text-2xl font-bold">
                  CoilFlow
                </Link>
                <div className="flex gap-6">
                  <Link
                    to="/"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/today"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Today
                  </Link>
                  <Link
                    to="/tomorrow"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Tomorrow
                  </Link>
                  <Link
                    to="/coils"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Coils
                  </Link>
                  <Link
                    to="/locations"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Locations
                  </Link>
                  <Link
                    to="/stats"
                    className="hover:text-primary-200 transition-colors"
                  >
                    Stats
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/today" element={<TodayLoads />} />
              <Route path="/tomorrow" element={<TomorrowLoads />} />
              <Route path="/coils" element={<Coils />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
