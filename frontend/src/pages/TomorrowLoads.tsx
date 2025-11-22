import React from 'react';
import { useLoads, useUnassignedCoils } from '../api/queries';
import CoilList from '../components/CoilList';

const TomorrowLoads: React.FC = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const { data: loads, isLoading: loadsLoading } = useLoads(tomorrowDate);
  const { data: unassignedCoils, isLoading: coilsLoading } =
    useUnassignedCoils(tomorrowDate);

  if (loadsLoading || coilsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tomorrow's Loads ({tomorrowDate})
        </h1>

        {/* Scheduled Loads */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Scheduled Loads
          </h2>
          {loads && loads.length > 0 ? (
            <div className="space-y-6">
              {loads.map((load) => (
                <div key={load.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Load #{load.load_number}
                      </h3>
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
            <div className="card text-center py-8 text-gray-500">
              <p>No loads scheduled for tomorrow yet</p>
            </div>
          )}
        </div>

        {/* Unassigned Coils */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unassigned Scheduled Coils
          </h2>
          {unassignedCoils && unassignedCoils.length > 0 ? (
            <div className="card">
              <p className="text-sm text-gray-600 mb-4">
                These coils are scheduled for tomorrow but not yet assigned to a
                load.
              </p>
              <CoilList coils={unassignedCoils} />
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-500">
              <p>No unassigned coils for tomorrow</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TomorrowLoads;
