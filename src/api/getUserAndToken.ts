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
const setAuthHeader = () => {
  const jwtToken = getJwtTokenFromLocalStorage();
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers.Authorization = `Bearer ${jwtToken}`;
  }
  return headers;
};
export const fetchUserAndToken = async () => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();
    const payload = parseJwt(jwtToken);
    let username = '';

    if (payload) {
      username = payload.username;
      // username = `${process.env.REACT_APP_USERNAME}`;
    }

    const headers = setAuthHeader(); // Get headers from setAuthHeader function

    const config = {
      headers: headers, // Use headers directly
      withCredentials: true,
    };

    const tokenResponse = await axios.post(`${be_url}/getauthtoken`, { username: username }, config);

    // const getTokenForObjectResponse = await axios.post(`${be_url}/getTokenForObject`, { username }, config);

    // console.log(getTokenForObjectResponse.data.token.token, "This is token for object");
    // return { email: payload.username, token: getTokenForObjectResponse.data.token.token };
    return { email: payload.username, token: tokenResponse.data };
  } catch (error) {
    console.error('Error fetching data:', error);
    window.location.replace(`${fe_url}/server-error`);
    return { email: '', token: '' };
  }
};

export const getSessionDetailsForUser = async (userId: any) => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();
    const payload = parseJwt(jwtToken);
    let username = '';

    if (payload) {
      username = payload.username;
    }
    const headers = setAuthHeader();

    const config = {
      headers: headers,
      withCredentials: true,
    };
    const response = await axios.post(
      `${be_url}/api/salesforce/session-details?user_id=${userId}`,
      { username: username },
      config,
    );
    return response.data;
  } catch (error: any) {
    console.log(error, 'Unable to fetch the Session Details');
    return { access_token: 'response' };
  }
};

export const getIframeDetails = async (userId: any, caseId: any) => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();
    const payload = parseJwt(jwtToken);
    let username = '';

    if (payload) {
      username = payload.username;
    }

    const headers = setAuthHeader();
    const config = {
      headers: headers,
      withCredentials: true,
    };
    const response = await axios.post(
      `${be_url}/api/salesforce/iframe`,
      { username: username, caseId: caseId, userId: userId },
      config,
    );
    console.log('inside getIframeDetails : Function : ', response);
    console.log('.data for the response : ', response.data);
    return response.data;
  } catch (error: any) {
    console.log(error, 'unable to fetch the Iframe Details');
  }
};
