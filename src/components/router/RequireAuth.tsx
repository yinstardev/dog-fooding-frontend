import React, { useEffect, useState, ReactElement } from 'react';
import { Navigate, useLocation, Route, RouteProps } from 'react-router-dom';
import axios from 'axios';

const be_url = process.env.REACT_APP_BE_URL || '';

// function to validate the token
const validateToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${be_url}/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.valid;
  } catch (error) {
    window.location.replace(`${be_url}/login`);
    console.error('Token validation error', error);
    return false;
  }
};

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();
      setIsValidToken(isValid);
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isValidToken ? children : <Navigate to="/" state={{ from: location }} replace />;
};
