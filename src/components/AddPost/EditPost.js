import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import client, { BaseURL } from '../../API/client';

const EditPost = () => {
    const { id } = useParams();
    const [textValue, setTextValue] = useState('');
    const [postData, setPostData] = useState({});
    const [imageFile, setImageFile] = useState(null);

    const handleonChange = (e) => {
        setTextValue(e.target.value);
    }

    const navigate = useNavigate();

    const getData = () => {
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
        client.get(`/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        }).then((response) => {
            return response.data
        }).then((data) => {
            const postdata = data.result[0];
            setPostData(postdata);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getData();
    }, []);

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
        client.put(`/posts/${id}`, bodyFormData, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "Content-Type": "multipart/form-data",
            }
        }).then((response) => {
            return response.data;
        }).then((data) => {
            if (data.result) {
                navigate(`/home/${id}`);
            }
        })
    }

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
            }} defaultValue={postData.content} />
            <label>Old Image</label>
            <img src={`${BaseURL}images/${postData.image}`} alt={postData.content} style={{
                width: '100px',
                height: '100px'
            }} />
            <label>Choose a New Image</label>
            <input type='file' name='image' onChange={handleInputData} accept='image/*' />
            <button style={{
                marginTop: '5px'
            }} onClick={handleBtnClick}>Update</button>
        </div>
    )
}

export default EditPost;