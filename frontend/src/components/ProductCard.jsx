'use client'
import Link from 'next/link';
import React from 'react';

const ProductCard = ({
  _id,
  title,
  description,
  abstract,
  contributors,
  technologiesUsed,
  tags,
  sourceCodeUrl,
  thumbnailUrl,
  department,
  academicYear,
  status,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md w-full p-4">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 italic">{abstract}</p>
        <div className="text-sm mt-2">
          <span className="font-semibold">Department:</span> {department}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Academic Year:</span> {academicYear}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Status:</span> {status}
        </div>

        <div className="mt-2">
          <span className="font-semibold text-sm text-gray-700">Technologies:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {technologiesUsed.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <span className="font-semibold text-sm text-gray-700">Tags:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <Link className='bg-red-500' href={'/project-detail/'+_id}>View project</Link>
        <a
          href={sourceCodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          View Source Code
        </a>
       
        
      </div>
    </div>
  );
};

export default ProductCard;
