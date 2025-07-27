'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AppContext';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';

const ContributionsPage = () => {
  const { userId } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/getbycontributor/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch contributions');
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
  }, [userId]);

  if (!userId) return <div>Please log in to see your contributions.</div>;
  if (loading) return <div>Loading your contributions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Contributions</h1>
      {projects.length === 0 ? (
        <p>No contributions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="relative group border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-4">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributionsPage;

