'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Pencil, Trash2, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/user';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/getall`);
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert('Error deleting user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <Users className="h-7 w-7" /> Manage Users
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-lg text-gray-600">Loading users...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No users found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700">Role</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-blue-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center flex gap-2 justify-center">
                      <Button size="sm" variant="outline" className="flex items-center gap-1" disabled>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(user._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;