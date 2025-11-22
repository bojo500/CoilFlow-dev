import React from 'react';
import { Pencil } from 'lucide-react';
import { LoadCard as LoadCardType } from '../api/queries';

interface LoadCardProps {
  load: LoadCardType;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

const LoadCard: React.FC<LoadCardProps> = ({ load, onClick, onEdit }) => {
  const getStatusDotClass = () => {
    if (load.statusDot === 'green') return 'status-dot-green';
    if (load.statusDot === 'red') return 'status-dot-red';
    return 'status-dot-grey';
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card onClick from firing
    if (onEdit) {
      onEdit(e);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-lg transition-shadow relative ${
        load.isShipped ? 'bg-gray-200' : ''
      }`}
    >
      {/* Edit Icon - Top Right Corner */}
      {onEdit && (
        <button
          onClick={handleEditClick}
          className="absolute top-3 right-3 p-2 bg-white hover:bg-green-50 text-green-600 hover:text-green-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-110"
          title="Edit Load"
        >
          <Pencil size={18} />
        </button>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`status-dot ${getStatusDotClass()}`} />
            <h3 className="text-2xl font-bold text-gray-800">...{load.last4}</h3>
          </div>
          <p className="text-lg font-semibold text-gray-700">{load.customer_name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {load.scheduled_time ? `Scheduled: ${load.scheduled_time}` : 'No time set'}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Ready: {load.readyFraction}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                load.isShipped
                  ? 'bg-gray-300 text-gray-700'
                  : load.statusDot === 'green'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {load.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadCard;
