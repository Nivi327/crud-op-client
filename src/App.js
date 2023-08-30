import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import FP from './components/ForgetPassword/FP';
import AddPost from './components/AddPost/addPost';
import EditPost from './components/AddPost/EditPost';

function App() {
  return (
    <section className="container">
      <Router>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/reset-password' element={<FP />} />
          <Route path='/home/:id' element={<Home />} />
          <Route path='/add-post/:id' element={<AddPost />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
        </Routes>
      </Router>
    </section>
  );
}

export default App;
