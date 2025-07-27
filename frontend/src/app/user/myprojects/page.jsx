'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AppContext';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const MyProjectsPage = () => {
  const { userId, authToken, isLoaded } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/getbycreator/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Only proceed if auth context has loaded
    if (!isLoaded) return;

    // Check if user is authenticated
    if (!authToken || !userId) {
      return;
    }

    fetchProjects();
  }, [userId, authToken, isLoaded]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      fetchProjects();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading while authentication context is being loaded
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!authToken || !userId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Authentication Required</p>
            <p className="text-muted-foreground mb-4">Please log in to see your projects.</p>
            <Button asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive mb-2">Error</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="relative group border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-4">
              {/* Project Card Details (handles thumbnail) */}
              <ProjectCard {...project} />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                >
                  <a href={`/user/myprojects/update/${project._id}`}>Edit</a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project._id)}
                  disabled={deletingId === project._id}
                >
                  {deletingId === project._id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
