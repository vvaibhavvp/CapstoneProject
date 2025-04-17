import React, { useEffect, useState } from "react";
import axios from "axios";

const Camps = () => {
  const [campsites, setCampsites] = useState([]);

  useEffect(() => {
    // Fetch campsite data from backend
    axios
      .get("http://localhost:9000/admin/campsite")
      .then((response) => setCampsites(response.data))
      
      .catch((error) => console.error("Error fetching campsites:", error));
  }, []);
  console.log(campsites)
  return (
    
    <div className="container">
      <h2>Campsite Locations</h2>
      <div className="camp-list">
        {campsites.length > 0 ? (
          campsites.map((camp) => (
            <div key={camp._id} className="camp-card">
              <h3>{camp.campsite_name}</h3>
              <p>{camp.description}</p>
              <p>
                {console.log(camp.amount)}
                <strong>Price:</strong> ${camp.amount.$numberDecimal}
              </p>
              <p>
                <strong>Location:</strong> {camp.address}
              </p>
            </div>
          ))
        ) : (
          <p>No campsites available.</p>
        )}
      </div>
    </div>
  );
};

export default Camps;
