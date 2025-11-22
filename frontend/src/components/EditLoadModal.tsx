import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUpdateLoad, Load } from '../api/queries';

interface EditLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: Load | null;
}

const EditLoadModal: React.FC<EditLoadModalProps> = ({ isOpen, onClose, load }) => {
  const updateLoadMutation = useUpdateLoad();

  const [formData, setFormData] = useState({
    customer_name: '',
    scheduled_time: '',
    created_for_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when load changes
  useEffect(() => {
    if (load) {
      setFormData({
        customer_name: load.customer_name || '',
        scheduled_time: load.scheduled_time || '',
        created_for_date: load.created_for_date || '',
      });
    }
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!load) return;

    // Validation
    const newErrors: Record<string, string> = {};

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

    // Prepare payload
    const payload: any = {
      id: load.id,
      customer_name: formData.customer_name.trim(),
      created_for_date: formData.created_for_date,
    };

    if (formData.scheduled_time) {
      payload.scheduled_time = formData.scheduled_time;
    }

    try {
      await updateLoadMutation.mutateAsync(payload);

      // Success - reset and close
      setErrors({});
      onClose();
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to update load',
      });
    }
  };

  if (!isOpen || !load) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">✏️ Edit Load #{load.load_number}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Load Number - Read Only Display */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Load Number
            </label>
            <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold">
              {load.load_number}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              🔒 Load number cannot be changed
            </p>
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
              placeholder="Enter customer name"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.customer_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer_name && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
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

          {/* Created For Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
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

          {/* Status Display */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Current Status
            </label>
            <div
              className={`w-full px-4 py-3 border-2 rounded-lg font-semibold ${
                load.status === 'ready'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : load.status === 'shipped'
                  ? 'bg-gray-100 border-gray-300 text-gray-600'
                  : 'bg-red-50 border-red-300 text-red-700'
              }`}
            >
              {load.status.toUpperCase()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 Status is calculated automatically based on coil readiness
            </p>
          </div>

          {/* Coils Count Display */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Assigned Coils
            </label>
            <div className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg text-blue-700 font-semibold">
              {load.coils?.length || 0} coil(s) assigned
            </div>
            <p className="text-xs text-gray-500 mt-1">
              📦 Edit individual coils to reassign them
            </p>
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
              disabled={updateLoadMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoadMutation.isPending ? 'Saving...' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLoadModal;
