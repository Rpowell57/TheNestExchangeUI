// Import the necessary dependencies
import { useState } from "react";
import axios from "axios";
import "./ClaimerPage.css";

// Define the ClaimerPage component
export default function ClaimerPage() {
  // Initialize state variables to store the listings and any errors
  const [listings, setListings] = useState([]); // Store the fetched listings
  const [claimedListing, setClaimedListing] = useState(""); // Store the ID of the claimed listing
  const [claimError, setClaimError] = useState(""); // Store any errors that occur during the claiming process

  // Define a function to handle the form submission (fetching listings)
  const onFormSubmit = async (event) => {
    event.preventDefault();
    setClaimError("");

    try {
      // Make a GET request to the server to fetch the listings
      const response = await axios.get("http://127.0.0.1:8000/listings");
      setListings(response.data);
    } catch (error) {
      setClaimError(error.response?.data?.detail || "Failed to fetch listings.");
    }
  };

  // Define a function to handle the claiming of a listing
  const handleClaim = async (listingId) => {
    try {
      const response = await axios.post(
          `http://127.0.0.1:8000/claim/${listingId}`,
          { userId: localStorage.getItem("userID") }
      );

      // If the claiming is successful, update the state with the claimed listing ID
      if (response.data.message === "Listing claimed successfully") {
        setClaimedListing(listingId);
      } else {
        setClaimError("Failed to claim listing.");
      }
    } catch (error) {

      setClaimError(error.response?.data?.detail || "Failed to claim listing.");
    }
  };

  // Render the component
  return (
      // Use a container div to wrap the component
      <div className="container claimer-container">
        // Use a box div to contain the component content
        <div className="claimer-box">
          // Display a heading for the component
          <h1>Claim a Listing</h1>

          // Define a form to handle the fetching of listings
          <form onSubmit={onFormSubmit}>
            // Use a button group div to contain the "Fetch Listings" button
            <div className="button-group">
              // Display a button to fetch the listings
              <button type="submit" className="btn btn-secondary">Fetch Listings</button>
            </div>

            // If an error occurs, display an error message
            {claimError && (
                // Use an alert div to display the error message
                <div className="alert alert-danger">
                  // Display the error message
                  <strong>{claimError}</strong>
                </div>
            )}

            // If listings are available, display them
            {listings.length > 0 && (
                // Use a listings section div to contain the listings
                <div className="listings-section">
                  // Map over the listings and display each one
                  {listings.map((listing) => (
                      // Use a listing card div to contain each listing
                      <div key={listing.id} className="listing-card">
                        // Display the listing title
                        <h3>{listing.title}</h3>
                        // Display the listing description
                        <p>{listing.description}</p>
                        // Display a button to claim the listing
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleClaim(listing.id)}
                        >
                          Claim
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </form>
        </div>
      </div>
  );
}