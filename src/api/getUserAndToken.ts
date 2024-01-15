import axios from 'axios';

function parseJwt(token: any) {
  try {
    const base64Payload = token.split('.')[1]; // Get the payload part
    const payload = Buffer.from(base64Payload, 'base64').toString('ascii');
    return JSON.parse(payload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
}

const be_url = process.env.REACT_APP_BE_URL || '';

const getJwtTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token;
};

export const fetchUserAndToken = async () => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();

    const payload = parseJwt(jwtToken);
    let username = '';

    if (payload) {
      username = payload.username;
      //   username = `${process.env.REACT_APP_USERNAME}`;
    }
    const tokenResponse = await axios.post(
      `${be_url}/getauthtoken`,
      { username: username },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    return { email: payload.username, token: tokenResponse.data };
  } catch (error) {
    console.error('Error fetching data:', error);
    window.location.replace(`${be_url}/login`);
    return { email: '', token: '' };
  }
};
