'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UpdateProject({ params }) {
  const router = useRouter();
  // Unwrap params if it's a Promise (Next.js 14+)
  const unwrappedParams = typeof params.then === 'function' ? React.use(params) : params;
  const id = unwrappedParams.id;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    academicYear: '',
    status: '',
    // Add other fields as needed
  });

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getbyid/${id}`)
      .then(res => {
        const data = res.data;
        setProject(data);
        setForm({
          title: data.title || '',
          description: data.description || '',
          department: data.department || '',
          academicYear: data.academicYear || '',
          status: data.status || '',
          isApproved: data.isApproved || false,
          // Add other fields as needed
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch project');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Project updated successfully');
        router.push('/admin/manage-project');
      } else {
        alert('Failed to update project');
      }
    } catch {
      alert('Error updating project');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label className="block mb-1">Department</label>
          <input name="department" value={form.department} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block mb-1">Academic Year</label>
          <input name="academicYear" value={form.academicYear} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="block mb-1 mr-2">Approved</label>
          <input
            type="checkbox"
            name="isApproved"
            checked={form.isApproved}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>
        {/* Add other fields as needed */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Project</button>
      </form>
    </div>
  );
}
