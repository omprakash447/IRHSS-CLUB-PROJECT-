import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import React, { useEffect, useState } from 'react';

function DrBloodDonation() {
  const [donations, setDonations] = useState([]);
  const [totals, setTotals] = useState({});
  const [totalDonors, setTotalDonors] = useState(0);

  // Fetch donation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2000/blood/donations', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setDonations(data);

          // Calculate totals
          const bloodGroupTotals = {};
          data.forEach((donation) => {
            const { bloodType, quantity } = donation;
            if (!bloodGroupTotals[bloodType]) {
              bloodGroupTotals[bloodType] = { totalQuantity: 0, donorCount: 0 };
            }
            bloodGroupTotals[bloodType].totalQuantity += parseInt(quantity, 10);
            bloodGroupTotals[bloodType].donorCount += 1;
          });

          setTotals(bloodGroupTotals);
          setTotalDonors(data.length);
        } else {
          console.error('Failed to fetch donation data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '90%'  , marginTop:"100px"}}>
      <h2 className="text-center mb-4" style={{ color: '#007bff' }}>
        Blood Donation Records
      </h2>

      <div className="table-responsive mb-5">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Blood Type</th>
              <th>Quantity (ml)</th>
              <th>Location</th>
              <th>Donor Name</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.bloodType}</td>
                <td>{donation.quantity}</td>
                <td>{donation.location}</td>
                <td>{donation.name}</td>
                <td>{donation.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="mt-5 mb-3" style={{ color: '#007bff' }}>Statistics</h4>
      <div className="mt-3">
        <p className="lead">
          <strong>Total Donors:</strong> {totalDonors}
        </p>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered">
            <thead className="table-success">
              <tr>
                <th>Blood Type</th>
                <th>Total Quantity (ml)</th>
                <th>Total Donors</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totals).map(([bloodType, { totalQuantity, donorCount }]) => (
                <tr key={bloodType}>
                  <td>{bloodType}</td>
                  <td>{totalQuantity}</td>
                  <td>{donorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DrBloodDonation;
