'use client';
import { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AppContext';

const ProjectForm = ({ onSubmit }) => {
  const { userId, userRole } = useContext(AuthContext);
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
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Contributor autocomplete state
  const [contributorSuggestions, setContributorSuggestions] = useState([]);
  const [contributorInputs, setContributorInputs] = useState(['']);
  const [showSuggestions, setShowSuggestions] = useState([]);
  const suggestionTimeout = useRef([]);

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
    if (!userId || userRole !== 'admin') {
      alert('You must be logged in as an admin to submit a project.');
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Submit Project</h2>

      <input name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-2 border rounded" required maxLength={150} />
      
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />

      <textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Abstract" className="w-full p-2 border rounded" maxLength={300} />

      <div>
        <label>Contributors (User)</label>
        {formData.contributors.map((val, i) => (
          <div key={i} className="relative">
            <input
              name="contributors"
              value={contributorInputs[i] || ''}
              onChange={(e) => handleContributorInput(e, i)}
              className="w-full p-2 border rounded mt-1"
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
        <button type="button" onClick={addContributorField} className="text-blue-500 mt-1">+ Add Contributor</button>
      </div>

      <div>
        <label>Technologies Used</label>
        {formData.technologiesUsed.map((val, i) => (
          <input key={i} name="technologiesUsed" value={val} onChange={(e) => handleChange(e, i, 'technologiesUsed')} className="w-full p-2 border rounded mt-1" />
        ))}
        <button type="button" onClick={() => addField('technologiesUsed')} className="text-blue-500 mt-1">+ Add Technology</button>
      </div>

      <div>
        <label>Tags</label>
        {formData.tags.map((val, i) => (
          <input key={i} name="tags" value={val} onChange={(e) => handleChange(e, i, 'tags')} className="w-full p-2 border rounded mt-1" />
        ))}
        <button type="button" onClick={() => addField('tags')} className="text-blue-500 mt-1">+ Add Tag</button>
      </div>

      <div>
        <label>Thumbnail Image</label>
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'thumbnailUrl')} className="w-full p-2 border rounded" />
        {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover" />}
      </div>

      <div>
        <label>Gallery Images</label>
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'galleryImageUrls')} className="w-full p-2 border rounded" />
        <div className="mt-2 flex flex-wrap gap-2">
          {galleryPreviews.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt={`Gallery Preview ${i + 1}`} className="w-32 h-32 object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Categories</label>
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

      <input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="Academic Year (e.g., 2024-2025)" className="w-full p-2 border rounded" />

      <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
        <option value="Archived">Archived</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit Project</button>
    </form>
  );
};

export default ProjectForm;
