import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Accidents() {
  const [accidents, setAccidents] = useState([]);

  // Fetch accidents data from the backend
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/accidents');
        if (response.ok) {
          const data = await response.json();
          setAccidents(data.accidents || []);
        } else {
          toast.error('Failed to fetch accidents. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching accidents:', error);
        toast.error('Error fetching accidents. Please try again later.');
      }
    };

    fetchAccidents();
  }, []);

  // Handle Checkout Button Click
  const handleCheckout = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/accidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Checked Out' }),
      });
  
      if (response.ok) {
        const updatedAccident = await response.json();
        // Update local state
        setAccidents((prevAccidents) =>
          prevAccidents.map((accident) =>
            accident._id === updatedAccident._id ? updatedAccident : accident
          )
        );
        // Notification for successful update
        toast.success('Accident checked out successfully.');
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update status: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating accident:', error);
      toast.error('Error updating accident. Please try again.');
    }
  };
  

  // Convert time to a readable format
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        padding: '20px',
      }}
    >
      <h2
        className="text-center mb-4"
        style={{ color: '#1b558b', fontSize: '24px', fontWeight: 'bold' }}
      >
        Accident Management
      </h2>
      <div
        className="card shadow-lg border-0 rounded-3 card-animate"
        style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
        }}
      >
        <div className="card-body">
          <h3 className="card-title mb-4" style={{ color: '#1b558b' }}>
            List of Accidents
          </h3>
          <ul className="list-group list-group-flush">
            {accidents.length > 0 ? (
              accidents.map((accident) => (
                <li
                  key={accident._id}
                  className="list-group-item bg-light rounded-3 shadow-sm mb-3"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                  }}
                >
                  <div>
                    <strong style={{ color: '#1b558b', fontSize: '18px' }}>
                      {accident.location}, {accident.city}, {accident.state}
                    </strong>
                    <p style={{ marginBottom: '5px' }}>{accident.description}</p>
                    <small className="text-muted">Reported at: {formatTime(accident.time)}</small>
                    <br />
                    <span
                      className={`badge ${
                        accident.status === 'Pending' ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ fontSize: '14px', marginTop: '10px' }}
                    >
                      {accident.status}
                    </span>
                  </div>
                  <div>
                    {/* Conditional Rendering for Checkout Button */}
                    {accident.status !== 'Checked Out' && (
                      <button
                        className="btn btn-primary"
                        style={{
                          backgroundColor: '#1b558b',
                          border: 'none',
                          padding: '10px 20px',
                        }}
                        onClick={() => handleCheckout(accident._id)}
                      >
                        Mark as Checked Out
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center">
                No accidents reported yet.
              </li>
            )}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Accidents;
