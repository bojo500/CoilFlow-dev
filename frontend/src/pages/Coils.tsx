import React, { useState } from 'react';
import { useCoils, Coil } from '../api/queries';
import CoilList from '../components/CoilList';
import AddCoilModal from '../components/AddCoilModal';
import { Search } from 'lucide-react';

const Coils: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCoil, setEditingCoil] = useState<Coil | null>(null);

  const queryParams: any = {};
  if (searchQuery) queryParams.coil_id = searchQuery;
  if (statusFilter) queryParams.status = statusFilter;

  const { data: coils, isLoading } = useCoils(queryParams);

  const handleEditCoil = (coil: Coil) => {
    setEditingCoil(coil);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Coils</h1>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Coil ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter coil ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="WIP">WIP</option>
                <option value="RTS">RTS</option>
                <option value="scrap">Scrap</option>
                <option value="onhold">On Hold</option>
                <option value="rework">Rework</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {coils?.length || 0} coil(s)
                </p>
              </div>
              {coils && <CoilList coils={coils} onEdit={handleEditCoil} />}
            </>
          )}
        </div>

        {/* Edit Coil Modal */}
        <AddCoilModal
          isOpen={!!editingCoil}
          onClose={() => setEditingCoil(null)}
          editCoil={editingCoil}
        />
      </div>
    </div>
  );
};

export default Coils;
