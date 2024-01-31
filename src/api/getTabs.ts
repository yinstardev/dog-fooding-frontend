import axios from 'axios';

const be_url = process.env.REACT_APP_BE_URL;

// interface Tab {
//   id: string;
//   name: string;
// }

// const fetchAndTransformTabs = async (): Promise<Tab[]> => {
//   try {
//     const response = await axios.get(`${be_url}/getTabs`);

//     const transformedTabs: Tab[] = response.data.tabs.tab.map((tab: any) => ({
//       id: tab.header.guid,
//       name: tab.header.display_name,
//     }));

//     return transformedTabs;
//   } catch (error) {
//     console.error('Error fetching tabs:', error);
//     return [];
//   }
// };

interface Tab {
  id: string;
  name: string;
}

const fetchAndTransformTabs = async () => {
  try {
    await axios.get(`${be_url}/getTabs`);
    return await checkStatus();
  } catch (error) {
    console.error('Error initiating getTabs:', error);
  }
};

const checkStatus = async (): Promise<Tab[]> => {
  const statusResponse = await axios.get(`${be_url}/getStatus`);
  const status = statusResponse.data.status;

  if (status === 'processing') {
    console.log("Another request outgoing");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await checkStatus();
  } else if (status === 'completed') {
    console.log("Final Response")
    return statusResponse.data.data;
  } else if (status === 'failed') {
    throw new Error('Error:', statusResponse.data.error);
  }

  throw new Error('Unexpected status');
};

export default fetchAndTransformTabs;
