import React, { useEffect, useState } from 'react';

function BloodRequestList() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // Fetch blood requests when the component mounts
  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await fetch('http://localhost:2000/blood/requests'); // Adjust URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch blood requests');
        }
        const data = await response.json();
        setRequests(data);  // Store the fetched data in the state
      } catch (err) {
        setError(err.message);  // Set error if something goes wrong
      }
    };

    fetchBloodRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Blood Requests</h2>

      {/* Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display blood requests in a table */}
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Blood Type</th>
              <th>Quantity Requested (ml)</th>
              <th>Patient Name</th>
              <th>Contact</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No blood requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.bloodType}</td>
                  <td>{request.quantity}</td>
                  <td>{request.name}</td>
                  <td>{request.contact}</td>
                  <td>{request.priority}</td>
                  <td>{request.status}</td> {/* Assuming 'status' field is present */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BloodRequestList;
