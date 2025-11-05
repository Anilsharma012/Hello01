// AllTeachers.jsx (Now with Edit & Delete)

import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import "./AllTeachers.css";
import { Dialog } from "@headlessui/react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, [page, search]);

  const fetchTeachers = async () => {
    setPageLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/admin/teachers", {
        params: { page, search, limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.teachers || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast.error("Failed to load teachers");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");

    try {
      if (editingId) {
        await axios.put(`/api/admin/teachers/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher updated successfully");
      } else {
        await axios.post("/api/admin/teachers", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher created successfully");
      }
      setIsOpen(false);
      setForm({ name: "", email: "", password: "" });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setForm({ name: teacher.name, email: teacher.email });
    setEditingId(teacher._id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/admin/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout>
      <div className="teachers-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Teachers</h1>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>
          <button className="create-btn" onClick={() => {
            setEditingId(null);
            setForm({ name: "", email: "", password: "" });
            setIsOpen(true);
          }}>
            <FaPlus /> Create Teacher
          </button>
        </div>

        {pageLoading && <div className="loading-spinner">Loading teachers...</div>}

        {!pageLoading && teachers.length === 0 ? (
          <div className="no-data">No teachers found</div>
        ) : (
          <>
            <div className="teacher-table-wrapper">
              <table className="teacher-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Category</th>
                    <th>Exam</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td>{(page - 1) * 20 + index + 1}</td>
                      <td>{teacher.name || "-"}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phoneNumber || '-'}</td>
                      <td>{teacher.selectedCategory || '-'}</td>
                      <td>{teacher.selectedExam || '-'}</td>
                      <td>{teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(teacher)}>
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(teacher._id)}>
                          <FaTrashAlt />
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
                Page {page} of {totalPages} • Total: {total} teachers
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

        <Dialog open={isOpen} onClose={() => {
          setIsOpen(false);
          setForm({ name: "", email: "", password: "" });
          setEditingId(null);
        }} className="dialog">
          <div className="dialog-overlay" />
          <div className="dialog-content">
            <Dialog.Title className="dialog-title">
              {editingId ? "Edit SubAdmin" : "Create New SubAdmin"}
            </Dialog.Title>
            <input name="name" value={form.name} onChange={handleInput} placeholder="Name" className="dialog-input" />
            <input name="email" value={form.email} onChange={handleInput} placeholder="Email" className="dialog-input" />
            {!editingId && (
              <input name="password" value={form.password} onChange={handleInput} placeholder="Password" type="password" className="dialog-input" />
            )}
            <div className="dialog-actions">
              <button onClick={() => setIsOpen(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleCreateOrUpdate} disabled={loading} className="submit-btn">
                {loading ? (editingId ? "Updating..." : "Creating...") : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AllTeachers;
