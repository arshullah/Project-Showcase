import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/admin-profile" className="bg-white shadow rounded-lg p-6 hover:bg-blue-50 transition">
          <div className="font-semibold text-lg mb-2">Profile</div>
          <div className="text-gray-500">View and edit your admin profile.</div>
        </Link>
        <Link href="/admin/add-project" className="bg-white shadow rounded-lg p-6 hover:bg-blue-50 transition">
          <div className="font-semibold text-lg mb-2">Add Project</div>
          <div className="text-gray-500">Submit a new project for review.</div>
        </Link>
        <Link href="/admin/manage-project" className="bg-white shadow rounded-lg p-6 hover:bg-blue-50 transition">
          <div className="font-semibold text-lg mb-2">Manage Projects</div>
          <div className="text-gray-500">Approve, edit, or delete projects.</div>
        </Link>
        <Link href="/admin/manage-user" className="bg-white shadow rounded-lg p-6 hover:bg-blue-50 transition">
          <div className="font-semibold text-lg mb-2">Manage Users</div>
          <div className="text-gray-500">View and manage user accounts.</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;