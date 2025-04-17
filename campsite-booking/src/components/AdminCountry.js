import React, { useState, useEffect } from 'react';
import './Adminstyles.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CountryPage = () => {
  const [formData, setFormData] = useState({
    _id: '',
    countryName: '',
    countryCode: '',
  });

  const [countries, setCountries] = useState([]); // API countries
  const [dbCountries, setDbCountries] = useState([]); // Database countries

  // Fetch all countries from the API
  const fetchCountriesFromAPI = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      const countryList = res.data.map((country) => ({
        name: country.name.common,
        code: country.cca2, 
      }));
      setCountries(countryList);
    } catch (error) {
      console.error('Error fetching countries from API', error);
      toast.error('Error fetching countries from API');
    }
  };

  // Fetch all countries from the database
  const fetchCountriesFromDB = async () => {
    try {
      const res = await axios.get('http://localhost:9000/admin/country');
      setDbCountries(res.data);
    } catch (error) {
      console.error('Error fetching countries from DB', error);
      toast.error('Error fetching countries from DB');
    }
  };

  useEffect(() => {
    fetchCountriesFromAPI();
    fetchCountriesFromDB();
  }, []);

  const handleChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.code === selectedCountryCode
    );
    if (selectedCountry) {
      setFormData({
        ...formData,
        countryName: selectedCountry.name,
        countryCode: selectedCountry.code,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const countryData = {
      country_name: formData.countryName,
      country_code: formData.countryCode.toUpperCase(),
    };

    try {
      if (formData._id) {
        await axios.put(
          `http://localhost:9000/admin/country/${formData._id}`,
          countryData
        );
        toast.success('Country Updated Successfully');
      } else {
        await axios.post('http://localhost:9000/admin/country', countryData);
        toast.success('Country Added Successfully');
      }

      setFormData({ _id: '', countryName: '', countryCode: '' });
      fetchCountriesFromDB();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  // Properly use handleEdit
  const handleEdit = (country) => {
    setFormData({
      _id: country._id, 
      countryName: country.country_name,
      countryCode: country.country_code,
    });
  };

  // Fixed handleDelete to use _id
  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`http://localhost:9000/admin/country/${countryId}`);
      toast.success('Country Deleted Successfully');
      fetchCountriesFromDB();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="form-container">
      <h2>Manage Country Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="countryCode">Select Country</label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-action">
          <button type="submit" className="btnSubmit">
            {formData._id ? 'Update Country' : 'Add Country'}
          </button>
        </div>
      </form>

      <div className="recent-activity">
        <h2>Country Data</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Country Name</th>
              <th>Country Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dbCountries.length > 0 ? (
              dbCountries.map((country) => (
                <tr key={country._id}>
                  <td>{country.country_name}</td>
                  <td>{country.country_code}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(country)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(country._id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No countries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CountryPage;
