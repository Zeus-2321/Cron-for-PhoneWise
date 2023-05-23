import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, TextField } from '@mui/material';

const Upload = () => {
  const [file, setFile] = useState(null);
  const url = 'https://test-r4y3.onrender.com/api/upload';

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('attendanceFile', file);

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // Handle response from the backend
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Upload File
      </Typography>
      <TextField
        type="file"
        onChange={handleFileChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" onClick={handleUpload}>
        Upload
      </Button>
    </Container>
  );
};

export default Upload;
