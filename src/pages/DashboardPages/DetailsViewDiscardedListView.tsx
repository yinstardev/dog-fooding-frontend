import { Btn } from '@app/components/common/MoonSunSwitch/MoonSunSwitch.styles';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { LiveboardEmbed, useEmbedRef, RuntimeFilterOp, HostEvent } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftSideCol, ResultItem, RightSideCol, SelectPriority } from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import advancedSearchData from '@app/api/AdvancedSearchApi';
import { Select } from 'antd';
import axios from 'axios';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
const { Option } = Select;

declare global {
  interface Window {
    $Lightning: any; // Use 'any' type for simplicity, or define a more specific type
  }
}

const extractCaseDetails = (casePriority: any) => {
  if (!casePriority) {
    // Return a default or null object if casePriority is undefined or null
    return casePriority;
  }

  const match = casePriority.match(/\{caption\}(\d+)\{\/caption\}(.+)/);
  return match ? { caseNumber: match[1], link: match[2] } : null;
};

interface AdvancedSearchDataParam {
  caseOwnerName: string[]; // An array of case owner names to include in the search query
  caseNumber?: string; // An optional case number to refine the search
  casePriority?: string; // An optional case priority to refine the search
}
const searchParams = {
  caseOwnerName: ['azimuddin mohammed'],
};
interface SearchResultItem {
  casePriority: string;
  caseSubject: string;
  caseSFDCUrl: string;
}

const DetailsViewPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [allSearchResults, setAllSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const navigate = useNavigate();
  const embedRef = useEmbedRef();
  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
  const theme = useAppSelector((state) => state.theme.theme);
  const location = useLocation();

  //   const [iframeUrl, setIframeUrl] = useState('');
  const [lightningUrl, setLightningUrl] = useState('');

  const searchURLParam = new URLSearchParams(location.search);
  const status = searchURLParam.get('status');
  const salesforce_user_id = searchURLParam.get('user_id');

  function loadScript(src: any, callback: any) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => callback();
    script.onerror = (error) => {
      console.error(`Error loading script: ${src}`, error);
    };
    document.head.appendChild(script);
  }

  useEffect(() => {
    if (status !== 'success') {
      const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
      window.location.href = authUrl;
    } else {
      handleSearch();
    }
    const fetchSalesforceSessionDetails = async () => {
      const userId = searchURLParam.get('user_id');
      const caseId = '500VE000002GtCHYA0';
      try {
        const response = await axios.get(`http://localhost:1337/api/salesforce/session-details?user_id=${userId}`);
        console.log(response.data.instance_url);
        const { instance_url, access_token } = response.data;
        console.log(access_token, 'This is access Token');
        const lightningOutJsUrl = `${instance_url}/lightning/lightning.out.js`;

        loadScript(lightningOutJsUrl, () => {
          window.$Lightning.use(
            'c:TSE_Dogfooding_View',
            () => {
              console.log('Load Script Function: Inside');
              window.$Lightning.createComponent(
                'c:CaseDetailsEditView',
                { recordId: '500VE000002GtCHYA0' },
                'lightningOutApp',
                (component: any) => {
                  console.log('Component created:', component);
                },
              );
            },
            instance_url,
            access_token,
          );
        });
      } catch (error) {
        console.error('Failed to load Salesforce Lightning Out:', error);
      }
    };
    fetchSalesforceSessionDetails();
  }, [status]);

  const handleCustomAction = useCallback((paylod: any) => {
    if (paylod.data.id == 'sfdc-detailed-view') {
      console.log(paylod.data);
    }
  }, []);

  const fetchCaseDetails = async (caseNumber: any) => {
    // Assuming `userId` is obtained from global state, local storage, or JWT
    // const { email } = await fetchUserAndToken();
    const caseData = {
      subject: 'Test Case from Frontend',
      description: 'This is a test case created from the frontend.',
    };
    const userId = salesforce_user_id;
    const be_url = process.env.REACT_APP_BE_URL;

    try {
      const response = await fetch(`${be_url}/salesforce/create-case`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Case created successfully:', data);
        // Handle success (e.g., show success message or redirect)
      } else {
        console.error('Failed to create case:', data.message);
        // Handle failure (e.g., show error message)
      }
    } catch (error) {
      console.error('Failed to load Salesforce Lightning Out:', error);
    }
  };

  const handleCreateCase = async () => {
    fetchCaseDetails('00353955');

    // const caseData = {
    //   subject: 'This is with new account !!',
    //   description: 'This is a test case created from the frontend.',
    // };
    // const be_url = process.env.REACT_APP_BE_URL;
    // const userId = salesforce_user_id;
    // try {
    //   const response = await fetch(`${be_url}/salesforce/create-case?user_id=${userId}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(caseData),
    //   });

    //   const data = await response.json();
    //   if (data.success) {
    //     console.log('Case created successfully:', data);
    //     // Handle success (e.g., show success message or redirect)
    //   } else {
    //     console.error('Failed to create case:', data.message);
    //     // Handle failure (e.g., show error message)
    //   }
    // } catch (error) {
    //   console.error('Error creating case:', error);
    //   // Handle error (e.g., show error message)
    // }
  };

  //   const initiateSalesforceAuth = async () => {
  //     window.location.href = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
  //   };

  const handleSearch = async () => {
    try {
      // Assuming advancedSearchData returns an array of SearchResultItem
      // You might need to adjust this based on the actual return type of advancedSearchData
      const [data, error] = await advancedSearchData({
        ...searchParams,
        casePriority: selectedPriority !== 'All' ? selectedPriority : undefined,
      });
      console.log(data);
      if (error) {
        console.error('Error fetching search data:', error);
        // Optionally handle the error, e.g., display an error message
        return;
      }
      setAllSearchResults(data); // Store all fetched data
      filterResults(data);
      setSearchResults(data); // Assuming 'data' is of type SearchResultItem[]
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };
  const filterResults = (data: any) => {
    if (selectedPriority === 'All') {
      setSearchResults(data);
    } else {
      const filteredData = data.filter((item: any) => item.casePriority === selectedPriority);
      setSearchResults(filteredData);
    }
  };
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };
  useEffect(() => {
    filterResults(allSearchResults);
  }, [selectedPriority, allSearchResults]);

  return (
    <div style={{ display: 'flex' }}>
      <LeftSideCol style={{ width: '500px', minHeight: '100vh' }}>
        <div style={{ margin: '1em' }}>
          <label style={{ marginRight: '1.1em' }} htmlFor="prioritySelect">
            Filter by Priority:
          </label>
          <Select
            id="prioritySelect"
            value={selectedPriority}
            style={{ width: 200 }} // You can adjust the width as needed
            onChange={(value) => setSelectedPriority(value)} // Directly use value
          >
            <Option value="All">All Priorities</Option>
            <Option value="P0">P0</Option>
            <Option value="P1">P1</Option>
            <Option value="P2">P2</Option>
            <Option value="P3">P3</Option>
            {/* Add more priorities as needed */}
          </Select>
        </div>
        <div style={{ backgroundColor: 'inherit', padding: '0.5em' }}>
          {searchResults.map((item, index) => {
            const details = extractCaseDetails(item.caseSFDCUrl);
            return (
              <div
                onClick={() => handleSelectItem(item)}
                style={{ backgroundColor: '#5b61a8', borderRadius: '5px', padding: '0.1em', marginBottom: '0.8em' }}
                key={index}
              >
                {details ? (
                  <div style={{ paddingLeft: '0.5em', marginBottom: '0.5em' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => window.open(details.link, '_blank')}>
                      {details.caseNumber}
                    </span>
                    <span style={{ marginLeft: '1.2em', marginRight: '1.2em' }}>{item.casePriority}</span>
                    <span style={{ width: 'inherit', display: 'flex' }}>{item.caseSubject}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <Btn style={{ margin: '1em' }} onClick={handleCreateCase}>
          Create Case
        </Btn>
      </LeftSideCol>
      <div style={{ display: 'flex', width: '100%' }}>
        {/* Your existing left column code here */}

        {/* Right column to display the Visualforce page */}
        <div id="lightningOutApp" style={{ flexGrow: 1, minHeight: '100vh', minWidth: 'inherit' }}>
          {/* {iframeUrl ? (
          <iframe
            src={iframeUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Salesforce Case Details"
          ></iframe>
        ) : (
          <p>Loading Salesforce case details...</p>
        )} */}
          Loading
        </div>
      </div>
    </div>
  );
};

export default DetailsViewPage;
