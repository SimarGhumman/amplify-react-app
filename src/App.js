import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';
import { withAuthenticator } from '@aws-amplify/ui-react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Swal from 'sweetalert2';

Amplify.configure(config);

function App({ signOut, user }) {
  // State to hold the file to be uploaded
  const [file, setFile] = useState(null);

  // Handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    try {
      try {
        const result = await uploadData({
          key: `${user.username}/${file.name}`,
          data: file,
          options: {
            accessLevel: 'guest'
          }
        }).result;
        Swal.fire('Uploaded!', 'Your file has been uploaded.', 'success');
        console.log('Succeeded: ', result);
      } catch (error) {
        Swal.fire('Error', 'Error uploading file. Please try again.', 'error');
        console.log('Error : ', error);
      }
    } catch (error) {
      Swal.fire('Error', 'Error uploading file. Please try again.', 'error');
      console.error('Error uploading file: ', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Welcome {user.username} to E-Bike Dashboard</h1>
      </header>
      <div className="upload-section">
        <input type="file" id="file-input" className="file-input" onChange={handleFileInputChange} />
        <label htmlFor="file-input" className="file-input-label">Choose a file</label>
        <button className="upload-button" onClick={handleFileUpload}>Upload Image</button>
        <button className="signout-button" onClick={signOut}>Sign out</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
