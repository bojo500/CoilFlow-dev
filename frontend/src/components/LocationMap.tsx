import React, { useState } from 'react';
import { useSectionGrid } from '../api/queries';

interface LocationMapProps {
  focusSection?: number;
  onSearchResult?: (coilId: string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ focusSection = 3 }) => {
  const [selectedSection, setSelectedSection] = useState(focusSection);
  const { data: gridData } = useSectionGrid(selectedSection);

  /**
   * Generate the location label/ID using the formula:
   * [Section] + '0' + [Column] + '0' + [Row]
   * Example: Section 3, Column 2, Row 4 = 30204
   */
  const generateLocationLabel = (section: number, column: number, row: number): string => {
    return `${section}0${column}0${row}`;
  };

  /**
   * Create inverted grid layout for Section 3:
   * - Horizontal: Column 4 on Left, Column 1 on Right (reverse order)
   * - Vertical: Row 1 at Bottom, Row 6 at Top (reverse order)
   */
  const createInvertedGrid = () => {
    if (!gridData) return [];

    const grid: any[] = [];

    // Iterate rows from 6 to 1 (top to bottom visually)
    for (let row = 6; row >= 1; row--) {
      // Iterate columns from 4 to 1 (left to right visually)
      for (let col = 4; col >= 1; col--) {
        // Find the cell data from backend
        const cellData = gridData.grid.find(
          (cell: any) => cell.column === col && cell.row === row
        );

        grid.push({
          section: selectedSection,
          column: col,
          row: row,
          label: generateLocationLabel(selectedSection, col, row),
          coils: cellData?.coils || [],
          coil_count: cellData?.coil_count || 0,
        });
      }
    }

    return grid;
  };

  const getCellColor = (cellCoils: any[]) => {
    if (!cellCoils || cellCoils.length === 0) return 'bg-gradient-to-br from-gray-50 to-gray-100';

    const hasRTS = cellCoils.some((c: any) => c.status === 'RTS');
    const hasWIP = cellCoils.some((c: any) => c.status === 'WIP');

    if (hasRTS) return 'bg-gradient-to-br from-green-200 to-green-300';
    if (hasWIP) return 'bg-gradient-to-br from-yellow-200 to-yellow-300';
    return 'bg-gradient-to-br from-blue-200 to-blue-300';
  };

  const invertedGrid = createInvertedGrid();

  return (
    <div className="space-y-6">
      {/* Section selector */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4].map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
              selectedSection === section
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Section {section}
            {section === 3 && ' 🚛'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Section {selectedSection} Factory Floor Map
          </h3>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
            Col 4 ← → Col 1 | Row 6 ↑ ↓ Row 1
          </div>
        </div>

        {/* Column headers (inverted: 4, 3, 2, 1) */}
        <div className="mb-3 ml-12">
          <div className="grid grid-cols-4 gap-3 text-center text-sm font-bold text-gray-700">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-2 rounded-lg">COL 4</div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-2 rounded-lg">COL 3</div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-2 rounded-lg">COL 2</div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-2 rounded-lg">COL 1</div>
          </div>
        </div>

        {gridData && (
          <>
            <div className="flex">
              {/* Row labels (inverted: 6, 5, 4, 3, 2, 1) */}
              <div className="flex flex-col justify-around mr-3 text-sm font-bold text-gray-700">
                {[6, 5, 4, 3, 2, 1].map((row) => (
                  <div key={row} className="h-[90px] flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg px-3">
                    R{row}
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-4 gap-3 flex-1">
                {invertedGrid.map((cell, idx) => (
                  <div
                    key={idx}
                    className={`${getCellColor(
                      cell.coils,
                    )} border-3 border-gray-500 rounded-xl p-4 min-h-[90px] hover:shadow-2xl hover:scale-105 hover:border-primary-600 transition-all duration-300 cursor-pointer relative overflow-hidden`}
                    title={
                      cell.coils.length > 0
                        ? cell.coils.map((c: any) => c.coil_id).join(', ')
                        : `Location: ${cell.label}`
                    }
                  >
                    {/* Location Label */}
                    <div className="text-sm font-black text-gray-900 mb-2 bg-white bg-opacity-80 px-2 py-1 rounded-md shadow-sm inline-block">
                      {cell.label}
                    </div>

                    {/* Coil count */}
                    {cell.coil_count > 0 && (
                      <div className="text-base font-bold text-gray-900 mt-2">
                        📦 {cell.coil_count} {cell.coil_count !== 1 ? 'coils' : 'coil'}
                      </div>
                    )}

                    {/* Empty indicator */}
                    {cell.coil_count === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-semibold">
                        EMPTY
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Rows with Coils */}
            <div className="mt-4 space-y-3 ml-12">
              {/* Row 126 */}
              {(() => {
                const coils126 = gridData.grid.find((cell: any) => cell.location === '126')?.coils || [];
                const count126 = coils126.length;
                return (
                  <div
                    className={`w-full ${getCellColor(coils126)} border-3 border-purple-500 rounded-xl p-4 min-h-[70px] hover:shadow-xl transition-all duration-300 relative`}
                    title={count126 > 0 ? coils126.map((c: any) => c.coil_id).join(', ') : 'Location: 126'}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-black text-purple-900 bg-white bg-opacity-80 px-3 py-1 rounded-md">126</div>
                      {count126 > 0 && (
                        <div className="text-base font-bold text-gray-900">
                          📦 {count126} {count126 !== 1 ? 'coils' : 'coil'}
                        </div>
                      )}
                      {count126 === 0 && (
                        <div className="text-gray-400 text-xs font-semibold">EMPTY</div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Row S3 */}
              {(() => {
                const coilsS3 = gridData.grid.find((cell: any) => cell.location === 'S3')?.coils || [];
                const countS3 = coilsS3.length;
                return (
                  <div
                    className={`w-full ${getCellColor(coilsS3)} border-3 border-indigo-500 rounded-xl p-4 min-h-[70px] hover:shadow-xl transition-all duration-300 relative`}
                    title={countS3 > 0 ? coilsS3.map((c: any) => c.coil_id).join(', ') : 'Location: S3'}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-black text-indigo-900 bg-white bg-opacity-80 px-3 py-1 rounded-md">S3</div>
                      {countS3 > 0 && (
                        <div className="text-base font-bold text-gray-900">
                          📦 {countS3} {countS3 !== 1 ? 'coils' : 'coil'}
                        </div>
                      )}
                      {countS3 === 0 && (
                        <div className="text-gray-400 text-xs font-semibold">EMPTY</div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Truck Reserving Area - Skid-Gard Floor Sign Style */}
              {(() => {
                const coilsTruck = gridData.grid.find((cell: any) =>
                  cell.location === 'TRUCK' || cell.location === 'TRUCK RESERVING AREA'
                )?.coils || [];
                const countTruck = coilsTruck.length;
                return (
                  <div
                    className="w-full border-4 border-black rounded-xl p-6 min-h-[90px] hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 20px, #000000 20px, #000000 40px)'
                    }}
                    title={countTruck > 0 ? coilsTruck.map((c: any) => c.coil_id).join(', ') : 'Truck Reserving Area'}
                  >
                    <div className="bg-black bg-opacity-90 px-6 py-3 rounded-lg shadow-2xl">
                      <div className="text-2xl font-black text-yellow-400 tracking-wider flex items-center gap-3">
                        <span>🚚</span>
                        <span>TRUCK RESERVING AREA</span>
                        <span>🚚</span>
                        {countTruck > 0 && (
                          <span className="ml-4 text-lg bg-yellow-400 text-black px-3 py-1 rounded-md">
                            📦 {countTruck}
                          </span>
                        )}
                      </div>
                      <div className="text-center text-xs font-bold text-yellow-300 mt-1">
                        ⚠️ CAUTION: LOADING ZONE ⚠️
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-3">LEGEND</h4>
          <div className="flex gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400 rounded" />
              <span className="font-medium">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-200 to-green-300 border-2 border-green-500 rounded" />
              <span className="font-medium">RTS (Ready to Ship)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-200 to-yellow-300 border-2 border-yellow-500 rounded" />
              <span className="font-medium">WIP (Work in Progress)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-blue-500 rounded" />
              <span className="font-medium">Other Status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
