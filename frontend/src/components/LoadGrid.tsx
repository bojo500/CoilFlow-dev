import React from 'react';
import LoadCard from './LoadCard';
import { LoadCard as LoadCardType } from '../api/queries';

interface LoadGridProps {
  loads: LoadCardType[];
  onLoadClick: (loadId: string) => void;
  onLoadEdit?: (loadId: string) => void;
}

const LoadGrid: React.FC<LoadGridProps> = ({ loads, onLoadClick, onLoadEdit }) => {
  if (!loads || loads.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No loads found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loads.map((load) => (
        <LoadCard
          key={load.id}
          load={load}
          onClick={() => onLoadClick(load.id)}
          onEdit={onLoadEdit ? (e) => {
            e.stopPropagation();
            onLoadEdit(load.id);
          } : undefined}
        />
      ))}
    </div>
  );
};

export default LoadGrid;
