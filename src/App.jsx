import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Separate state for modal form
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(API_URL);
    setUsers(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Update user
      await axios.put(`${API_URL}/${editId}`, {
        name: modalName,
        email: modalEmail,
      });
      setSuccessMessage("User create successfully");
      setSnackbarOpen(true);
    } else {
      // Create user
      await axios.post(API_URL, { name, email });
      setSuccessMessage("User create successfully");
      setSnackbarOpen(true);
    }
    setName("");
    setEmail("");
    setModalName("");
    setModalEmail("");
    setEditId(null);
    setOpen(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setModalName(user.name);
    setModalEmail(user.email);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    setSuccessMessage("User deleted successfully");
    setSnackbarOpen(true);
    setDeleteId(null);
    setOpenDeleteModal(false);
    fetchUsers();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setModalName("");
    setModalEmail("");
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <Container>
      <h1>BE Dev Task Crud</h1>
      {/* Main form */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Submit
        </Button>
      </form>

      {/* User Table */}
      <Paper style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.updated_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteClick(user.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal for Editing */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Edit User</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={modalStyle}>
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this user?</p>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteConfirm}
            style={{ marginRight: "10px" }}
          >
            Delete
          </Button>
          <Button variant="outlined" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for Success Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
