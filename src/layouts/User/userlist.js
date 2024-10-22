import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap"; // Assuming you're using react-bootstrap for Table
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", credits: 0, share_quantity: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  

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
        headers: { admin_token: token },
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true); // Open the view modal
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, credits: user.credits });
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const token = localStorage.getItem("admin_token");

      // Check if we're in player edit mode
      if (selectedPlayer && selectedPlayer._id) {
        const payload = [
          {
            playerId: selectedPlayer._id, // Use the selected player's ID
            share_quantity: formData.share_quantity, // The updated share quantity from the form
          },
        ];

        // Player edit mode
        const response = await axios.patch(
          `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
          { players: payload }, // Only updating share_quantity
          { headers: { admin_token: token } }
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
                          ? { ...player, share_quantity: formData.share_quantity } // Update share quantity in the UI
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
        if (profileImage) {
          formDataToSend.append("profile_image", profileImage);
        }

        // Ensure selectedUser._id is defined before making the request
        if (!selectedUser._id) {
          showAutoError("Selected user ID is undefined");
          return; // Stop the function if ID is undefined
        }

        const response = await axios.patch(
          `http://35.200.147.33/api/admin/userUpdate/${selectedUser._id}`,
          formDataToSend,
          {
            headers: {
              admin_token: token,
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
        await fetchUsers()
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

  // const handlePlayerDelete = async (playerId) => {
  //   try {
  //     const token = localStorage.getItem("admin_token");

  //     // Confirm deletion before proceeding
  //     const confirmDelete = window.confirm("Are you sure you want to delete this player?");
  //     if (!confirmDelete) return;

  //     // Make API call to delete the player
  //     const response = await axios.patch(
  //       `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
  //       {
  //         players: [
  //           {
  //             playerId: playerId,
  //             remove: true, // Set the remove key to true
  //           },
  //         ],
  //       },
  //       { headers: { admin_token: token } }
  //     );

  //     if (response.status === 200) {
  //       // Update local state to remove the deleted player
  //       setSelectedUser((prevSelectedUser) => {
  //         const updatedPlayers = prevSelectedUser.team.players.filter(
  //           (player) => player._id !== playerId
  //         );
  //         return {
  //           ...prevSelectedUser,
  //           team: {
  //             ...prevSelectedUser.team,
  //             players: updatedPlayers, // Update the players array immediately
  //           },
  //         };
  //       });

  //       // Close the modal
  //       handleCloseViewModal();

  //       showAutoCloseAlert("Player deleted successfully.");
  //     } else {
  //       throw new Error("Failed to delete the player");
  //     }
  //   } catch (error) {
  //     showAutoError("Error deleting player:", error);
  //     showAutoError("Failed to delete player. Please try again.");
  //   }
  // };

  // const handlePlayerDelete = async (playerId) => {
  //   try {
  //     const token = localStorage.getItem("admin_token");
  
  //     // Make API call to delete the player without confirmation
  //     const response = await axios.patch(
  //       `http://35.200.147.33/api/admin/userUpdate-team-players/${selectedUser._id}`,
  //       {
  //         players: [
  //           {
  //             playerId: playerId,
  //             remove: true, // Set the remove key to true
  //           },
  //         ],
  //       },
  //       { headers: { admin_token: token } }
  //     );
  
  //     if (response.status === 200) {
  //       // Update local state to remove the deleted player
  //       setSelectedUser((prevSelectedUser) => {
  //         const updatedPlayers = prevSelectedUser.team.players.filter(
  //           (player) => player._id !== playerId
  //         );
  //         return {
  //           ...prevSelectedUser,
  //           team: {
  //             ...prevSelectedUser.team,
  //             players: updatedPlayers, // Update the players array immediately
  //           },
  //         };
  //       });
  
  //       // Close the modal
  //       handleCloseViewModal();
  
  //       // Show success alert (you can use any custom alert system or UI library)
  //       showAutoCloseAlert("Player deleted successfully.");
  //     } else {
  //       throw new Error("Failed to delete the player");
  //     }
  //   } catch (error) {
  //     showAutoError("Error deleting player:", error);
  //     showAutoError("Failed to delete player. Please try again.");
  //   }
  // };
  
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
        { headers: { admin_token: token } }
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
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="table-responsive">
        <Table striped="columns" responsive="sm" bordered hover>
          <thead>
            <tr>
              <th>Profile Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user._id || index}>
                <td>
                  <img
                    src={`http://35.200.147.33/api/images/${user.profile_image}`}
                    alt={user.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.credits}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewUser(user)}
                    style={{ marginRight: "10px" }}
                  >
                   <i class="bi bi-eye"></i>
                  </Button>
                  <Button variant="secondary" onClick={() => handleEditUser(user)}>
                  <i class="bi bi-pencil-square"></i>
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

                    {/* Player Details */}

                    {/* <div className="table-responsive">
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
                                    <i class="bi bi-pencil-square"></i>
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() => handlePlayerDelete(player._id)}
                                  >
                                    <i class="bi bi-trash3"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div> */}
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
            <Button variant="primary" type="submit" disabled={!isEditMode}>
              {isEditMode ? "Update" : "Close"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
}

export default UserList;
