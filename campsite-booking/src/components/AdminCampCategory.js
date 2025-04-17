import React, { useState, useEffect } from 'react';
import './Adminstyles.css';
import axios from "axios";
import { toast } from "react-hot-toast";

const CampCategoryPage = () => {

    const [formData, setFormData] = useState({
        categoryName: '',
        categoryDescription: '',
    });

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
  
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setFilteredCategories(
          categories.filter((category) =>
            category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }, [searchQuery, categories]);

    const fetchCategories = async () => {
        try {
        const res = await axios.get('http://localhost:9000/admin/category');
        setCategories(res.data);
        setFilteredCategories(res.data);
        } catch (err) {
        console.error(err);
        toast.error('Error fetching categories');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log('Adding Category data:', formData);
    
        const campCategoryData = {
            category_name: formData.categoryName,
            category_description: formData.categoryDescription,
            created_at: new Date().toISOString(),
        };
    
        try {
            const res = formData._id
                ? await axios.put(`http://localhost:9000/admin/category/${formData._id}`, campCategoryData)
                : await axios.post('http://localhost:9000/admin/category', campCategoryData);

            toast.success(res.data.message);
            setFormData({ categoryName: '', categoryDescription: '' });
            fetchCategories(); 
            setShowForm(false);
        } catch (err) {
            console.error(err);
            toast.error('Error: ' + err.response?.data?.message || 'error occures');
        }
    };

    const handleEdit = (category) => {
        setFormData({
          _id: category._id,
          categoryName: category.category_name,
          categoryDescription: category.category_description,
        });
        setShowForm(true);
      };
    
      const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:9000/admin/category/${id}`);
          toast.success('Category deleted successfully!');
          fetchCategories(); 
        } catch (err) {
          console.error(err);
          toast.error('Error: ' + err.response?.data?.message || 'Error occurred');
        }
      };
    
      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

    return (
        <div className="form-container">
        <h2>Manage Category Data</h2>

        <div className="admin-actions">
            <div className="search-container">
            <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="admin-search"
            />
            </div>
            <button onClick={() => { setShowForm(true); setFormData({ ...formData, _id: undefined }) }} className="admin-button">Add Category</button>
        </div>

        {showForm && (
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor='categoryName'>Category</label>
                <input
                type="text"
                name="categoryName"
                placeholder="Camping Category"
                value={formData.categoryName}
                onChange={handleChange}
                required
                />
            </div>
    
            <div className="form-group">
                <label htmlFor='categoryDescription'>Category Description</label>
                <textarea
                name="categoryDescription"
                placeholder="Category Description"
                value={formData.categoryDescription}
                onChange={handleChange}
                required
                />
            </div>
    
            <div className="form-action">
                <button type="submit" className="btnSubmit">
                {formData._id ? 'Update Category' : 'Add Category'}
                </button>
            </div>
            </form>
        )}

        <div className="recent-activity">
            <h2>Categories</h2>
            <table className="admin-table">
            <thead>
                <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredCategories.length === 0 ? (
                <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                    No categories available
                    </td>
                </tr>
                ) : (
                filteredCategories.map((category) => (
                    <tr key={category._id}>
                    <td>{category.category_name}</td>
                    <td>{category.category_description}</td>
                    <td>
                        <button onClick={() => handleEdit(category)} className="edit-button">
                        Edit
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="delete-button">
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

      </div>
    );
};

export default CampCategoryPage;
