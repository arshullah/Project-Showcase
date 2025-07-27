'use client';
import { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AppContext';

const ProjectForm = ({ onSubmit }) => {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    abstract: '',
    contributors: [''],
    technologiesUsed: [''],
    tags: [''],
    sourceCodeUrl: '',
    thumbnailUrl: '',
    galleryImageUrls: [],
    categories: [],
    academicYear: '',
    status: 'Ongoing',
    creator: userId || '', // Set to userId from context
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Autocomplete state for contributors
  const [contributorSuggestions, setContributorSuggestions] = useState([]);
  const [contributorInputs, setContributorInputs] = useState(['']); // for display
  const [showSuggestions, setShowSuggestions] = useState([]); // array of booleans
  const suggestionTimeout = useRef([]);

  // Update contributorInputs when contributors change (for edit/add)
  // Keep contributorInputs in sync with formData.contributors if needed

  // Fetch suggestions from backend
  const fetchContributorSuggestions = async (value, idx) => {
    if (!value) {
      setContributorSuggestions((prev) => {
        const updated = [...prev];
        updated[idx] = [];
        return updated;
      });
      return;
    }
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/search?query=${encodeURIComponent(value)}`);
      setContributorSuggestions((prev) => {
        const updated = [...prev];
        updated[idx] = res.data;
        return updated;
      });
    } catch (err) {
      setContributorSuggestions((prev) => {
        const updated = [...prev];
        updated[idx] = [];
        return updated;
      });
    }
  };

  // Handle contributor input change
  const handleContributorInput = (e, idx) => {
    const value = e.target.value;
    setContributorInputs((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
    setShowSuggestions((prev) => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    // Debounce fetch
    if (suggestionTimeout.current[idx]) clearTimeout(suggestionTimeout.current[idx]);
    suggestionTimeout.current[idx] = setTimeout(() => {
      fetchContributorSuggestions(value, idx);
    }, 200);
  };

  // When a suggestion is selected
  const handleSelectContributor = (user, idx) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.contributors[idx] = user._id;
      return updated;
    });
    setContributorInputs((prev) => {
      const updated = [...prev];
      updated[idx] = `${user.name} (${user.email})`;
      return updated;
    });
    setShowSuggestions((prev) => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
    setContributorSuggestions((prev) => {
      const updated = [...prev];
      updated[idx] = [];
      return updated;
    });
  };

  // Add contributor field
  const addContributorField = () => {
    setFormData((prev) => ({ ...prev, contributors: [...prev.contributors, ''] }));
    setContributorInputs((prev) => [...prev, '']);
    setShowSuggestions((prev) => [...prev, false]);
    setContributorSuggestions((prev) => [...prev, []]);
  };

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;

    if (Array.isArray(formData[name])) {
      const updatedArray = [...formData[name]];
      updatedArray[index] = value;
      setFormData({ ...formData, [name]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addField = (name) => {
    setFormData({ ...formData, [name]: [...formData[name], ''] });
  };

  const handleFileUpload = async (file, field) => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mypreset');
    formData.append('cloud_name', 'drujtbnjk');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/drujtbnjk/image/upload', formData);
      const url = response.data.secure_url;

      if (field === 'thumbnailUrl') {
        setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
        setThumbnailPreview(url);
      } else if (field === 'galleryImageUrls') {
        setFormData((prev) => ({ ...prev, galleryImageUrls: [...prev.galleryImageUrls, url] }));
        setGalleryPreviews((prev) => [...prev, url]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image.');
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out empty or invalid contributors
    const validContributors = formData.contributors.filter(
      (id) => typeof id === 'string' && id.match(/^[a-fA-F0-9]{24}$/)
    );
    if (validContributors.length === 0) {
      alert('Please select at least one valid contributor.');
      return;
    }
    if (!userId) {
      alert('You must be logged in to submit a project.');
      return;
    }
    const submitData = { ...formData, contributors: validContributors, creator: userId };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/project/add`, submitData);
      alert('Project added successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error adding project:', error);
      alert('An error occurred while adding the project.');
    }
  };

  const CATEGORY_OPTIONS = [
    'Computer Science',
    'Engineering',
    'Mobile Development',
    'Web Development',
    'Data Science',
    'AI/ML',
    'Blockchain',
    'IoT',
    'AR/VR',
    'Design',
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-t-xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Submit Your Project</h2>
        <p className="opacity-80">Showcase your work and inspire others!</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-xl p-8 space-y-6 border-t-4 border-blue-500">
        <div>
          <label className="block font-semibold mb-1">Project Title</label>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" required maxLength={150} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Abstract</label>
          <textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Abstract" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" maxLength={300} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Contributors (User)</label>
          {formData.contributors.map((val, i) => (
            <div key={i} className="relative">
              <input
                name="contributors"
                value={contributorInputs[i] || ''}
                onChange={(e) => handleContributorInput(e, i)}
                className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 transition"
                required
                autoComplete="off"
                onFocus={() => setShowSuggestions((prev) => { const updated = [...prev]; updated[i] = true; return updated; })}
                onBlur={() => setTimeout(() => setShowSuggestions((prev) => { const updated = [...prev]; updated[i] = false; return updated; }), 150)}
                placeholder="Type name or email..."
              />
              {showSuggestions[i] && contributorSuggestions[i] && contributorSuggestions[i].length > 0 && (
                <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1">
                  {contributorSuggestions[i].map((user) => (
                    <li
                      key={user._id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => handleSelectContributor(user, i)}
                    >
                      <span className="font-medium">{user.name}</span> <span className="text-gray-500">({user.email})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <button type="button" onClick={addContributorField} className="text-blue-600 mt-2 font-medium hover:underline">+ Add Contributor</button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Technologies Used</label>
          {formData.technologiesUsed.map((val, i) => (
            <input key={i} name="technologiesUsed" value={val} onChange={(e) => handleChange(e, i, 'technologiesUsed')} className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 transition" />
          ))}
          <button type="button" onClick={() => addField('technologiesUsed')} className="text-blue-600 mt-2 font-medium hover:underline">+ Add Technology</button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Tags</label>
          {formData.tags.map((val, i) => (
            <input key={i} name="tags" value={val} onChange={(e) => handleChange(e, i, 'tags')} className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 transition" />
          ))}
          <button type="button" onClick={() => addField('tags')} className="text-blue-600 mt-2 font-medium hover:underline">+ Add Tag</button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Thumbnail Image</label>
          <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'thumbnailUrl')} className="w-full p-3 border rounded-lg" />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow" />}
        </div>
        <div>
          <label className="block font-semibold mb-1">Gallery Images</label>
          <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'galleryImageUrls')} className="w-full p-3 border rounded-lg" />
          <div className="mt-2 flex flex-wrap gap-3">
            {galleryPreviews.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`Gallery Preview ${i + 1}`} className="w-32 h-32 object-cover rounded-lg shadow" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700 transition"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(cat)}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      categories: e.target.checked
                        ? [...prev.categories, cat]
                        : prev.categories.filter(c => c !== cat)
                    }));
                  }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Academic Year</label>
          <input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="Academic Year (e.g., 2024-2025)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition">
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-3 rounded-lg font-bold text-lg shadow hover:scale-105 hover:from-blue-700 hover:to-indigo-600 transition-all">Submit Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
