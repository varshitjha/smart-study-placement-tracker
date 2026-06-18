// src/components/ResumeUpload.jsx
//
// PURPOSE:
// A drag-and-drop (or click-to-browse) upload area for PDF resume files.
// Shows upload progress feedback and error messages.
// When upload completes successfully, calls onSuccess(analysisData).
//
// PROPS:
//   onSuccess - Called with the analysis object after a successful upload

import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { uploadAndAnalyzeResume } from '../services/resumeService.js'

function ResumeUpload({ onSuccess }) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileName,  setFileName]  = useState('')
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return

    // Validate: PDF only, max 5MB
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.')
      return
    }

    setFileName(file.name)
    setUploading(true)

    try {
      const res = await uploadAndAnalyzeResume(file)
      toast.success('Resume analyzed successfully!')
      if (onSuccess) onSuccess(res.data.analysis)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
      setFileName('')
    } finally {
      setUploading(false)
    }
  }

  // Handle drag events
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = ()  => setDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  // Handle click-to-browse
  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div
      className={`resume-upload-area ${dragging ? 'resume-upload-area--dragging' : ''} ${uploading ? 'resume-upload-area--uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {uploading ? (
        <>
          <div className="resume-upload-spinner" />
          <p className="resume-upload-label">Analyzing <strong>{fileName}</strong>...</p>
          <p className="resume-upload-sub">This takes a few seconds</p>
        </>
      ) : (
        <>
          <div className="resume-upload-icon">📄</div>
          <p className="resume-upload-label">
            {dragging ? 'Drop your resume here' : 'Drag & drop your resume PDF here'}
          </p>
          <p className="resume-upload-sub">or click to browse — PDF only, max 5MB</p>
          {fileName && <p className="resume-upload-filename">Last uploaded: {fileName}</p>}
        </>
      )}
    </div>
  )
}

export default ResumeUpload
