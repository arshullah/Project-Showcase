'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/project'; // Adjust if needed

export default function ManageProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/getall-nonapv`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch {
      alert('Error deleting project');
    }
  };

  const handleUpdate = (id) => {
    router.push(`/admin/update-project/${id}`);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>
      {projects.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project._id} className="border p-4 rounded shadow flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.department} | {project.academicYear}</p>
                <p className="mt-2">{project.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button onClick={() => handleUpdate(project._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
                <button onClick={() => handleDelete(project._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
