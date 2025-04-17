import React, { useState, useEffect } from 'react';
import './Adminstyles.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CampsiteAddPage = () => {
  const [formData, setFormData] = useState({
    campsite_name: '',
    description: '',
    address: '',
    country_id: '',
    state: '',
    city: '',
    amount: '',
    amenities: [],
    image: [],
    availability: '',
    category_id: '',
    tags: [],
    start_date: '',
    end_date: ''
    // average_rating: 0,
    // reatings: []
  });

  const [states, setStates] = useState([]);  
  const [cities, setCities] = useState([]);  
  const [categories, setCategories] = useState([]);  
  const [countries, setCountries] = useState([]);
  const [campsites, setCampsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const tagOptions = ['Pet-Friendly', 'Mountain-View', 'Lake-Side', 'Family-Friendly', 'Romantic'];

  useEffect(() => {
    axios.get('http://localhost:9000/admin/country')
      .then(response => {
        setCountries(response.data);
      })
      .catch(err => console.error(err));

    axios.get('http://localhost:9000/admin/category')
      .then(response => setCategories(response.data))
      .catch(err => console.error(err));

      axios.get('http://localhost:9000/campsite/campsitelist')
      .then(response => {
        console.log(response.data);
        setCampsites(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountryCode = e.target.value;
    
    setFormData((prevData) => ({
        ...prevData,
        country_id: selectedCountryCode,
        state: '',
        city: '',
    }));

    if (selectedCountryCode) {
        try {
            const response = await fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountryCode}/states`, {
                method: 'GET',
                headers: {
                    "X-CSCAPI-KEY": "bGpRbHBDZ2d6QjlkMENJd1I4VEM2NWFpcWJUNHc3MlZuUkhSUHh0Qw==" 
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch states");
            }

            const statesData = await response.json();
            setStates(statesData); // Update states in state variable
        } catch (error) {
            console.error('Error fetching states', error);
            toast.error('Error fetching states');
        }
    }
};

const handleStateChange = async (e) => {
  const selectedStateCode = e.target.value;
  
  setFormData((prevData) => ({
      ...prevData,
      state: selectedStateCode,
      city: '',
  }));

  if (selectedStateCode) {
      try {
          const response = await fetch(`https://api.countrystatecity.in/v1/countries/${formData.country_id}/states/${selectedStateCode}/cities`, {
              method: 'GET',
              headers: {
                  "X-CSCAPI-KEY": "bGpRbHBDZ2d6QjlkMENJd1I4VEM2NWFpcWJUNHc3MlZuUkhSUHh0Qw=="
              }
          });

          if (!response.ok) {
              throw new Error("Failed to fetch cities");
          }

          const citiesData = await response.json();
          setCities(citiesData); // Update cities in state variable
      } catch (error) {
          console.error('Error fetching cities', error);
          toast.error('Error fetching cities');
      }
  }
};
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleTagChange = (tag) => {
    setFormData((prevFormData) => {
      const tags = prevFormData.tags.includes(tag)
        ? prevFormData.tags.filter((t) => t !== tag)
        : [...prevFormData.tags, tag];
      return { ...prevFormData, tags };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, image: files });
  };

  // const handleAmenityChange = (e) => {
  //   const { value, checked } = e.target;
  //   setFormData((prevData) => {
  //     const amenities = checked
  //       ? [...prevData.amenities, value]
  //       : prevData.amenities.filter((amenity) => amenity !== value);
  //     return { ...prevData, amenities };
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
  
    // Append all formData fields to formDataToSend
    Object.keys(formData).forEach((key) => {
      if (key === 'image') {
        formData.image.forEach((img) => formDataToSend.append('image', img));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      const endpoint = formData._id ? `http://localhost:9000/admin/editcampsite/${formData._id}` : 'http://localhost:9000/admin/campsite';
      const method = formData._id ? 'put' : 'post';
      await axios[method](endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(formData._id ? 'Campsite updated successfully!' : 'Campsite added successfully!');
      setShowForm(false);
      
      setFormData({
        campsite_name: '',
        description: '',
        address: '',
        country_id: '',
        state: '',
        city: '',
        amount: '',
        amenities: [],
        image: [],
        availability: '',
        category_id: '',
        tags: [],
        start_date: '',
        end_date: ''
      });
  
      // Fetch the updated campsite list
      const response = await axios.get('http://localhost:9000/campsite/campsitelist');
      setCampsites(response.data);
    } catch (error) {
      console.error('Error adding campsite:', error);
      toast.error('Error: ' + error.response?.data?.message || 'Error occurred');
    }
  };  
  

  const handleEdit = (campsite) => {
    setFormData(campsite);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/admin/removecampsite/${id}`);
      toast.success('Campsite deleted successfully!');
      const response = await axios.get('http://localhost:9000/campsite/campsitelist');
      setCampsites(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: ' + error.response?.data?.message || 'Error occurred');
    }
  };

  const filteredCampsites = campsites.filter((campsite) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      campsite.campsite_name.toLowerCase().includes(searchLower) ||
      campsite.address.toLowerCase().includes(searchLower) ||
      campsite.city.toLowerCase().includes(searchLower) ||
      campsite.country_id.toLowerCase().includes(searchLower) ||
      campsite.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      campsite.availability.toLowerCase().includes(searchLower)
    );
  });
  

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center' }}>Campsites Management</h2>
      
      <div className="admin-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search campsites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>
        <button onClick={() => { setShowForm(true); setFormData({ ...formData, _id: undefined }) }} className="admin-button">Add Campsite</button>
        
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="campsite_name">Campsite Name</label>
            <input
              type="text"
              name="campsite_name"
              value={formData.campsite_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
              <select name="country" value={formData.country_id} onChange={handleCountryChange} required>
                <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
              </select>
          </div>
      
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select name="state" value={formData.state} onChange={handleStateChange} required>
              <option value="">Select a state</option>
              {states.length > 0 ? (
                states.map((state) => (
                  <option key={state.iso2 || state.name} value={state.iso2}>
                    {state.name}
                  </option>
                ))
              ) : (
                <option>No states available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Select a city</option>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city.id || city.name} value={city.name}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option>No cities available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amenities">Amenities</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Fully Booked">Fully Booked</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-checkboxes">
              {tagOptions.map((tag) => (
                <label key={tag}>
                  <input type="checkbox" checked={formData.tags.includes(tag)} onChange={() => handleTagChange(tag)} />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">Start Date</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date</label>
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} min={formData.start_date || new Date().toISOString().split('T')[0]} required />
          </div>

          <div className="form-group">
            <label htmlFor="image">Images</label>
            <input
              type="file"
              name="image"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>

          <button type="submit">{formData._id ? 'Update' : 'Add'} Campsite</button>
        </form>
      )}

      <div className="recent-activity">
        <h2>Campsite Data</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Campsite Name</th>
                <th>Address</th>
                <th>Amount (Per Night)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampsites.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No campsites found</td>
                </tr>
              ) : (
                filteredCampsites.map((campsite) => {
                  // Check if the amount is a valid number
                  const formattedAmount = campsite.amount && !isNaN(parseFloat(campsite.amount.$numberDecimal))
                  ? parseFloat(campsite.amount.$numberDecimal).toFixed(2)
                  : 'N/A';
                  return (
                    <tr key={campsite._id}>
                      <td>{campsite.campsite_name}</td>
                      <td>{campsite.address}</td>
                      <td>{formattedAmount}</td> {/* Safely display the amount */}
                      <td className="actions-cell">
                        <button onClick={() => handleEdit(campsite)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(campsite._id)} className="delete-button">Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
      </div>


    </div>
  );
};

export default CampsiteAddPage;
