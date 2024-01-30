import axios from 'axios';

const be_url = process.env.REACT_APP_BE_URL;

interface Tab {
  id: string;
  name: string;
}

const fetchAndTransformTabs = async (): Promise<Tab[]> => {
  try {
    const response = await axios.get(`${be_url}/getTabs`,{ timeout: 30000 });

    const transformedTabs: Tab[] = response.data.tabs.tab.map((tab: any) => ({
      id: tab.header.guid,
      name: tab.header.display_name,
    }));

    return transformedTabs;
  } catch (error) {
    console.error('Error fetching tabs:', error);
    return [];
  }
};

export default fetchAndTransformTabs;
