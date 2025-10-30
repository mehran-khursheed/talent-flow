// src/components/JobEditForm.jsx
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function JobEditForm({ job, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    department: "",
    employmentType: "",
    experience: "",
    openings: 1,
    location: "",
    salary: "",
    fillBy: "",
    tags: []
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        priority: job.priority || "medium",
        status: job.status || "open",
        department: job.department || "",
        employmentType: job.employmentType || "",
        experience: job.experience || "",
        openings: job.openings || 1,
        location: job.location || "",
        salary: job.salary || "",
        fillBy: job.fillBy ? job.fillBy.split('T')[0] : "", // Format for date input
        tags: job.tags || []
      });
    }
  }, [job]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    if (!formData.employmentType.trim()) {
      newErrors.employmentType = "Employment type is required";
    }
    if (formData.openings <= 0) {
      newErrors.openings = "Openings must be greater than 0";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare data for API (convert openings to number, format date)
      const submitData = {
        ...formData,
        openings: parseInt(formData.openings),
        fillBy: formData.fillBy ? new Date(formData.fillBy).toISOString() : null
      };
      onSave(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Block form and show spinner while saving */}
      {isSaving && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-lg">
          <LoadingSpinner fullScreen={false} size="md" />
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-spotify-green mb-1">
          Job Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-spotify-dark border rounded-lg text-white placeholder-spotify-light-gray ${
            errors.title ? 'border-red-500' : 'border-spotify-light-gray'
          } focus:outline-none focus:ring-2 focus:ring-spotify-green`}
          placeholder="Enter job title"
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-spotify-green mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-spotify-green mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Department and Employment Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-spotify-green mb-1">
            Department *
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-spotify-dark border rounded-lg text-white placeholder-spotify-light-gray ${
              errors.department ? 'border-red-500' : 'border-spotify-light-gray'
            } focus:outline-none focus:ring-2 focus:ring-spotify-green`}
            placeholder="Engineering, Marketing, etc."
            aria-describedby={errors.department ? "department-error" : undefined}
          />
          {errors.department && (
            <p id="department-error" className="mt-1 text-sm text-red-500">{errors.department}</p>
          )}
        </div>

        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-spotify-green mb-1">
            Employment Type *
          </label>
          <input
            type="text"
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-spotify-dark border rounded-lg text-white placeholder-spotify-light-gray ${
              errors.employmentType ? 'border-red-500' : 'border-spotify-light-gray'
            } focus:outline-none focus:ring-2 focus:ring-spotify-green`}
            placeholder="Full-time, Part-time, etc."
            aria-describedby={errors.employmentType ? "employmentType-error" : undefined}
          />
          {errors.employmentType && (
            <p id="employmentType-error" className="mt-1 text-sm text-red-500">{errors.employmentType}</p>
          )}
        </div>
      </div>

      {/* Experience and Openings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-spotify-green mb-1">
            Experience
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white placeholder-spotify-light-gray focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="Entry, Mid, Senior, etc."
          />
        </div>

        <div>
          <label htmlFor="openings" className="block text-sm font-medium text-spotify-green mb-1">
            Openings *
          </label>
          <input
            type="number"
            id="openings"
            name="openings"
            value={formData.openings}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 bg-spotify-dark border rounded-lg text-white placeholder-spotify-light-gray ${
              errors.openings ? 'border-red-500' : 'border-spotify-light-gray'
            } focus:outline-none focus:ring-2 focus:ring-spotify-green`}
            aria-describedby={errors.openings ? "openings-error" : undefined}
          />
          {errors.openings && (
            <p id="openings-error" className="mt-1 text-sm text-red-500">{errors.openings}</p>
          )}
        </div>
      </div>

      {/* Location and Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-spotify-green mb-1">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-spotify-dark border rounded-lg text-white placeholder-spotify-light-gray ${
              errors.location ? 'border-red-500' : 'border-spotify-light-gray'
            } focus:outline-none focus:ring-2 focus:ring-spotify-green`}
            placeholder="City, State, Remote, etc."
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <p id="location-error" className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-spotify-green mb-1">
            Salary
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white placeholder-spotify-light-gray focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="$80,000 - $100,000"
          />
        </div>
      </div>

      {/* Fill By Date */}
      <div>
        <label htmlFor="fillBy" className="block text-sm font-medium text-spotify-green mb-1">
          Fill By Date
        </label>
        <input
          type="date"
          id="fillBy"
          name="fillBy"
          value={formData.fillBy}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-spotify-green mb-1">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white placeholder-spotify-light-gray focus:outline-none focus:ring-2 focus:ring-spotify-green"
          placeholder="tag1, tag2, tag3"
        />
        <p className="mt-1 text-xs text-spotify-light-gray">Separate tags with commas</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-spotify-green mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-3 py-2 bg-spotify-dark border border-spotify-light-gray rounded-lg text-white placeholder-spotify-light-gray focus:outline-none focus:ring-2 focus:ring-spotify-green resize-vertical"
          placeholder="Enter job description..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-spotify-light-gray/20">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-spotify-light-gray hover:bg-spotify-gray rounded-lg transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-black bg-spotify-green hover:bg-spotify-green/90 rounded-lg transition disabled:opacity-50 flex items-center"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}