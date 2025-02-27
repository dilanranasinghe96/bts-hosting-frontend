

// import React, { useEffect, useState } from "react";
// import { Alert, Button, Container, Modal, Table } from 'react-bootstrap';

// function ManagePlantUsers() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   // Fetch users from the backend
//   useEffect(() => {
//     fetch("http://localhost:8081/api/auth/users")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Failed to fetch users");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     setUsers(data.filter((user) => user.role === "plant user"));
//   })
//   .catch(() => {
//     setError("Failed to fetch users");
//   });

//   }, []);

//   // Open delete confirmation modal
//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setShowDeleteModal(true);
//   };

//   // Confirm and delete user
//   const confirmDelete = () => {
//     if (!userToDelete) return;
    
//     fetch(`http://localhost:8081/api/auth/users/${userToDelete}`, {
//       method: "DELETE",
//     })
//       .then((response) => {
//         if (response.ok) {
//           setUsers(users.filter((user) => user.id !== userToDelete));
//           setShowDeleteModal(false);
//           setUserToDelete(null);
//         } else {
//           setError("Failed to delete user");
//         }
//       })
//       .catch(() => {
//         setError("Failed to delete user");
//       });
    
//   };

//   return (
//     <div 
//       style={{
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
//         minHeight: '100vh', 
//         paddingTop: '50px'  
//       }}
//     >
//       <Container 
//         className="bg-white rounded shadow-lg p-4"
//         style={{ 
//           maxWidth: '1000px', 
//           backgroundColor: 'rgba(255,255,255,0.9)',
//           borderRadius: '15px'
//         }}
//       >
//         <h2 className="text-center text-primary mb-4">Manage Plant Users</h2>
        
//         {error && <Alert variant="danger">{error}</Alert>}

//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Plant</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.username}</td>
//                 <td>{user.email}</td>
//                 <td>{user.phone}</td>
//                 <td>{user.plant}</td>
//                 <td>
//                   <Button 
//                     variant="danger" 
//                     size="sm" 
//                     onClick={() => handleDeleteClick(user.id)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this user?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default ManagePlantUsers;


import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Modal, Row, Table } from 'react-bootstrap';


function ManagePlantUsers() {
  const [plantUsers, setPlantUsers] = useState([]);
  const [cutinUsers, setCutinUsers] = useState([]);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ 
    show: false, 
    userId: null, 
    userType: '' 
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  
  // Fetch users from the backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/users`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  })
  .then((data) => {
    const plantUsers = data.filter((user) => user.role === "plant user");
    const cutinUsers = data.filter((user) => user.role === "cut in");
    setPlantUsers(plantUsers);
    setCutinUsers(cutinUsers);
  })
  .catch(() => {
    setError("Failed to fetch users");
  });

  }, [BASE_URL]);
  
  const handleDelete = (userId, userType) => {
    // Open confirmation modal without deleting immediately
    setDeleteModal({ 
      show: true, 
      userId: userId, 
      userType: userType 
    });
  };
  
  const confirmDelete = () => {
    const { userId, userType } = deleteModal;
  
    
    fetch(`http://localhost:8081/api/auth/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        if (userType === "plant user") {
          setPlantUsers(plantUsers.filter((user) => user.id !== userId));
        }
        else{
          setCutinUsers(cutinUsers.filter((user) => user.id !== userId));
        }
        // Close the modal after successful deletion
        setDeleteModal({ show: false, userId: null, userType: "" });
      })
      .catch(() => {
        setError("Failed to delete user");
        // Close the modal even if deletion fails
        setDeleteModal({ show: false, userId: null, userType: "" });
      });
    
  };
  
  
  return (
    <div 
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      padding: '50px 0'
    }}
  >
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        

        <Col md={6}>
          <div 
            className="bg-white rounded shadow-lg p-4 mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <h3 className="text-center text-primary mb-4">Plant Users</h3>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plantUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.plant}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(user.id, "plant user")}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        <Col md={6}>
          <div 
            className="bg-white rounded shadow-lg p-4 mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <h3 className="text-center text-primary mb-4">Cut In Users</h3>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cutinUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(user.id, "company admin")}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

      </Row>

      <Modal show={deleteModal.show} onHide={() => setDeleteModal({ show: false, user: null, type: '' })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {deleteModal.user?.type}?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setDeleteModal({ show: false, user: null, type: '' })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  </div>
  );
}

export default ManagePlantUsers;
