import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateCoil, useUpdateCoil, Coil } from '../api/queries';

interface AddCoilModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCoil?: Coil | null; // If provided, modal is in edit mode
}

const AddCoilModal: React.FC<AddCoilModalProps> = ({ isOpen, onClose, editCoil }) => {
  const createCoilMutation = useCreateCoil();
  const updateCoilMutation = useUpdateCoil();

  const isEditMode = !!editCoil;

  const [formData, setFormData] = useState({
    coil_id: '',
    width: '',
    weight: '',
    status: 'WIP',
    location: '',
    load_id: '',
    scheduled_for_date: '',
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editCoil) {
      setFormData({
        coil_id: editCoil.coil_id || '',
        width: editCoil.width?.toString() || '',
        weight: editCoil.weight?.toString() || '',
        status: editCoil.status || 'WIP',
        location: editCoil.location || '',
        load_id: editCoil.load_id || '',
        scheduled_for_date: editCoil.scheduled_for_date || '',
      });
    } else {
      // Reset form for add mode
      setFormData({
        coil_id: '',
        width: '',
        weight: '',
        status: 'WIP',
        location: '',
        load_id: '',
        scheduled_for_date: '',
      });
    }
  }, [editCoil, isOpen]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Smart Location Parser
   * - 5-digit grid code (e.g., 30104) → Section 3, Column 1, Row 4
   * - Special areas (S3, 126, Truck) → Use as-is
   */
  const parseLocation = (locationInput: string) => {
    const trimmed = locationInput.trim();

    // Special areas - pass through as-is
    const specialAreas = ['S3', '126', 'TRUCK', 'TRUCK RESERVING AREA'];
    if (specialAreas.includes(trimmed.toUpperCase())) {
      return {
        location: trimmed.toUpperCase(),
        section: null,
        column: null,
        row: null,
      };
    }

    // 5-digit grid code parsing
    if (/^\d{5}$/.test(trimmed)) {
      const section = parseInt(trimmed[0]);
      const column = parseInt(trimmed.substring(1, 3));
      const row = parseInt(trimmed.substring(3));

      return {
        location: trimmed,
        section,
        column,
        row,
      };
    }

    // 3-digit code parsing (e.g., 126)
    if (/^\d{3}$/.test(trimmed)) {
      return {
        location: trimmed,
        section: parseInt(trimmed[0]),
        column: parseInt(trimmed[1]),
        row: parseInt(trimmed[2]),
      };
    }

    // Default: use as-is
    return {
      location: trimmed,
      section: null,
      column: null,
      row: null,
    };
  };

  const handleCoilIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase for Coil ID
    const uppercased = e.target.value.toUpperCase();
    setFormData({ ...formData, coil_id: uppercased });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.coil_id.trim()) {
      newErrors.coil_id = 'Coil ID is required';
    }

    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = 'Width must be greater than 0';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Load ID is now optional in both add and edit modes
    // (User can create coils for inventory without immediate assignment)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Parse location
    const locationData = parseLocation(formData.location);

    // Prepare payload
    const payload: any = {
      coil_id: formData.coil_id.trim(),
      width: parseInt(formData.width),
      weight: parseInt(formData.weight),
      status: formData.status,
      location: locationData.location,
    };

    // Add load_id if provided (for assignment/reassignment)
    if (formData.load_id && formData.load_id.trim()) {
      payload.load_id = formData.load_id.trim();
    }

    if (formData.scheduled_for_date) {
      payload.scheduled_for_date = formData.scheduled_for_date;
    }

    try {
      if (isEditMode && editCoil) {
        // Update existing coil
        await updateCoilMutation.mutateAsync({ id: editCoil.id, ...payload });
      } else {
        // Create new coil
        await createCoilMutation.mutateAsync(payload);
      }

      // Success - reset and close
      setFormData({
        coil_id: '',
        width: '',
        weight: '',
        status: 'WIP',
        location: '',
        load_id: '',
        scheduled_for_date: '',
      });
      setErrors({});
      onClose();
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} coil`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {isEditMode ? '✏️ Edit Coil' : '📦 Add New Coil'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Coil ID */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Coil ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.coil_id}
              onChange={handleCoilIdChange}
              placeholder="Enter coil ID (auto-uppercase)"
              readOnly={isEditMode}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.coil_id ? 'border-red-500' : 'border-gray-300'
              } ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.coil_id && (
              <p className="text-red-500 text-sm mt-1">{errors.coil_id}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {isEditMode ? '🔒 Coil ID cannot be changed' : '💡 All letters will be automatically capitalized'}
            </p>
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Width (inches) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              placeholder="e.g., 17"
              min="1"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.width ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.width && (
              <p className="text-red-500 text-sm mt-1">{errors.width}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Weight (lbs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="e.g., 7000"
              min="1"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.weight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="WIP">WIP (Work in Progress)</option>
              <option value="RTS">RTS (Ready to Ship)</option>
              <option value="scrap">Scrap</option>
              <option value="onhold">On Hold</option>
              <option value="rework">Rework</option>
            </select>
          </div>

          {/* Location - Smart Parser */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., 30104, S3, 126, or Truck"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                🔍 Smart Location Parser:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>5-digit grid</strong>: 30104 → Section 3, Column 1, Row 4</li>
                <li>• <strong>Special areas</strong>: S3, 126, Truck (used as-is)</li>
              </ul>
            </div>
          </div>

          {/* Load ID - Optional Assignment/Reassignment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Load ID <span className="text-gray-500 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.load_id}
              onChange={(e) => setFormData({ ...formData, load_id: e.target.value })}
              placeholder="Enter Load ID to assign (optional)"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.load_id ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.load_id && (
              <p className="text-red-500 text-sm mt-1">{errors.load_id}</p>
            )}
            <div className="mt-2 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs font-semibold text-purple-900 mb-1">
                🔄 Assignment Logic:
              </p>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• <strong>Optional</strong>: Create coils for inventory without immediate load assignment</li>
                {isEditMode ? (
                  <>
                    <li>• <strong>Reassignment</strong>: Change the Load ID to move coil to different load</li>
                    <li>• <strong>Unassign</strong>: Clear the field to unassign from current load</li>
                  </>
                ) : (
                  <li>• <strong>Assign Later</strong>: Leave empty and assign coils to loads when ready</li>
                )}
              </ul>
            </div>
          </div>

          {/* Scheduled Date (Optional) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Scheduled For Date (Optional)
            </label>
            <input
              type="date"
              value={formData.scheduled_for_date}
              onChange={(e) =>
                setFormData({ ...formData, scheduled_for_date: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
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
              disabled={createCoilMutation.isPending || updateCoilMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCoilMutation.isPending || updateCoilMutation.isPending
                ? `${isEditMode ? 'Saving' : 'Creating'}...`
                : `✓ ${isEditMode ? 'Save Changes' : 'Create Coil'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoilModal;
