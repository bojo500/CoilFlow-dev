import React from 'react';
import { useLoads } from '../api/queries';
import CoilList from '../components/CoilList';

const TodayLoads: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const { data: loads, isLoading } = useLoads(today);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Today's Loads</h1>

        {loads && loads.length > 0 ? (
          <div className="space-y-6">
            {loads.map((load) => (
              <div key={load.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Load #{load.load_number}
                    </h2>
                    <p className="text-gray-600">{load.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {load.scheduled_time || 'No time set'}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        load.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : load.status === 'shipped'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {load.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <CoilList coils={load.coils} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No loads scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayLoads;
