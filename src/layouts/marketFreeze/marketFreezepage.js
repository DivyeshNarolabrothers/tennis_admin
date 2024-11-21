import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function MarketFreeze() {
  const [isFrozen, setIsFrozen] = useState(false); // State to track freeze status

  // Function to fetch initial freeze status
  const fetchFreezeStatus = () => {
    const token = localStorage.getItem("admin_token");
    axios
      .get("http://35.200.147.33/api/admin/market-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Set initial freeze status based on response
        if (response.data && typeof response.data.isFrozen === "boolean") {
          setIsFrozen(response.data.isFrozen); // Ensure that the response contains a boolean
        } else {
          console.error("Invalid response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching freeze status:", error);
      });
  };

  useEffect(() => {
    fetchFreezeStatus(); // Fetch initial status on component mount
  }, []);

  // Function to handle button click
  const handleFreezeToggle = () => {
    const token = localStorage.getItem("admin_token");

    // Determine the new state
    const newFreezeState = !isFrozen; // Toggle freeze state

    axios
      .post(`http://35.200.147.33/api/admin/market-freeze`, { freeze: newFreezeState }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Check if the response contains a message
        if (response.data && response.data.message) {
          alert(response.data.message); // Display success message
        }
        // Update freeze status based on the new state
        setIsFrozen(newFreezeState); // Update state to the new freeze state
      })
      .catch((error) => {
        console.error("Error updating market state:", error);
        alert(`Failed to update market state: ${error.response?.data?.message || "Unknown error"}`);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

        <Button onClick={handleFreezeToggle} variant={isFrozen ? "danger" : "success"}>
          {isFrozen ? "Unfreeze" : "Freeze"}
        </Button>
     
    </DashboardLayout>
  );
}

export default MarketFreeze;
