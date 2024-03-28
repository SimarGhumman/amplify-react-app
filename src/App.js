import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

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
        console.log('Succeeded: ', result);
      } catch (error) {
        console.log('Error : ', error);
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <>
      <h1>Hello {user.username}</h1>
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={handleFileUpload}>Upload Image</button>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);
