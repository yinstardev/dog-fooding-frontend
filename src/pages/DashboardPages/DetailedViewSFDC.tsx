import { Btn } from '@app/components/common/MoonSunSwitch/MoonSunSwitch.styles';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { LiveboardEmbed, useEmbedRef, RuntimeFilterOp, HostEvent } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftSideCol, ResultItem, RightSideCol } from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import advancedSearchData from '@app/api/AdvancedSearchApi';

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
  casePriority: 'p0',
};
interface SearchResultItem {
  caseOwnerName: string;
  caseNumber: string;
  casePriority: string;
}

const DetailedViewPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const navigate = useNavigate();
  const embedRef = useEmbedRef();
  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
  const theme = useAppSelector((state) => state.theme.theme);

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
      const [data, error] = await advancedSearchData(searchParams);
      console.log(data);
      if (error) {
        console.error('Error fetching search data:', error);
        // Optionally handle the error, e.g., display an error message
        return;
      }
      setSearchResults(data); // Assuming 'data' is of type SearchResultItem[]
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };

  return (
    <>
      <LeftSideCol style={{ width: '500px', minHeight: '100vh' }}>
        <Btn style={{ margin: '1em' }} onClick={() => navigate(-1)}>
          Get Back to LB
        </Btn>
        {/* <TseWrapper>
          <LiveboardEmbed
            ref={embedRef}
            className="sfdc-list"
            liveboardId={liveboardId}
            onCustomAction={handleCustomAction}
            vizId="e5506a79-70f7-4cc7-b213-001759251858"
            hideTabPanel={true}
            hideLiveboardHeader={true}
            customizations={{
              style: {
                customCSS: {
                  variables: {
                    '--ts-var-application-color': themeObject[theme].background,
                    '--ts-var-root-background': themeObject[theme].background,
                    '--ts-var-nav-background': themeObject[theme].siderBackground,
                  },
                  rules_UNSTABLE: {
                    'body > app-controller > blink-app-page > div > div > div > bk-powered-footer': {
                      display: 'none',
                    },
                  },
                },
              },
            }}
          />
        </TseWrapper> */}
        <div style={{ backgroundColor: 'blue', padding: '0.5em' }}>
          {searchResults.map((item, index) => {
            const details = extractCaseDetails(item.caseNumber);
            return details ? (
              <ResultItem key={index}>
                <span style={{ cursor: 'pointer' }} onClick={() => window.open(details.link, '_blank')}>
                  {details.caseNumber}
                </span>
                <span style={{ marginLeft: '1.2em' }}>{item.caseOwnerName}</span>
                <span>{item.casePriority}</span>
              </ResultItem>
            ) : null;
          })}
        </div>
        <Btn style={{ margin: '1em' }} onClick={handleCreateCase}>
          Create Case
        </Btn>
        <Btn style={{ margin: '1em' }} onClick={handleSearch}>
          SearchData
        </Btn>
      </LeftSideCol>
    </>
  );
};

export default DetailedViewPage;
