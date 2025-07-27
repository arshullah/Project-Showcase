'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '../../../../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userId, authToken, isLoaded } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [project, setProject] = useState({
    title: '',
    description: '',
    abstract: '',
    technologiesUsed: [],
    tags: [],
    categories: [],
    sourceCodeUrl: '',
    thumbnailUrl: '',
    galleryImageUrls: [],
    academicYear: '',
    status: 'Ongoing'
  });

  // Form state for dynamic fields
  const [newTechnology, setNewTechnology] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  
  // Image upload states
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    // Only proceed if auth context has loaded
    if (!isLoaded) return;

    // Check if user is authenticated
    if (!authToken || !userId) {
      router.push('/login');
      return;
    }

    // Fetch project data
    fetchProject();
  }, [id, userId, authToken, isLoaded, router]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/getbyid/${id}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      
      const data = await response.json();
      
      // Check if user is the creator
      if (data.creator._id !== userId) {
        toast.error('You are not authorized to edit this project');
        setError('You are not authorized to edit this project');
        return;
      }

      setProject({
        title: data.title || '',
        description: data.description || '',
        abstract: data.abstract || '',
        technologiesUsed: data.technologiesUsed || [],
        tags: data.tags || [],
        categories: data.categories || [],
        sourceCodeUrl: data.sourceCodeUrl || '',
        thumbnailUrl: data.thumbnailUrl || '',
        galleryImageUrls: data.galleryImageUrls || [],
        academicYear: data.academicYear || '',
        status: data.status || 'Ongoing'
      });
      
      // Set preview images
      setThumbnailPreview(data.thumbnailUrl || '');
      setGalleryPreviews(data.galleryImageUrls || []);
      
      setLoading(false);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch project');
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to update project');
      
      toast.success('Project updated successfully!');
      router.push('/user/myprojects');
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !project.technologiesUsed.includes(newTechnology.trim())) {
      setProject(prev => ({
        ...prev,
        technologiesUsed: [...prev.technologiesUsed, newTechnology.trim()]
      }));
      setNewTechnology('');
      toast.success('Technology added successfully!');
    } else if (newTechnology.trim()) {
      toast.error('Technology already exists!');
    }
  };

  const removeTechnology = (index) => {
    setProject(prev => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim().toLowerCase())) {
      setProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
      toast.success('Tag added successfully!');
    } else if (newTag.trim()) {
      toast.error('Tag already exists!');
    }
  };

  const removeTag = (index) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !project.categories.includes(newCategory.trim())) {
      setProject(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
      toast.success('Category added successfully!');
    } else if (newCategory.trim()) {
      toast.error('Category already exists!');
    }
  };

  const removeCategory = (index) => {
    setProject(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim() && !project.galleryImageUrls.includes(newGalleryImage.trim())) {
      setProject(prev => ({
        ...prev,
        galleryImageUrls: [...prev.galleryImageUrls, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
      toast.success('Gallery image URL added successfully!');
    } else if (newGalleryImage.trim()) {
      toast.error('Gallery image URL already exists!');
    }
  };

  const removeGalleryImage = (index) => {
    setProject(prev => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Cloudinary upload functions
  const handleFileUpload = async (file, field) => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, GIF, etc.).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mypreset');
    formData.append('cloud_name', 'drujtbnjk');

    try {
      if (field === 'thumbnailUrl') {
        setUploadingThumbnail(true);
      } else if (field === 'galleryImageUrls') {
        setUploadingGallery(true);
      }

      const response = await axios.post('https://api.cloudinary.com/v1_1/drujtbnjk/image/upload', formData);
      const url = response.data.secure_url;

      if (field === 'thumbnailUrl') {
        setProject(prev => ({ ...prev, thumbnailUrl: url }));
        setThumbnailPreview(url);
        setUploadingThumbnail(false);
        toast.success('Thumbnail uploaded successfully!');
      } else if (field === 'galleryImageUrls') {
        setProject(prev => ({ ...prev, galleryImageUrls: [...prev.galleryImageUrls, url] }));
        setGalleryPreviews(prev => [...prev, url]);
        setUploadingGallery(false);
        toast.success('Gallery image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image.');
      setUploadingThumbnail(false);
      setUploadingGallery(false);
    }
  };

  const removeGalleryImageByIndex = (index) => {
    setProject(prev => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Show loading while authentication context is being loaded
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Authentication Required</p>
            <p className="text-muted-foreground mb-4">Please log in to edit projects.</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive mb-2">Error</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/user/myprojects')}>
              Back to My Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Update Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={project.title}
                  onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  maxLength={150}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => setProject(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={project.abstract}
                onChange={(e) => setProject(prev => ({ ...prev, abstract: e.target.value }))}
                placeholder="Enter project abstract (max 300 characters)"
                rows={3}
                maxLength={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={project.academicYear}
                onChange={(e) => setProject(prev => ({ ...prev, academicYear: e.target.value }))}
                placeholder="e.g., 2024-2025"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologiesUsed.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add category"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                />
                <Button type="button" onClick={addCategory} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.categories.map((category, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceCodeUrl">Source Code URL</Label>
              <Input
                id="sourceCodeUrl"
                type="url"
                value={project.sourceCodeUrl}
                onChange={(e) => setProject(prev => ({ ...prev, sourceCodeUrl: e.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
              <p className="text-sm text-muted-foreground">Upload an image file</p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'thumbnailUrl')}
                      className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                      disabled={uploadingThumbnail}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploadingThumbnail}
                      className="flex items-center gap-2"
                    >
                      {uploadingThumbnail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {thumbnailPreview && (
                  <div className="relative inline-block">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail Preview" 
                      className="w-32 h-32 object-cover rounded-lg shadow border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProject(prev => ({ ...prev, thumbnailUrl: '' }));
                        setThumbnailPreview('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <p className="text-sm text-muted-foreground">Upload image files</p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'galleryImageUrls')}
                      className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                      disabled={uploadingGallery}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploadingGallery}
                      className="flex items-center gap-2"
                    >
                      {uploadingGallery ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {/* Gallery Image Previews */}
                <div className="flex flex-wrap gap-3">
                  {galleryPreviews.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Gallery Preview ${index + 1}`} 
                        className="w-32 h-32 object-cover rounded-lg shadow border"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImageByIndex(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/user/myprojects')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProjectPage; 