import React, { useState } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import { useCreateLoad, useUnassignedCoils } from '../api/queries';

interface AddLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLoadModal: React.FC<AddLoadModalProps> = ({ isOpen, onClose }) => {
  const createLoadMutation = useCreateLoad();
  const [formData, setFormData] = useState({
    load_number: '',
    customer_name: '',
    scheduled_time: '',
    created_for_date: new Date().toISOString().split('T')[0], // Default to today
  });

  // Fetch unassigned coils for the selected date
  const { data: unassignedCoils, isLoading: loadingCoils } = useUnassignedCoils(
    formData.created_for_date
  );

  const [selectedCoilIds, setSelectedCoilIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toggle coil selection
  const toggleCoilSelection = (coilId: string) => {
    setSelectedCoilIds((prev) =>
      prev.includes(coilId)
        ? prev.filter((id) => id !== coilId)
        : [...prev, coilId]
    );
  };

  // Select/Deselect all coils
  const toggleSelectAll = () => {
    if (!unassignedCoils) return;
    if (selectedCoilIds.length === unassignedCoils.length) {
      setSelectedCoilIds([]);
    } else {
      setSelectedCoilIds(unassignedCoils.map((c) => c.coil_id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.load_number || parseInt(formData.load_number) <= 0) {
      newErrors.load_number = 'Load number must be greater than 0';
    }

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }

    if (!formData.created_for_date) {
      newErrors.created_for_date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare payload with selected coils
    const payload: any = {
      load_number: parseInt(formData.load_number),
      customer_name: formData.customer_name.trim(),
      created_for_date: formData.created_for_date,
    };

    if (formData.scheduled_time) {
      payload.scheduled_time = formData.scheduled_time;
    }

    // Include selected coil IDs
    if (selectedCoilIds.length > 0) {
      payload.coil_ids = selectedCoilIds;
    }

    try {
      await createLoadMutation.mutateAsync(payload);

      // Success - reset and close
      setFormData({
        load_number: '',
        customer_name: '',
        scheduled_time: '',
        created_for_date: new Date().toISOString().split('T')[0],
      });
      setSelectedCoilIds([]);
      setErrors({});
      onClose();
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create load',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">🚚 Add New Load</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Load Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Load Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.load_number}
              onChange={(e) =>
                setFormData({ ...formData, load_number: e.target.value })
              }
              placeholder="e.g., 4521"
              min="1"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.load_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.load_number && (
              <p className="text-red-500 text-sm mt-1">{errors.load_number}</p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              placeholder="e.g., ACME Corporation"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.customer_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer_name && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
            )}
          </div>

          {/* Created For Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Scheduled Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.created_for_date}
              onChange={(e) =>
                setFormData({ ...formData, created_for_date: e.target.value })
              }
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.created_for_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.created_for_date && (
              <p className="text-red-500 text-sm mt-1">{errors.created_for_date}</p>
            )}
          </div>

          {/* Scheduled Time - 24h with 30min intervals */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Scheduled Time (Optional)
            </label>
            <select
              value={formData.scheduled_time}
              onChange={(e) =>
                setFormData({ ...formData, scheduled_time: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">-- Select Time --</option>
              {Array.from({ length: 48 }, (_, i) => {
                const hour = Math.floor(i / 2);
                const minute = (i % 2) * 30;
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                return (
                  <option key={timeString} value={timeString}>
                    {timeString}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ⏰ 24-hour format with 30-minute intervals (00:00 - 23:30)
            </p>
          </div>

          {/* Select Coils - Smart Assignment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">
                Select Coils for This Load (Optional)
              </label>
              {unassignedCoils && unassignedCoils.length > 0 && (
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  {selectedCoilIds.length === unassignedCoils.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
              {loadingCoils ? (
                <div className="text-center py-4 text-gray-500">
                  Loading unassigned coils...
                </div>
              ) : !unassignedCoils || unassignedCoils.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="font-semibold">No unassigned coils found</p>
                  <p className="text-xs mt-1">Create coils first or all coils are already assigned</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unassignedCoils.map((coil) => (
                    <div
                      key={coil.id}
                      onClick={() => toggleCoilSelection(coil.coil_id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCoilIds.includes(coil.coil_id)
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-white border-2 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedCoilIds.includes(coil.coil_id) ? (
                          <CheckSquare size={20} className="text-green-600" />
                        ) : (
                          <Square size={20} className="text-gray-400" />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{coil.coil_id}</p>
                          <p className="text-xs text-gray-600">
                            {coil.width}" × {coil.weight}lbs | {coil.status} | {coil.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCoilIds.length > 0 && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-900">
                  ✓ {selectedCoilIds.length} coil(s) selected
                </p>
              </div>
            )}

            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                💡 Smart Coil Assignment:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>Automatic Assignment</strong>: Selected coils will be assigned to this load upon creation</li>
                <li>• <strong>Unassigned Only</strong>: Only showing coils not yet assigned to any load</li>
                <li>• <strong>Optional</strong>: Skip selection to create empty load (assign coils later)</li>
              </ul>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 font-semibold">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoadMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoadMutation.isPending ? 'Creating...' : '✓ Create Load'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoadModal;
