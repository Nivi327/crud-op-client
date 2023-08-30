import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import client from '../../API/client';

const AddPost = () => {
  const { id } = useParams();
  const [textValue, setTextValue] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleonChange = (e) => {
    setTextValue(e.target.value);
  }

  const navigate = useNavigate();

  const handleBtnClick = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      navigate('/login');
    }
    const bodyFormData = new FormData();
    if (imageFile == null) {
      return;
    }
    bodyFormData.append('image', imageFile);
    bodyFormData.append('content', textValue);
    client.post('/posts',
      bodyFormData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      }
    }).then((response) => {
      console.log(response);
      return response.data;
    }).then((data) => {
      if (data.result) {
        navigate(`/home/${id}`);
      }
    })
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth == undefined) {
      navigate('/login');
      localStorage.removeItem('auth');
      return;
    }
    if (!auth?.login) {
      navigate('/login');
      localStorage.removeItem('auth');
      return;
    }
  }, []);

  const handleInputData = (e) => {
    if (e.target && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <label>Enter the Title</label>
      <textarea name='content' minLength={5} maxLength={500} onChange={handleonChange} style={{
        padding: '2px',
        outline: 'none'
      }} />
      <input type='file' name='image' onChange={handleInputData} accept='image/*' />
      <button style={{
        marginTop: '5px'
      }} onClick={handleBtnClick}>Post</button>
    </div>
  )
}

export default AddPost;