import React, { useState, useEffect } from 'react';
import './Adminstyles.css';
import axios from "axios";
import { toast } from "react-hot-toast";

const StatePage = () => {
    const [formData, setFormData] = useState({
        stateName: '',
        countryId: '', // To store selected country ID
        states: [] // List of states for the selected country
    });

    const [countries, setCountries] = useState([]);

    // Fetch countries from your backend
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get('http://localhost:9000/admin/country'); 
                console.log(res.data);
                setCountries(res.data); 
            } catch (error) {
                console.error('Error fetching countries', error);
                toast.error('Error fetching countries');
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = async (e) => {
        const selectedCountryCode = e.target.value; // Get the selected country code (e.g., 'US', 'IN')
        console.log('Selected Country Code:', selectedCountryCode); // Log to debug
    
        // Reset the state value when the country changes
        setFormData((prevData) => ({
            ...prevData,
            countryId: selectedCountryCode, // Keep the selected country code
            stateName: '' // Reset the state selection
        }));
    
        if (selectedCountryCode) {
            try {
                // Fetch states from the external API based on selected country code
                const response = await fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountryCode}/states`, {
                    method: 'GET',
                    headers: {
                        "X-CSCAPI-KEY": "bGpRbHBDZ2d6QjlkMENJd1I4VEM2NWFpcWJUNHc3MlZuUkhSUHh0Qw==" // Your API Key
                    }
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch states");
                }
    
                const states = await response.json();
                console.log('Fetched States:', states); // Log states to verify the data format
    
                // Update the formData state with fetched states while preserving the countryId
                setFormData((prevData) => ({
                    ...prevData,
                    states: states // Add the fetched states to the formData
                }));
            } catch (error) {
                console.error('Error fetching states', error);
                toast.error('Error fetching states');
            }
        }
    };    
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log('Adding State data:', formData);

        const stateData = {
            state_name: formData.stateName,
            country_id: formData.countryId, // Use countryId when saving
        };

        try {
            const res = await axios.post('http://localhost:9000/admin/state', stateData);
            console.log(res.data);
            if (res.data) {
                toast.success('State Added Successfully');
                setFormData({ stateName: '', countryId: '', states: [] });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error: ' + err.response?.data?.message || 'error occurred');
        }
    };

    return (
        <div className="form-container">
            <h2>Manage State Data</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select name="country" value={formData.countryId} onChange={handleCountryChange} required>
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country._id} value={country.country_code}> {/* Use country_code */}
                                {country.country_name}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div className="form-group">
                    <label htmlFor="stateName">State</label>
                    <select name="stateName" value={formData.stateName} onChange={handleChange} required>
                        <option value="">Select a state</option>
                        {formData.states.length > 0 ? (
                            formData.states.map((state) => (
                                <option key={state.iso2 || state.name} value={state.name}>
                                    {state.name}
                                </option>
                            ))
                        ) : (
                            <option>No states available</option>
                        )}
                    </select>
                </div>
    
                <div className="form-action">
                    <button type="submit" className="btnSubmit">Add State</button>
                </div>
            </form>
        </div>
    );
}
export default StatePage;
