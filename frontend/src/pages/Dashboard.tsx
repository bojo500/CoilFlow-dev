import React, { useState } from 'react';
import { useDashboardToday, useLoadById } from '../api/queries';
import LoadGrid from '../components/LoadGrid';
import CoilList from '../components/CoilList';
import AddCoilModal from '../components/AddCoilModal';
import AddLoadModal from '../components/AddLoadModal';
import EditLoadModal from '../components/EditLoadModal';
import { X, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardToday();
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [showAddCoilModal, setShowAddCoilModal] = useState(false);
  const [showAddLoadModal, setShowAddLoadModal] = useState(false);
  const [editingLoadId, setEditingLoadId] = useState<string | null>(null);
  const { data: selectedLoad } = useLoadById(selectedLoadId || '');
  const { data: editingLoad } = useLoadById(editingLoadId || '');

  const handleLoadClick = (loadId: string) => {
    setSelectedLoadId(loadId);
  };

  const handleLoadEdit = (loadId: string) => {
    setEditingLoadId(loadId);
  };

  const closeModal = () => {
    setSelectedLoadId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Action Buttons */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                CoilFlow Dashboard
              </h1>
              <p className="text-gray-600">Today's load overview</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddCoilModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add New Coil
              </button>
              <button
                onClick={() => setShowAddLoadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add New Load
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card bg-primary-50 border-l-4 border-primary-600">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Today Loads
              </h3>
              <p className="text-3xl font-bold text-primary-900">
                {data.quick_counts.totalLoads}
              </p>
            </div>
            <div className="card bg-green-50 border-l-4 border-green-600">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Loads Ready
              </h3>
              <p className="text-3xl font-bold text-green-900">
                {data.quick_counts.readyLoads}
              </p>
            </div>
            <div className="card bg-red-50 border-l-4 border-red-600">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">
                Loads Not Ready
              </h3>
              <p className="text-3xl font-bold text-red-900">
                {data.quick_counts.missingLoads}
              </p>
            </div>
          </div>
        )}

        {/* Load Cards */}
        {data && (
          <LoadGrid
            loads={data.loads}
            onLoadClick={handleLoadClick}
            onLoadEdit={handleLoadEdit}
          />
        )}

        {/* Load Detail Modal */}
        {selectedLoadId && selectedLoad && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Load #{selectedLoad.load_number}
                  </h2>
                  <p className="text-gray-600">{selectedLoad.customer_name}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Scheduled Time:</span>{' '}
                      {selectedLoad.scheduled_time || 'Not set'}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          selectedLoad.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : selectedLoad.status === 'shipped'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {selectedLoad.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>{' '}
                      {selectedLoad.created_for_date}
                    </div>
                    <div>
                      <span className="font-semibold">Total Coils:</span>{' '}
                      {selectedLoad.coils.length}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Coils</h3>
                <CoilList coils={selectedLoad.coils} />
              </div>
            </div>
          </div>
        )}

        {/* Add Coil Modal */}
        <AddCoilModal
          isOpen={showAddCoilModal}
          onClose={() => setShowAddCoilModal(false)}
        />

        {/* Add Load Modal */}
        <AddLoadModal
          isOpen={showAddLoadModal}
          onClose={() => setShowAddLoadModal(false)}
        />

        {/* Edit Load Modal */}
        <EditLoadModal
          isOpen={!!editingLoadId}
          onClose={() => setEditingLoadId(null)}
          load={editingLoad || null}
        />
      </div>
    </div>
  );
};

export default Dashboard;
