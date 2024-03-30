import axios from 'axios';
import { fetchUserAndToken } from './getUserAndToken';

const be_url = process.env.REACT_APP_BE_URL || '';

export const saveFilterAndTabs = async (filters: Filters, tabs: Tab[]) => {
  try {
    const { email, token } = await fetchUserAndToken();

    const requestData = {
      email,
      filters,
      tabs,
    };
    console.log(' Just before the request to backend', requestData);

    await axios.post(`${be_url}/addTabsAndFilters`, requestData);

    console.log('Filter and tabs values saved successfully.');
  } catch (error) {
    console.error('Error saving filter and tabs values:', error);
  }
};

export const getFilterAndTabs = async () => {
  try {
    const { email, token } = await fetchUserAndToken();

    const response = await axios.get(`${be_url}/getTabsAndFilters`, {
      headers: { Authorization: `Bearer ${token}` },
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
