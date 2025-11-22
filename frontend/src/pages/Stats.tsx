import React, { useState } from 'react';
import { useStats } from '../api/queries';

const Stats: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [groupBy, setGroupBy] = useState<'week' | 'month' | 'year'>('week');
  const [showResults, setShowResults] = useState(false);

  const { data: stats, isLoading } = useStats(from, to, groupBy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>

        {/* Filter Form */}
        <div className="card mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group By
                </label>
                <select
                  value={groupBy}
                  onChange={(e) =>
                    setGroupBy(e.target.value as 'week' | 'month' | 'year')
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              View Reports
            </button>
          </form>
        </div>

        {/* Results */}
        {showResults && stats && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-blue-50 border-l-4 border-blue-600">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Total Coils
                </h3>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.summary.total_coils}
                </p>
              </div>

              <div className="card bg-green-50 border-l-4 border-green-600">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Trucks Shipped
                </h3>
                <p className="text-3xl font-bold text-green-900">
                  {stats.summary.trucks_shipped}
                </p>
              </div>

              <div className="card bg-red-50 border-l-4 border-red-600">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Scrap Coils
                </h3>
                <p className="text-3xl font-bold text-red-900">
                  {stats.summary.scrap_coils}
                </p>
              </div>
            </div>

            {/* Period Breakdown */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Period Breakdown
              </h2>
              {stats.periods && stats.periods.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Period
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Loads
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Coils
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Scrap
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.periods.map((period: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm">{period.period}</td>
                          <td className="px-4 py-3 text-sm">{period.loads}</td>
                          <td className="px-4 py-3 text-sm">{period.coils}</td>
                          <td className="px-4 py-3 text-sm">{period.scrap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No data for selected period</p>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12 text-gray-500">
            Loading statistics...
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
