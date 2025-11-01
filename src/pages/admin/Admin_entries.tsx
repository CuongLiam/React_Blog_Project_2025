import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, message } from 'antd';
import AdminHeader from '../../layouts/admin/Header';
import Sidebar_menu from '../../layouts/admin/Sidebar_menu';
import { fetchEntries, addEntry, editEntry, deleteEntry } from '../../store/slices/entrySlice';
import type { AppDispatch } from '../../store';

const ITEMS_PER_PAGE = 5;

export default function Admin_entries() {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { entries, loading, error } = useSelector((state: any) => state.entries);
  
  // State
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch entries on mount
  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  // Computed values
  const filteredCategories = entries.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      message.warning("Category name cannot be empty!");
      return;
    }
    try {
      await dispatch(addEntry({ name: categoryName }));
      setCategoryName("");
      message.success("Category added successfully!");
    } catch {
      message.error("Failed to add category!");
    }
  };

  const handleDeleteCategory = (id: number) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(deleteEntry(id));
          message.success("Category deleted successfully!");
        } catch {
          message.error("Failed to delete category!");
        }
      },
    });
  };

  const handleEditCategory = (id: number) => {
    const category = entries.find((cat: any) => cat.id === id);
    if (!category) return;

    Modal.confirm({
      title: 'Edit Category',
      content: (
        <div>
          <label className="block text-sm font-medium mb-2">Category Name</label>
          <input 
            id="edit-category-name" 
            defaultValue={category.name} 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      ),
      okText: 'Save',
      cancelText: 'Cancel',
      width: 500,
      onOk: async () => {
        const newName = (document.getElementById("edit-category-name") as HTMLInputElement)?.value;
        if (!newName?.trim()) {
          message.error("Category name cannot be empty!");
          return;
        }
        try {
          await dispatch(editEntry({ id, name: newName }));
          message.success("Category updated successfully!");
        } catch {
          message.error("Failed to update category!");
        }
      },
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar_menu activeItem="entries" />
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Search Bar */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search Article Categories"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Manage Categories Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <i className="fas fa-folder text-gray-600 text-xl"></i>
                <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
              </div>

              {/* Add Category Form */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                  onClick={handleAddCategory}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add Category
                </button>
              </div>

              {/* Category List */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <i className="fas fa-list text-gray-600"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Category List</h3>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                      <div className="col-span-2">
                        <span className="text-sm font-semibold text-gray-700">#</span>
                      </div>
                      <div className="col-span-7">
                        <span className="text-sm font-semibold text-gray-700">Category Name</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="text-sm font-semibold text-gray-700">Actions</span>
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <div className="px-6 py-12 text-center">
                        <i className="fas fa-spinner fa-spin text-3xl text-gray-400 mb-3"></i>
                        <p className="text-gray-500">Loading categories...</p>
                      </div>
                    ) : error ? (
                      <div className="px-6 py-12 text-center">
                        <i className="fas fa-exclamation-circle text-3xl text-red-400 mb-3"></i>
                        <p className="text-red-500">{error}</p>
                      </div>
                    ) : currentCategories.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">
                          {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories yet'}
                        </p>
                      </div>
                    ) : (
                      currentCategories.map((category, idx) => (
                        <div key={category.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm text-gray-900">{startIndex + idx + 1}</span>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <span className="text-sm text-gray-900">{category.name}</span>
                          </div>
                          <div className="col-span-3 flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEditCategory(category.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    &lt; Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-2 py-1 rounded ${currentPage === idx + 1 ? "bg-purple-100 text-purple-700 font-bold" : "text-gray-600 hover:text-purple-700"}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
