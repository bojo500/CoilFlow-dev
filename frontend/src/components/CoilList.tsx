import React from 'react';
import { Pencil } from 'lucide-react';
import { Coil } from '../api/queries';

interface CoilListProps {
  coils: Coil[];
  onEdit?: (coil: Coil) => void;
  onAssign?: (coilId: string) => void;
}

const CoilList: React.FC<CoilListProps> = ({ coils, onEdit, onAssign }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RTS':
        return 'bg-green-100 text-green-800';
      case 'WIP':
        return 'bg-yellow-100 text-yellow-800';
      case 'scrap':
        return 'bg-red-100 text-red-800';
      case 'onhold':
        return 'bg-gray-100 text-gray-800';
      case 'rework':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!coils || coils.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No coils found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Coil ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Width
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Weight
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Location
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coils.map((coil) => (
            <tr key={coil.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {coil.coil_id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{coil.width}"</td>
              <td className="px-4 py-3 text-sm text-gray-700">{coil.weight} lbs</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    coil.status,
                  )}`}
                >
                  {coil.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {coil.location || 'N/A'}
                {coil.section && (
                  <span className="ml-2 text-xs text-gray-500">
                    (S{coil.section}C{coil.column}R{coil.row})
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2 items-center">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(coil)}
                      className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-all transform hover:scale-110"
                      title="Edit Coil"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {onAssign && !coil.load_id && (
                    <button
                      onClick={() => onAssign(coil.coil_id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Assign
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoilList;
