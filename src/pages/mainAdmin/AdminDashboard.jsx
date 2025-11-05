import React from "react";
import AdminLayout from "./AdminLayout/AdminLayout";
import "./AdminDashboard.css";
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import MetricCard from "../../components/AdminUI/MetricCard";
import TableMini from "../../components/AdminUI/TableMini";
import ListCompact from "../../components/AdminUI/ListCompact";
import QuickActionsBar from "../../components/AdminUI/QuickActionsBar";
import AlertsBar from "../../components/AdminUI/AlertsBar";
import "../../components/AdminUI/admin-ui.css";
import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ users:null, courses:null, teachers:null, students:null, enroll7:0, rev7:0 });
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [alerts, setAlerts] = useState({ pendingInv:0, expiring:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const start7 = new Date(now.getTime() - 7*24*60*60*1000);

    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Dashboard metrics from new backend
        try {
          const dashRes = await axios.get('/api/admin/dashboard', { headers });
          if (dashRes.data?.success) {
            const m = dashRes.data.metrics;
            setMetrics({
              users: m.users,
              courses: m.courses,
              teachers: m.teachers,
              students: m.students,
              enroll7: m.enroll7 || 0,
              rev7: m.rev7 || 0
            });
          }
        } catch (err) {
          console.error('Dashboard fetch error:', err);
        }

        // Payments 7d
        const params = { limit: 5 };
        let payRows = [];
        try {
          const pr = await axios.get('/api/admin/payments', { headers, params });
          const list = pr.data?.payments || pr.data?.items || [];
          payRows = list.slice(0, 5).map(x => ({
            id: x._id,
            name: x.studentId?.name || x.user?.name || '—',
            course: x.courseId?.name || x.course?.name || '—',
            amount: x.amount,
            status: x.status || 'unknown',
            at: x.createdAt
          }));
          setPayments(payRows);
        } catch (err) {
          console.error('Payments fetch error:', err);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const paymentCols = useMemo(() => ([
    { key: 'name', label: 'Student' },
    { key: 'course', label: 'Course' },
    { key: 'amount', label: 'Amount', render: v => new Intl.NumberFormat('en-IN',{style:'currency', currency:'INR'}).format(Number(v||0)) },
    { key: 'status', label: 'Status', render: v => (<span className={`admin-chip ${String(v).toLowerCase()==='paid'?'success':'warning'}`}>{v}</span>) },
    { key: 'at', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ]), []);

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <AlertsBar pendingInvoices={alerts.pendingInv} expiringEnrollments={alerts.expiring} />

        <div className="admin-grid" style={{marginTop:16}}>
          <div style={{gridColumn:'span 2'}}><MetricCard title="Total Users" value={metrics.users ?? '—'} icon={<FaUsers/>} /></div>
          <div style={{gridColumn:'span 2'}}><MetricCard title="Live Courses" value={metrics.courses ?? '—'} icon={<FaBookOpen/>} /></div>
          <div style={{gridColumn:'span 2'}}><MetricCard title="Teachers" value={metrics.teachers ?? '—'} icon={<FaChalkboardTeacher/>} /></div>
          <div style={{gridColumn:'span 2'}}><MetricCard title="Students" value={metrics.students ?? '—'} icon={<FaUserGraduate/>} /></div>
          <div style={{gridColumn:'span 2'}}><MetricCard title="New Enrollments (7d)" value={metrics.enroll7 ?? 0} icon={<FaUserGraduate/>} /></div>
          <div style={{gridColumn:'span 2'}}><MetricCard title="Revenue (7d)" value={new Intl.NumberFormat('en-IN',{style:'currency', currency:'INR'}).format(Number(metrics.rev7||0))} icon={<FaBookOpen/>} /></div>
        </div>

        <div className="admin-grid" style={{marginTop:16}}>
          <div style={{gridColumn:'span 5'}}>
            <ListCompact title="Upcoming Classes" items={classes} renderRight={(it)=> <span className="admin-chip">{it.at}</span>} />
          </div>
          <div style={{gridColumn:'span 7'}}>
            <TableMini title="Recent Payments" columns={paymentCols} rows={payments.slice(0,5)} />
          </div>
        </div>

        <div style={{marginTop:16}}>
          <QuickActionsBar />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
