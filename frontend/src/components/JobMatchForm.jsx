// Phase 2C placeholder
import React, { useState } from 'react';
import { matchJobDescription } from '../services/resumeService';
import toast from 'react-hot-toast';
import '../css/jobmatch.css';

const JobMatchForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobDescription: '',
    resume: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume || !formData.jobDescription) {
      toast.error('Please upload your resume and paste the job description.');
      return;
    }

    setLoading(true);

    try {
      const response = await matchJobDescription(
        formData.resume,
        formData.companyName,
        formData.jobDescription
      );

      onResult(response.data.analysis);

      toast.success('Job match analysis completed!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to analyze job match'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="job-match-form" onSubmit={handleSubmit}>
      <h3>Job Match Analyzer</h3>

      <input
        type="text"
        name="companyName"
        placeholder="Company Name (Optional)"
        value={formData.companyName}
        onChange={handleChange}
      />

      <textarea
        name="jobDescription"
        placeholder="Paste Job Description here..."
        value={formData.jobDescription}
        onChange={handleChange}
        rows={8}
        required
      />

      <div className="file-input-wrapper">
        <label>Upload Resume (PDF)</label>
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Match Score'}
      </button>
    </form>
  );
};

export default JobMatchForm;