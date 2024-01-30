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
const fe_url = process.env.REACT_APP_FE_URL || '';

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
    // new token to be added here.
    const tokenResponse = await axios.post(
      `${be_url}/getauthtoken`,
      { username: username },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );

    const getTokenForObjectResponse = await axios.post(
      `${be_url}/getTokenForObject`,
      { username },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );

    // console.log(getTokenForObjectResponse.data.token.token, "This is token for object");

    // return { email: payload.username, token: getTokenForObjectResponse.data.token.token };
    return { email: payload.username, token: tokenResponse.data };
  } catch (error) {
    console.error('Error fetching data:', error);
    window.location.replace(`${fe_url}/server-error`);
    return { email: '', token: '' };
  }
};
