import { fetchUserAndToken } from '@app/api/getUserAndToken';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from URL
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/server-error');
    }
  }, [location]);

  return <div>Loading...</div>;
};

export default TokenHandler;
