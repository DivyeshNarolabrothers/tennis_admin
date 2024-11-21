import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap"; // Assuming you're using react-bootstrap for Table
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", credits: 0, share_quantity: "",password:"" });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users); // New state for filtered users

  // Update filteredUsers whenever searchTerm or users changes
  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);


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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get("http://35.200.147.33/api/admin/userList", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (Array.isArray(response.data.userDetails)) {
        setUsers(response.data.userDetails);
      } else {
        showAutoError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      showAutoError("Error fetching user list:", err);
      showAutoError("Failed to load user list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  useEffect(() => {
    // Function to fetch users periodically
    const interval = setInterval(() => {
      fetchUsers();
    }, 6000); // Call every 1 minute (60,000 ms)
  
    // Initial call to fetch users immediately when the component mounts
    fetchUsers();
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  

  // const handleViewUser = (user) => {
  //   setSelectedUser(user);
  //   setShowViewModal(true); // Open the view modal
  // };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, credits: user.credits,password:user.password });
    setProfileImage(user.profile_image);
    setIsEditMode(true);
    setShowEditModal(true); // Open the edit modal
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the relevant field in the formData state
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handlePlayerEdit = (player) => {
    setSelectedPlayer(player); // Store the player object
    setFormData({ share_quantity: player.share_quantity }); // Set the form data to the current share quantity
    setIsEditMode(true); // Set edit mode to true
    setShowPlayerModal(true); // Show the player modal
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission behavior

  //   try {
  //     const token = localStorage.getItem("admin_token");

  //     // Check if we're in player edit mode
  //     if (selectedPlayer && selectedPlayer._id) {
  //       const payload = [
  //         {
  //           playerId: selectedPlayer._id, // Use the selected player's ID
  //           share_quantity: formData.share_quantity, // The updated share quantity from the form
  //         },
  //       ];

  //       // Player edit mode
  //       const response = await axios.patch(
  //         `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
  //         { players: payload }, // Only updating share_quantity
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (response.status === 200) {
  //         // Update the local state to reflect the updated share_quantity
  //         setUsers((prevUsers) =>
  //           prevUsers.map((user) =>
  //             user._id === selectedUser._id
  //               ? {
  //                 ...user,
  //                 team: {
  //                   ...user.team,
  //                   players: user.team.players.map((player) =>
  //                     player._id === selectedPlayer._id
  //                       ? { ...player, share_quantity: formData.share_quantity } // Update share quantity in the UI
  //                       : player
  //                   ),
  //                 },
  //               }
  //               : user
  //           )
  //         );
  //         await fetchUsers();
  //         setShowPlayerModal(false); // Close the player modal after successful update
  //         setSelectedPlayer(null); // Clear selected player

  //       }
  //     } else if (selectedUser) {
  //       // User edit mode
  //       const formDataToSend = new FormData();
  //       formDataToSend.append("name", formData.name);
  //       formDataToSend.append("email", formData.email);
  //       formDataToSend.append("credits", formData.credits);
  //       formDataToSend.append("password", formData.password);
  //       if (profileImage) {
  //         formDataToSend.append("profile_image", profileImage);
  //       }

  //       // Ensure selectedUser._id is defined before making the request
  //       if (!selectedUser._id) {
  //         showAutoError("Selected user ID is undefined");
  //         return; // Stop the function if ID is undefined
  //       }

  //       const response = await axios.patch(
  //         `http://35.200.147.33/api/admin/userUpdate/${selectedUser._id}`,
  //         formDataToSend,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         setUsers((prevUsers) =>
  //           prevUsers.map((user) =>
  //             user._id === selectedUser._id
  //               ? {
  //                 ...user,
  //                 ...formData,
  //                 profile_image: response.data.profile_image || user.profile_image,
  //               }
  //               : user
  //           )
  //         );

  //         setShowEditModal(false); // Close the edit modal after successful update
  //         setSelectedUser(null); // Clear selected user
  //       }
  //       else{
  //         const token = localStorage.getItem("admin_token");
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("name", formData.name);
  //     formDataToSend.append("email", formData.email);
  //     formDataToSend.append("password", formData.password);
  //     formDataToSend.append("credits", formData.credits);
  //     if (profileImage) {
  //       formDataToSend.append("profile_image", profileImage);
  //     }

  //     if (isEditMode && selectedUser) {
  //       // Edit mode: PATCH request to update user
  //       const response = await axios.patch(
  //         `http://35.200.147.33/api/admin/userUpdate/${selectedUser._id}`,
  //         formDataToSend,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         setUsers((prevUsers) =>
  //           prevUsers.map((user) =>
  //             user._id === selectedUser._id
  //               ? { ...user, ...formData }
  //               : user
  //           )
  //         );
  //         showAutoCloseAlert("User updated successfully!");
  //         handleCloseEditModal(); // Close modal after successful update
  //       }
  //     } else {
  //       // Add new user: POST request to register user
  //       const response = await axios.post(
  //         "http://35.200.147.33/api/user/register",
  //         formDataToSend,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       if (response.status === 201) {
  //         showAutoCloseAlert("User added successfully!");
  //         setUsers((prevUsers) => [...prevUsers, response.data.user]); // Add new user to the list
  //         handleCloseEditModal(); // Close modal after successful addition
  //       }
  //     }
  //       }
  //       await fetchUsers()
  //     }
  //   } catch (error) {
  //     showAutoError("Error updating user or player:", error);
  //     showAutoError("Failed to update user or player. Please try again.");
  //   }
  // };

  const handleAddUser = () => {
    setIsEditMode(true);
    setFormData({
      name: "",
      email: "",
      password: "",
      credits: "",
    });
    setProfileImage(null);
    setSelectedUser(null);
    setShowEditModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true); // Open the view modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    try {
      const token = localStorage.getItem("admin_token");
  
      // Check if we're in player edit mode
      if (selectedPlayer && selectedPlayer._id) {
        const currentShareQuantity = selectedPlayer.share_quantity; // Get current share_quantity
        const newShareQuantity = parseFloat(formData.share_quantity); // Get new share_quantity from form
  
        if (newShareQuantity > currentShareQuantity * 0.8) {
          // If new value is not at least 20% less, show error and stop
          showAutoError(
            `The share quantity must be at least 20% less than the current value (${currentShareQuantity}).`
          );
          return; // Exit the function to prevent API call
        }
  
        const payload = [
          {
            playerId: selectedPlayer._id, // Use the selected player's ID
            share_quantity: newShareQuantity, // The updated share quantity from the form
          },
        ];
  
        // Player edit mode
        const response = await axios.patch(
          `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
          { players: payload }, // Only updating share_quantity
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status === 200) {
          // Update the local state to reflect the updated share_quantity
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === selectedUser._id
                ? {
                    ...user,
                    team: {
                      ...user.team,
                      players: user.team.players.map((player) =>
                        player._id === selectedPlayer._id
                          ? { ...player, share_quantity: newShareQuantity } // Update share quantity in the UI
                          : player
                      ),
                    },
                  }
                : user
            )
          );
          await fetchUsers();
          setShowPlayerModal(false); // Close the player modal after successful update
          setSelectedPlayer(null); // Clear selected player
        }
      } else if (selectedUser) {
        // User edit mode
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("credits", formData.credits);
        formDataToSend.append("password", formData.password);
        if (profileImage) {
          formDataToSend.append("profile_image", profileImage);
        }
  
        if (!selectedUser._id) {
          showAutoError("Selected user ID is undefined");
          return; // Stop the function if ID is undefined
        }
  
        const response = await axios.patch(
          `http://35.200.147.33/api/admin/userUpdate/${selectedUser._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === selectedUser._id
                ? {
                    ...user,
                    ...formData,
                    profile_image: response.data.profile_image || user.profile_image,
                  }
                : user
            )
          );
  
          setShowEditModal(false); // Close the edit modal after successful update
          setSelectedUser(null); // Clear selected user
        }
      }
      else {
        const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("credits", formData.credits);
      if (isEditMode) formDataToSend.append("password", formData.password); // Password is optional for edits
      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
      }
        // Add User API
        const response = await axios.post(
          "http://35.200.147.33/api/user/register",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          fetchUsers(); // Refresh the table
          setShowEditModal(false);
        }
      }
    } catch (error) {
      showAutoError("Error updating user or player:", error);
      showAutoError("Failed to update user or player. Please try again.");
    }
  };
  

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setProfileImage(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handlePlayer = (playerId) => {
    // Set the selected player and open the modal
    const player = selectedUser.team.players.find((player) => player._id === playerId);
    setSelectedPlayer(player);
    setFormData({ share_quantity: player.share_quantity }); // Pre-fill form data
    setIsEditMode(true); // Set edit mode
    setShowPlayerModal(true); // Show the modal
  };

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
  };


  const handlePlayerDelete = async (playerId) => {
    try {
      const token = localStorage.getItem("admin_token");

      setLoading(true); // Set loading to true when starting the delete process

      // Make API call to delete the player without confirmation
      const response = await axios.patch(
        `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
        {
          players: [
            {
              playerId: playerId,
              remove: true, // Set the remove key to true
            },
          ],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // API call succeeded, now update the local state to remove the player
        setSelectedUser((prevSelectedUser) => {
          const updatedPlayers = prevSelectedUser.team.players.filter(
            (player) => player._id !== playerId
          );
          return {
            ...prevSelectedUser,
            team: {
              ...prevSelectedUser.team,
              players: updatedPlayers, // Update the players array
            },
          };
        });
        await fetchUsers();
        // Close the modal if necessary
        handleCloseViewModal();

        // Show success alert (can be any UI alert system)
        showAutoCloseAlert("Player deleted successfully.");
      } else {
        throw new Error("Failed to delete the player");
      }
    } catch (error) {
      // Error handling for failed API call
      showAutoError("Error deleting player: " + error.message);
    } finally {
      setLoading(false); // Reset loading state after the operation
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('admin_token');

    try {
        // Trigger the API call to delete the user
        const response = await axios.delete(`http://35.200.147.33/api/admin/user/delete/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // If the response is successful (status code 200)
        if (response.status === 200) {
            // Remove the deleted user from the list in the state
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

            // Show success alert
            showAutoCloseAlert('User deleted successfully.');
        }
    } catch (error) {
        // In case of an error, show an error alert
        console.error('Error deleting user:', error);
        showAutoError('Failed to delete user. Please try again.');
    }
};



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox display="flex" justifyContent="flex-end" >
        <SoftInput
          placeholder="Search here"
          icon={{ component: "search", direction: "left" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SoftBox>
      <Button variant="primary" onClick={handleAddUser} style={{ marginBottom: "10px" }}>
        Add User
      </Button>
      <div className="table-responsive">
        <Table striped="columns" responsive="sm" bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Profile Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user._id || index}>
                <td>{user._id}</td>
                <td>
                  <img
                    src={`http://35.200.147.33/api/images/${user.profile_image}`}
                    alt={user.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password }</td>
                <td>{user.credits ? Number(user.credits).toFixed(2) : "0.00"}</td>

                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewUser(user)}
                    style={{ marginRight: "10px" }}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button variant="secondary" onClick={() => handleEditUser(user)} style={{ marginRight: "10px" }}>
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user._id)} style={{ backgroundColor: 'red', border: 'none' }}>
                    <i className="bi bi-trash3"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <footer className="mt-4">
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <span>
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, users.length)} of {users.length} entries
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
              disabled={indexOfLastItem >= users.length}
              variant="secondary"
            >
              <i className="bi bi-caret-right"></i>
            </Button>
          </Col>
        </Row>
      </footer>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="row">
              {/* Left table for user details */}
             <div className="col-md-6">
                <h5>User Information</h5>
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td>Id</td>
                      <td>{selectedUser._id}</td>
                    </tr>
                    <tr>
                      <td>Name</td>
                      <td>{selectedUser.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td>Credits</td>
                      <td>{selectedUser.credits}</td>
                    </tr>

                  </tbody>
                </Table>
              </div> 

              {/* Right table for team and players details */}
              <div className="col-md-6">
                {selectedUser.team ? (
                  <>
                    <h5>Team Information</h5>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <td>Team Name</td>
                          <td>{selectedUser.team.name}</td>
                        </tr>
                        <tr>
                          <td>Team Profile Image</td>
                          <td>
                            <img
                              src={`http://35.200.147.33/api/images/${selectedUser.team.profile_image}`}
                              alt={selectedUser.team.name}
                              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <h5>Players Information</h5>
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th style={{ fontSize: "15px" }}>Player Name</th>
                            <th style={{ fontSize: "15px" }}>Profile Image</th>
                            <th style={{ fontSize: "15px" }}>Value</th>
                            <th style={{ fontSize: "15px" }}>Share Quantity</th>
                            <th style={{ fontSize: "15px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.team.players.map((player) => (
                            <tr key={player._id}>
                              <td>{player.name}</td>
                              <td>
                                <img
                                  src={`http://35.200.147.33/api/images/${player.profile_image}`}
                                  alt={player.name}
                                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                              </td>
                              <td>{player.value}</td>
                              <td>{player.share_quantity}</td>
                              <td>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <Button
                                    variant="primary"
                                    onClick={() => handlePlayerEdit(player)}
                                    style={{ marginRight: "5px" }}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() => handlePlayerDelete(player._id)}
                                  >
                                    <i className="bi bi-trash3"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div>
                    <h5>Team Information</h5>
                    <p>No available team data.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPlayerModal} onHide={handleClosePlayerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Player" : "View Player"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formShareQuantity">
              <Form.Label>Share Quantity</Form.Label>
              <Form.Control
                type="text"
                name="share_quantity"
                value={formData.share_quantity}
                onChange={handleChange} // Use the handleChange function
                readOnly={!isEditMode} // Make read-only if not in edit mode
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!isEditMode}>
              {isEditMode ? "Update" : "Close"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit User" : "View User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditMode} // Make read-only if not in edit mode
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditMode} // Make read-only if not in edit mode
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                readOnly={!isEditMode} // Make read-only if not in edit mode
                required
              />
            </Form.Group>
            <Form.Group controlId="formCredits">
              <Form.Label>Credits</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                readOnly={!isEditMode} // Make read-only if not in edit mode
                required
              />
            </Form.Group>
            {isEditMode && (
              <Form.Group controlId="formProfileImage">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
    </DashboardLayout>
  );
}

export default UserList;
