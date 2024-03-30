import axios from 'axios';
import { fetchUserAndToken } from './getUserAndToken';

const getJwtTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token;
};

const be_url = process.env.REACT_APP_BE_URL || '';

export const saveFilterAndTabs = async (filters: Filters, tabs: Tab[]) => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();
    if (!jwtToken) throw new Error('JWT token not found');

    const emailResponse = await fetchUserAndToken();
    const email = emailResponse.email;

    const requestData = {
      email,
      filters,
      tabs,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    await axios.post(`${be_url}/addTabsAndFilters`, requestData, config);

    console.log('Filter and tabs values saved successfully.');
  } catch (error) {
    console.error('Error saving filter and tabs values:', error);
  }
};

export const getFilterAndTabs = async () => {
  try {
    const jwtToken = getJwtTokenFromLocalStorage();
    if (!jwtToken) throw new Error('JWT token not found');

    const emailResponse = await fetchUserAndToken();
    const email = emailResponse.email;

    const response = await axios.get(`${be_url}/getTabsAndFilters`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      params: { email },
    });

    const { filters, tabs } = response.data;
    console.log('Filter and tabs values retrieved successfully:', filters, tabs);
    return { filters, tabs };
  } catch (error) {
    console.error('Error retrieving filter and tabs values:', error);
    return { filters: [], tabs: [] };
  }
};

interface Filters {
  accountNames: string[];
  caseNumbers: string[];
}

interface Tab {
  id: string;
  name: string;
}
