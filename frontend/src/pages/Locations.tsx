import React from 'react';
import LocationMap from '../components/LocationMap';

const Locations: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Factory Map
        </h1>
        <p className="text-gray-600 mb-6">
          Visual representation of coil locations across factory sections
        </p>

        <LocationMap focusSection={3} />
      </div>
    </div>
  );
};

export default Locations;
