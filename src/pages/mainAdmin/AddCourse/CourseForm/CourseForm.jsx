// File: CourseForm.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./CourseForm.css";

const CourseForm = ({ onClose, onSuccess, editData }) => {
    const [name, setName] = useState(editData?.name || "");
  const [price, setPrice] = useState(editData?.price || "");
  const [description, setDescription] = useState(editData?.description || "");
 const [thumbnail, setThumbnail] = useState(null);
 const [preview, setPreview] = useState(editData?.thumbnail ? (editData.thumbnail.startsWith('data:') ? editData.thumbnail : `/uploads/${editData.thumbnail}`) : null);
  const [loading, setLoading] = useState(false);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      let thumbnailData = null;

      // Convert file to base64 if new file selected
      if (typeof thumbnail === "object" && thumbnail) {
        thumbnailData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(thumbnail);
        });
      } else if (editData?.thumbnail) {
        // Keep existing thumbnail if no new file
        thumbnailData = editData.thumbnail;
      }

      const courseData = {
        name,
        price: parseFloat(price),
        description,
        thumbnail: thumbnailData || preview
      };

      if (editData) {
        // UPDATE existing course
        await axios.put(`/api/admin/courses/${editData._id}`, courseData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("✅ Course updated successfully!");
      } else {
        // CREATE new course
        await axios.post("/api/admin/courses", courseData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("✅ Course added successfully!");
      }

      onSuccess(); // Refresh + Close modal
    } catch (err) {
      console.error("Error:", err);
      alert("❌ " + (err.response?.data?.message || "Something went wrong!"));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="adminCourse-form-overlay">
      <div className="adminCourse-form-modal">
        <h2 className="adminCourse-form-title">Add New Course</h2>
        <form onSubmit={handleSubmit} className="adminCourse-form">
          <div className="adminCourse-form-group">
            <label>Course Title</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="adminCourse-form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="adminCourse-form-group">
            <label>Description</label>
            <ReactQuill value={description} onChange={setDescription} />
          </div>

          <div className="adminCourse-form-group">
            <label>Thumbnail</label>
            <input type="file" onChange={handleThumbnail} required={!editData} />
            {preview && <img src={preview} alt="Preview" className="adminCourse-thumb-preview" />}
          </div>

          <div className="adminCourse-form-actions">
            <button type="submit" disabled={loading} className="adminCourse-submit">
              {loading ? "Saving..." : "Save Course"}
            </button>
            <button type="button" onClick={onClose} className="adminCourse-cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
