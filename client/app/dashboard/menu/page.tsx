'use client';
const metadata = {
    title: 'Menu',
  }
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  dishUrl: string;
}

interface DishFormData {
  name: string;
  description: string;
  price: string;
  dishUrl: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  dishName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

interface DishResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  dishUrl: string;
}

const DeleteConfirmationModal = ({ isOpen, dishName, onClose, onConfirm, isDeleting }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete Dish
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete "{dishName}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MenuPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    description: '',
    price: '',
    dishUrl: '',
  });
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    dishId: '',
    dishName: ''
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dish/all-dishes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (result: any) => {
    console.log('Cloudinary upload result:', result);

    if (result.info && result.info.secure_url) {
      const dishUrl = result.info.secure_url;
      console.log('Setting image URL:', dishUrl);
      
      setFormData((prev) => ({
        ...prev,
        dishUrl: dishUrl,
      }));
      
      console.log('Updated form data:', {
        ...formData,
        dishUrl: dishUrl,
      });
    } else {
      console.error('Invalid upload result:', result);
      toast.error('Failed to get image URL');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a dish name');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.dishUrl) {
      toast.error('Please upload an image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      console.log('Sending data to backend:', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        dishUrl: formData.dishUrl,
      });

      const response = await axios.post<DishResponse>('http://localhost:8080/api/dish/add-dish', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        dishUrl: formData.dishUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Backend response:', response.data);

      if (response.status === 200) {
        toast.success('Dish added successfully');
        setFormData({
          name: '',
          description: '',
          price: '',
          dishUrl: '',
        });
        setShowAddForm(false);
        fetchDishes();
      }
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error('Failed to add dish');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dishId: string, dishName: string) => {
    setDeleteModal({ isOpen: true, dishId, dishName });
  };

  const confirmDelete = async () => {
    try {
      setDeletingDishId(deleteModal.dishId);
      const response = await axios.delete(`http://localhost:8080/api/dish/remove/${deleteModal.dishId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        fetchDishes();
        toast.success('Dish deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    } finally {
      setDeletingDishId(null);
      setDeleteModal({ isOpen: false, dishId: '', dishName: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Restaurant Menu</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add New Dish
        </button>
      </div>

      {/* Modal Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-orange-500">
              <h2 className="text-xl font-semibold text-white">Add New Dish</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dish Image
                  </label>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result: any) => {
                      console.log('Upload success:', result);
                      if (result.info && result.info.secure_url) {
                        const dishUrl = result.info.secure_url;
                        setFormData(prev => ({
                          ...prev,
                          dishUrl: dishUrl
                        }));
                        toast.success('Image uploaded successfully');
                      } else {
                        toast.error('Failed to get image URL');
                      }
                    }}
                    onError={(error: any) => {
                      console.error('Upload error:', error);
                      toast.error('Failed to upload image');
                    }}
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                      clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                      maxFileSize: 10000000, // 10MB
                    }}
                  >
                    {({ open }) => (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => open?.()}
                          className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          {formData.dishUrl ? 'Change Image' : 'Upload Image'}
                        </button>
                        
                        {/* Image Preview */}
                        {formData.dishUrl && (
                          <div className="relative w-32 h-32">
                            <img
                              src={formData.dishUrl}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, dishUrl: '' }))}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={dish.dishUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={() => {/* Handle edit */}}
                >
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={() => handleDelete(dish.id, dish.name)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{dish.name}</h3>
                <span className="text-lg font-bold text-orange-500">
                  ${dish.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {dish.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {dishes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No dishes added yet
          </h3>
          <p className="text-gray-500">
            Start by adding your first dish to the menu
          </p>
        </div>
      )}

      <Toaster position="top-right" />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        dishName={deleteModal.dishName}
        onClose={() => setDeleteModal({ isOpen: false, dishId: '', dishName: '' })}
        onConfirm={confirmDelete}
        isDeleting={deletingDishId === deleteModal.dishId}
      />
    </div>
  );
}
