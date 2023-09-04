import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';

import client, { BaseURL } from '../../API/client';

const Home = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = () => {
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
    client.get('/posts', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }).then((response) => {
      if (response.data.result) {
        setData(response.data.result);
      } else {
        navigate('/login');
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleDelete = (row_id, user_id) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      navigate('/login');
      localStorage.removeItem('auth');
    }
    if (!auth?.login) {
      navigate('/login');
      localStorage.removeItem('auth');
    }
    if (!auth.token) {
      navigate('/login');
    }
    client.delete(`/posts/${row_id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }).then((response) => {
      if (response.data.result) {
        navigate(`/home/${user_id}`);
        fetchData();
      } else {
        navigate(`/login`);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleLogout = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      navigate('/login');
      localStorage.removeItem('auth');
    }
    if (!auth?.login) {
      navigate('/login');
      localStorage.removeItem('auth');
    }
    if (!auth.token) {
      navigate('/login');
    }
    client.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }).then(() => {
      localStorage.clear();
      navigate('/login');
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <NavLink to={`/add-post/${id}`}>Add Post</NavLink>
        <button onClick={handleLogout}>LogOut</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Content</th>
            <th scope="col">Image</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            data.length > 0 && data.map((row, idx) => {
              return <tr key={row.id}>
                <th scope="row">{row.id}</th>
                <td>{row.content}</td>
                <td><img src={`${BaseURL}images/${row.image}`} alt={row.content} style={{
                  width: '100px',
                  height: '100px'
                }} /></td>
                <td><NavLink to={`/edit-post/${row.id}`}>Edit</NavLink></td>
                <td><button onClick={handleDelete.bind(this, row.id, row.user_id)}>Delete</button></td>
              </tr>
            })
          }
        </tbody>
      </table>

    </div>
  )
}

export default Home;