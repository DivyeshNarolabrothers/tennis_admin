// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Card, Row, Col, Table, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// function CreatePlayer() {
//   const [players, setPlayers] = useState([]); // State to store players data
//   const [loading, setLoading] = useState(true); // State to handle loading
//   const [error, setError] = useState(null); // State to handle errors

//   // Base URL for your image
//   const baseImageUrl = "http://35.200.147.33/api/uploads/"; // Update this as per your API's image URL structure

//   // Function to fetch players data from the API
//   const fetchPlayers = async () => {
//     try {
//       const token = localStorage.getItem("admin_token"); // Get admin token from local storage
//       const response = await axios.get("http://35.200.147.33/api/admin/players", {
//         headers: { admin_token: token }, // Pass the admin token in the header
//       });

//       // Check if the response is successful
//       if (response.data.success) {
//         setPlayers(response.data.data); // Set players state with fetched data
//       } else {
//         setError(response.data.message); // Set error message if response status is false
//       }
//     } catch (err) {
//       console.error("Error fetching players:", err);
//       setError("Failed to load players. Please try again."); // Handle error
//     } finally {
//       setLoading(false); // Stop loading regardless of success or failure
//     }
//   };

//   // Fetch players on component mount
//   useEffect(() => {
//     fetchPlayers();
//   }, []);

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Profile Image</th>
//               <th>Name</th>
//               <th>Value</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {players.map((player, index) => (
//               <tr key={player._id}>
//                 <td>
//                   <img
//                     src={`http://35.200.147.33/api/images/${player.profile_image}`}
//                     alt={player.name}
//                     style={{ width: '50px', height: '50px',borderRadius:'50%' }}
//                   />
//                 </td>
//                 <td>{player.name}</td>
//                 <td>{player.value}</td>
//                 <td>
//                     <Button>Edit</Button>
//                     <Button>Delete</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </DashboardLayout>
//   );
// }

// export default CreatePlayer;

// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Table, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// function CreatePlayer() {
//   const [players, setPlayers] = useState([]); // State to store players data
//   const [loading, setLoading] = useState(true); // State to handle loading
//   const [error, setError] = useState(null); // State to handle errors
//   const [showModal, setShowModal] = useState(false); // State to control the modal
//   const [newPlayer, setNewPlayer] = useState({ name: '', profile_image: null, value: '' }); // State for new player form

//   // Base URL for your image
//   const baseImageUrl = "http://35.200.147.33/api/images/"; // Update this as per your API's image URL structure

//   // Function to fetch players data from the API
//   const fetchPlayers = async () => {
//     try {
//       const token = localStorage.getItem("admin_token"); // Get admin token from local storage
//       const response = await axios.get("http://35.200.147.33/api/admin/players", {
//         headers: { admin_token: token }, // Pass the admin token in the header
//       });

//       // Check if the response is successful
//       if (response.data.success) {
//         setPlayers(response.data.data); // Set players state with fetched data
//       } else {
//         setError(response.data.message); // Set error message if response status is false
//       }
//     } catch (err) {
//       console.error("Error fetching players:", err);
//       setError("Failed to load players. Please try again."); // Handle error
//     } finally {
//       setLoading(false); // Stop loading regardless of success or failure
//     }
//   };

//   // Function to handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     const formData = new FormData(); // Create a FormData object

//     formData.append('name', newPlayer.name); // Append name to form data
//     formData.append('profile_image', newPlayer.profile_image); // Append file to form data
//     formData.append('value', newPlayer.value); // Append value to form data

//     try {
//       const token = localStorage.getItem("admin_token"); // Get admin token from local storage
//       const response = await axios.post("http://35.200.147.33/api/admin/createPlayer", formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Set content type for file upload
//           admin_token: token // Pass the admin token in the header
//         },
//       });

//       if (response.data.success) {
//         // Reset the form and close the modal
//         setNewPlayer({ name: '', profile_image: null, value: '' });
//         setShowModal(false);
//         fetchPlayers(); // Fetch updated players list
//       } else {
//         setError(response.data.message); // Set error message if creation status is false
//       }
//     } catch (err) {
//       console.error("Error creating player:", err);
//       setError("Failed to create player. Please try again."); // Handle error
//     }
//   };

//   // Fetch players on component mount
//   useEffect(() => {
//     fetchPlayers();
//   }, []);

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <>
//           <Button variant="primary" onClick={() => setShowModal(true)}>Add Player</Button>
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>Profile Image</th>
//                 <th>Name</th>
//                 <th>Value</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {players.map((player, index) => (
//                 <tr key={player._id}>
//                   <td>
//                     <img
//                       src={`${baseImageUrl}${player.profile_image}`}
//                       alt={player.name}
//                       style={{ width: '50px', height: '50px', borderRadius: '50%' }}
//                     />
//                   </td>
//                   <td>{player.name}</td>
//                   <td>{player.value}</td>
//                   <td>
//                     <Button>Edit</Button>
//                     <Button>Delete</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Modal for Adding New Player */}
//           <Modal show={showModal} onHide={() => setShowModal(false)}>
//             <Modal.Header closeButton>
//               <Modal.Title>Add New Player</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="formPlayerName">
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter player name"
//                     value={newPlayer.name}
//                     onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formPlayerImage">
//                   <Form.Label>Profile Image</Form.Label>
//                   <Form.Control
//                     type="file"
//                     onChange={(e) => setNewPlayer({ ...newPlayer, profile_image: e.target.files[0] })} // Capture the file
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formPlayerValue">
//                   <Form.Label>Value</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter player value"
//                     value={newPlayer.value}
//                     onChange={(e) => setNewPlayer({ ...newPlayer, value: e.target.value })}
//                     required
//                   />
//                 </Form.Group>
//                 <Button variant="primary" type="submit">Submit</Button>
//               </Form>
//             </Modal.Body>
//           </Modal>
//         </>
//       )}
//     </DashboardLayout>
//   );
// }

// export default CreatePlayer;

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
          `http://35.200.147.33/api/admin/market-freeze`,
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
    //     .post(`http://35.200.147.33/api/admin/market-freeze`, { freeze: newFreezeState }, {
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
        .get("http://35.200.147.33/api/admin/players", {
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
                .patch(`http://35.200.147.33/api/admin/updateplayer/${editId}`, formData, {
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
                .post(`http://35.200.147.33/api/admin/createPlayer`, formData, {
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
          .delete(`http://35.200.147.33/api/admin/deleteplayer/${id}`, {
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
                                src={`http://35.200.147.33/api/images/${player.profile_image}`}
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
