import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";

function CreatePlayer() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({});
    const [productData, setProductData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [isFrozen, setIsFrozen] = useState(false); // State to track freeze status
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [newFreezeState, setNewFreezeState] = useState(false);
  
    const handleFreezeToggle = () => {
      const token = localStorage.getItem("admin_token");
  
      // Determine the new state for freeze
      const newState = !isFrozen;
      setNewFreezeState(newState);  // Store the new freeze state
  
      // Show confirmation dialog
      setShowConfirmDialog(true);
    };
  
    const handleConfirm = () => {
      const token = localStorage.getItem("admin_token");
  
      axios
        .post(
          `http://34.27.101.208:9999/admin/market-freeze`,
          { freeze: newFreezeState },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // Check if the response contains a message
          if (response.data && response.data.message) {
            console.log(

              response.data.message // Display success message
            );
          }
          // Update freeze status based on the new state
          setIsFrozen(newFreezeState); // Update state to the new freeze state
          setShowConfirmDialog(false); // Close the confirmation dialog
        })
        .catch((error) => {
          console.error("Error updating market state:", error);
          alert(`Failed to update market state: ${error.response?.data?.message || "Unknown error"}`);
          setShowConfirmDialog(false); // Close the confirmation dialog
        });
    };
  
    const handleCancel = () => {
      setShowConfirmDialog(false); // Close the confirmation dialog without making an API call
    };


    const showAutoCloseAlert = (message) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    };
  
    const showAutoError = (message) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 3000,
      });
    };


    // Function to fetch initial freeze status
    const fetchFreezeStatus = () => {
      const token = localStorage.getItem("admin_token");
      axios
        .get("http://34.27.101.208:9999/admin/market-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Set initial freeze status based on response
          if (response.data && typeof response.data.isFrozen === "boolean") {
            setIsFrozen(response.data.isFrozen); // Ensure that the response contains a boolean
          } else {
            showAutoError("Invalid response structure:", response.data);
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
    // const handleFreezeToggle = () => {
    //   const token = localStorage.getItem("admin_token");
  
    //   // Determine the new state
    //   const newFreezeState = !isFrozen; // Toggle freeze state
  
    //   axios
    //     .post(`http://34.27.101.208:9999/admin/market-freeze`, { freeze: newFreezeState }, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       // Check if the response contains a message
    //       if (response.data && response.data.message) {
    //         alert(response.data.message); // Display success message
    //       }
    //       // Update freeze status based on the new state
    //       setIsFrozen(newFreezeState); // Update state to the new freeze state
    //     })
    //     .catch((error) => {
    //       console.error("Error updating market state:", error);
    //       alert(`Failed to update market state: ${error.response?.data?.message || "Unknown error"}`);
    //     });
    // };
  
    // Close modal
    const handleClose = () => {
      setShow(false);
      setData({});
      setEditId(null);
    };
  
    // Show modal
    const handleShow = () => setShow(true);
  
    // Handle input changes
    const handlePostData = (e) => {
      const { name, files, value } = e.target;
      if (files) {
        setData((prevState) => ({
          ...prevState,
          [name]: files[0],
        }));
      } else {
        setData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    };

    // Fetch player data
    const fetchPlayerData = () => {
      const token = localStorage.getItem("admin_token");
      axios
        .get("http://34.27.101.208:9999/admin/players", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProductData(response.data.data || []);
        })
        .catch((error) => showAutoError("Error fetching player data:", error));
    };
  
    // Fetch categories and player data on component mount
    useEffect(() => {
      fetchPlayerData();
    }, []);
  
   
   
    const handleSubmit = () => {
        // Check if profile_image is selected before creating player
        if (!data.profile_image) {
            alert("Please select a profile image before submitting.");
            return;
        }
    
        const formData = new FormData();
        for (const key in data) {
            // Only append valid data to FormData
            if (data[key]) {
                formData.append(key, data[key]);
            }
        }
    
        const token = localStorage.getItem("admin_token");
    
        if (editId) {
            // Update existing player
            axios
                .patch(`http://34.27.101.208:9999/admin/updateplayer/${editId}`, formData, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    fetchPlayerData(); // Re-fetch data after updating
                    handleClose();
                    showAutoCloseAlert("Player Edit successfully.");
                })
                .catch((error) => {
                    console.error("Error updating player:", error);
                });
        } else {
            // Add new player
            axios
                .post(`http://34.27.101.208:9999/admin/createPlayer`, formData, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    fetchPlayerData(); // Re-fetch data after adding
                    handleClose();
                    showAutoCloseAlert("Player Create successfully.");
                })
                .catch((error) => {
                    console.error("Error adding player:", error);
                    // Optionally handle the error display
                    showAutoError(error.response.data.message || "An error occurred while creating the player.");
                });
        }
    };
    const handleEdit = (id) => {
        const category = productData.find((item) => item._id === id);
        if (category) {
          setData({
            name: category.name,
            value: category.value,
            profile_image: category.profile_image,
          });
          setEditId(id);
          handleShow();

        }
       
      };

      

      const handleDelete = (id) => {
        const token = localStorage.getItem("admin_token"); // Get token for authentication if required
        axios
          .delete(`http://34.27.101.208:9999/admin/deleteplayer/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers if needed
            },
          })
          .then(() => {
            // Update the product data by filtering out the deleted player
            setProductData((prevData) => prevData.filter((player) => player._id !== id));
      
            // Show success alert after deletion
            showAutoCloseAlert("Player deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting player:", error);
            showAutoError(error.response?.data.message || "An error occurred while deleting the player.");
          });
      };
      

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <div className="container-fluid">
        <DashboardLayout>
          <DashboardNavbar />
          <Button onClick={handleFreezeToggle} variant={isFrozen ? "danger" : "success"} style={{marginBottom:'10px'}}>
        {isFrozen ? "Unfreeze " : "Freeze"}
      </Button>

      {/* React Bootstrap Modal for confirmation */}
      <Modal show={showConfirmDialog} onHide={handleCancel} >
        <Modal.Body style={{backgroundColor:'black',color:'white'}}>
          <p>Do you want to  {newFreezeState ? "freeze" : "Unfreeze"} the market</p>
        </Modal.Body>
        <Modal.Footer style={{borderTop:'none',padding:'0',backgroundColor:'black',color:'white'}}>
          <Button variant="secondary" onClick={handleCancel} style={{borderRadius:'50px'}}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleConfirm } style={{borderRadius:'50px'}}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

          <div className="row">
            <div className="col">
              <Button
                variant="primary"
                onClick={handleShow}
                className="mb-3"
                style={{ background: "#B42134", border: "none" }}
              >
                Add Player
              </Button>
  
              <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                  <Modal.Title>{editId ? "Edit Player" : "Add Player"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          value={data.name || ""}
                          onChange={handlePostData}
                          name="name"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label>Value</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter value"
                          value={data.value || ""}
                          onChange={handlePostData}
                          name="value"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control type="file" onChange={handlePostData} name="profile_image" />
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    {editId ? "Update" : "Submit"}
                  </Button>
                </Modal.Footer>
              </Modal>
  
            
              <div className="table-responsive">
                <Table bordered hover>
                  <thead>
                    <tr className="text-center" style={{ fontSize: "85%" }}>
                      <th>Profile Image</th>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((player) => (
                        <tr key={player?._id} className="text-center" style={{ fontSize: "90%" }}>
                          <td>
                            {player.profile_image ? (
                              <img
                                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                src={`http://34.27.101.208:9999/images/${player.profile_image}`}
                                alt="Profile"
                              />
                            ) : (
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ccc", 
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                N/A
                              </div>
                            )}
                          </td>
                          <td>{player.name || "N/A"}</td>
                          <td>
                            {player.value_data && player.value_data.length > 0
                              ? player.value_data[player.value_data.length - 1].value
                              : player.value || "N/A"}
                          </td>
                          <td>
                            <Button variant="primary" onClick={() => handleEdit(player?._id)}>
                            <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button
                              variant="danger"
                              style={{ margin: "5px" }}
                              onClick={() => handleDelete(player?._id)}
                            >
                            <i className="bi bi-trash3"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No players found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
  
          
              <footer className="mt-4">
                <Row className="align-items-center">
                  <Col xs={12} md={6}>
                    <span>
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, productData.length)} of {productData.length} entries
                    </span>
                  </Col>
                  <Col xs={12} md={6} className="text-md-end">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="secondary"
                      className="me-2"
                    >
                      <i className="bi bi-caret-left"></i>
                    </Button>
                    <span>{currentPage}</span>
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={indexOfLastItem >= productData.length}
                      variant="secondary"
                    >
                      <i className="bi bi-caret-right"></i>
                    </Button>
                  </Col>
                </Row>
              </footer>
            </div>
          </div>
        </DashboardLayout>
      </div>
    );
  }
  
  
  
  
  
export default CreatePlayer;
