import 'bootstrap/dist/css/bootstrap.min.css'; // Assuming you're using Bootstrap
import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating to another page


function Doctorpage() {
  const navigate = useNavigate(); // Hook to navigate to another page

  return (
    <div className="page-container">
      <div className="container text-center">
        {/* Doctor's Welcome Image with Rotating Gradient Circle */}
        <div className="image-wrapper">
          <img
            src="https://img.freepik.com/premium-photo/photo-doctor-with-stethoscope-plain-medical-background_763111-13168.jpg" // Placeholder image (replace with actual doctor's image)
            alt="Doctor"
            className="doctor-image" // Class for the image
          />
          <div className="circle-animation"></div> {/* Animated Gradient Circle */}
        </div>

        {/* Motivational and Welcome Text */}
        <h1 className="fade-in" style={{ color: '#1b558b', fontSize: '36px', fontWeight: 'bold' }}>
          Welcome, Doctor!
        </h1>

        <p className="fade-in" style={{ color: '#555', fontSize: '18px', marginBottom: '30px' }}>
          You are making a difference in the world. Thank you for your hard work and dedication.
        </p>

        <p className="fade-in" style={{ color: '#555', fontSize: '16px' }}>
          Every day, you save lives, offer comfort, and inspire those around you. Keep going strong! 💪
        </p>

        {/* Optional Button to Navigate */}
        <button
          className="btn btn-primary bounce" // Bounce animation for the button
          style={{
            backgroundColor: '#1b558b',
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            marginTop: '20px',
          }}
          onClick={() => navigate('/doctor-dashboard')} // Navigate to the dashboard or another route
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Doctorpage;
