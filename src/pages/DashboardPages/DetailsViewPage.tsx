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
const { Option } = Select;


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
    caseNumber?: string;     // An optional case number to refine the search
    casePriority?: string;   // An optional case priority to refine the search
  }
  const searchParams = {
    caseOwnerName: ["azimuddin mohammed"],
  };
  interface SearchResultItem {
    casePriority: string;
    caseSubject: string;
    caseSFDCUrl: string;
  };
  

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

  const searchURLParam = new URLSearchParams(location.search);
  const status = searchURLParam.get('status');

  useEffect(
        ()=> {
            if(status !== 'success') {
                const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
                window.location.href = authUrl;
            }else{
                handleSearch();
            }
        }
    , [status])

  const handleCustomAction = useCallback((paylod: any) => {
    if (paylod.data.id == 'sfdc-detailed-view') {
      console.log(paylod.data);
    }
  }, []);

  const handleCreateCase = async () => {
    const caseData = {
      subject: 'Test Case from Frontend',
      description: 'This is a test case created from the frontend.',
    };
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
      console.error('Error creating case:', error);
      // Handle error (e.g., show error message)
    }
  };

//   const initiateSalesforceAuth = async () => {
//     window.location.href = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
//   };


const handleSearch = async () => {
    try {
      // Assuming advancedSearchData returns an array of SearchResultItem
      // You might need to adjust this based on the actual return type of advancedSearchData
      const [data, error] = await advancedSearchData({ ...searchParams, casePriority: selectedPriority !== 'All' ? selectedPriority : undefined });
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
    }}
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };
  useEffect(() => {
    filterResults(allSearchResults);
  }, [selectedPriority, allSearchResults]);


  return (
    <div style={{display:'flex'}}>
      <LeftSideCol style={{ width: '500px', minHeight: '100vh' }}>
      <div style={{ margin: '1em' }}>
          <label style={{marginRight:'1.1em'}} htmlFor="prioritySelect">Filter by Priority:</label>
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
                <div onClick={() => handleSelectItem(item)} style={{backgroundColor:'#5b61a8', borderRadius: '5px', padding:'0.1em', marginBottom: '0.8em'}} key={index}>
                    {details ? (
                    <div style={{  paddingLeft: '0.5em', marginBottom: '0.5em' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => window.open(details.link, "_blank")}>{details.caseNumber}</span>
                        <span style={{ marginLeft: '1.2em', marginRight: '1.2em' }}>{item.casePriority}</span>
                        <span style={{ width: 'inherit', display:'flex'}}>{item.caseSubject}</span>
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
      <div>
        Hi there Timere
      </div>
    </div>
  );
};

export default DetailsViewPage;
