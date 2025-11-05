import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import "./AllStudents.css";
import { toast } from "react-toastify";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    selectedCategory: "",
    selectedExam: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/admin/students", {
        params: { page, search, limit: 20 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data.students || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phoneNumber: student.phoneNumber || "",
      selectedCategory: student.selectedCategory || "",
      selectedExam: student.selectedExam || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `/api/admin/students/${editingStudent._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.student;

      setStudents((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
      toast.success("Student updated successfully!");
      setEditingStudent(null);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/admin/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(prev => prev.filter(s => s._id !== id));
      toast.success("Student deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete student");
    }
  };




  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="students-page">
        <div className="students-header">
          <h1 className="page-title">All Registered Students</h1>
          <div className="students-search">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading-spinner">Loading students...</div>}

        {!loading && students.length === 0 ? (
          <div className="no-data">No students found</div>
        ) : (
          <>
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Category</th>
                    <th>Exam</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{(page - 1) * 20 + index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber || '-'}</td>
                      <td>{student.selectedCategory || '-'}</td>
                      <td>{student.selectedExam || '-'}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className="action-icons">
                        <button
                          title="Edit"
                          onClick={() => handleEdit(student)}
                          className="edit-btn"
                        >
                          ✏️
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(student._id)}
                          className="delete-btn"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages} • Total: {total} students
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {editingStudent && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Student</h2>
            <label>Name:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <label>Phone:</label>
            <input
              type="text"
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
            />
            <label>Category:</label>
            <input
              type="text"
              value={editForm.selectedCategory}
              onChange={(e) => setEditForm({ ...editForm, selectedCategory: e.target.value })}
            />
            <label>Exam:</label>
            <input
              type="text"
              value={editForm.selectedExam}
              onChange={(e) => setEditForm({ ...editForm, selectedExam: e.target.value })}
            />

            <div className="edit-actions">
              <button onClick={handleUpdate}>Update</button>
              <button className="cancel" onClick={() => setEditingStudent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AllStudents;
