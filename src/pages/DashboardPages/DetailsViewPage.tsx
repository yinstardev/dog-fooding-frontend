import { Btn } from '@app/components/common/MoonSunSwitch/MoonSunSwitch.styles';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import {
  LiveboardEmbed,
  useEmbedRef,
  RuntimeFilterOp,
  HostEvent,
  Action,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftSideCol, ResultItem, RightSideCol, SelectPriority } from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import advancedSearchData from '@app/api/AdvancedSearchApi';
import { Select } from 'antd';
import axios from 'axios';
import { fetchUserAndToken, getIframeDetails, getSessionDetailsForUser } from '@app/api/getUserAndToken';
const { Option } = Select;
import './dashboard.css';

interface RuntimeFilter {
  columnName: string;
  operator: RuntimeFilterOp;
  values: any[];
}

declare global {
  interface Window {
    $Lightning: any;
  }
}

const searchParams = {
  caseOwnerName: ['azimuddin mohammed'],
};
interface SearchResultItem {
  casePriority: string;
  caseSubject: string;
  caseSFDCUrl: string;
}

const be_url = process.env.REACT_APP_BE_URL;

const DetailsViewPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [allSearchResults, setAllSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | null>('P0');
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [vizId, setVizId] = useState('');
  const [runtimeFilters, setRuntimeFilters] = useState<RuntimeFilter[]>([]);

  const navigate = useNavigate();
  const embedRef = useEmbedRef();
  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
  const theme = useAppSelector((state) => state.theme.theme);
  const location = useLocation();

  const [iframeUrl, setIframeUrl] = useState('');

  const searchURLParam = new URLSearchParams(location.search);
  const status = searchURLParam.get('status');
  const salesforce_user_id = searchURLParam.get('user_id');

  type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

  const priorityToVizIdMapping: {
    [key in PriorityLevel]: string;
  } = {
    P0: '301a2eee-1519-4c92-8f1c-4c18e219c13b',
    P1: 'def91044-dd64-4ea6-94fe-d4c2d59d676b',
    P2: '3e323c01-a43c-48d0-99a1-4ca8ce1f4904',
    P3: '98442848-0cd8-4acd-b81b-6dd413957aae',
  };

  const handlePriorityChange = (value: PriorityLevel) => {
    if (value in priorityToVizIdMapping) {
      setVizId(priorityToVizIdMapping[value]);
      setSelectedPriority(value);
    } else {
      console.error("Invalid priority level:", value);
    }
  };
  function loadScript(src: any, callback: any) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => callback();
    script.onerror = (error) => {
      console.error(`Error loading script: ${src}`, error);
    };
    document.head.appendChild(script);
  }

  const generateIframeSrc =  async (userId: any, caseId: any) =>  {
    // const salesforceBaseUrl = 'https://thoughtspot--preprod.sandbox.lightning.force.com';
    // const visualforcePagePath = '/apex/sfdc_case_view';
    // const iframeSrc = `${salesforceBaseUrl}${visualforcePagePath}?access_token=${accessToken}&user_id=${userId}?&id=${caseId}`;
    const iframeSrc = await getIframeDetails(userId,caseId);
    console.log(iframeSrc, ": This is the iframesource");
    return iframeSrc;
  }


  // const generateIframeSrc =  (accessToken: any, userId: any, caseId: any) =>  {
  //   const salesforceBaseUrl = 'https://thoughtspot--preprod.sandbox.lightning.force.com';
  //   const visualforcePagePath = '/apex/sfdc_case_view';
  //   const iframeSrc = `${salesforceBaseUrl}${visualforcePagePath}?access_token=${accessToken}&user_id=${userId}?&id=${caseId}`;
  //   return iframeSrc;
  // }

  function getCookie(name: any) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const setIframSource = async (caseId: any) => {
    const userId = searchURLParam.get('user_id');
    try {
    //   const response = await axios.get(`${be_url}/api/salesforce/session-details?user_id=${userId}`);
      // const response = await getSessionDetailsForUser(userId);
      // console.log("We are setting Iframe url : ",response);
      // const { instance_url, access_token } = response;
      // const iframeSrc = generateIframeSrc(access_token, userId, caseId);
      // const iframeSrc = await generateIframeSrc( userId, caseId);
      const response = await fetch(`${be_url}/api/salesforce/iframe?userId=${userId}&caseId=${caseId}`);
      const data = await response.json();
      const iframeUrl = data.url;
      
      const iframe = document.getElementById('iframeId') as HTMLIFrameElement;
      if (iframe) {
          iframe.src = iframeUrl;
      }
      setIframeUrl('iframe');
    } catch (error: any) {
      console.log(error);
    }
  };

//   const checkSalesforceSession = async () => {
//     try {
//         const userId = searchURLParam.get('user_id');
//         const response = await fetch(`${be_url}/api/salesforce/check-salesforce-session?userId=${userId}`);
//         const { hasValidSession } = await response.json();
        
//         if (!hasValidSession) {
//             window.location.href = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
//         } else {
//             console.log("User has a valid Salesforce session. Skipping authentication.");
//         }
//     } catch (error) {
//         console.error('Failed to check Salesforce session:', error);
//     }
// };
  useEffect(() => {
    if (status !== 'success') {
      const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
      window.location.href = authUrl;
    } else {
      console.log("User is already authenticated !");
    }
    // checkSalesforceSession();

    const storedPriority = getCookie('PriorityDetailedView') || 'P0';
    const storedUsers = JSON.parse(getCookie('selectedUsers') || '[]');
    console.log(storedPriority, storedUsers);
    
    if (storedPriority === null) {
      // Handle the case where the cookie is not set
      console.log("Priority cookie not found, setting default vizId.");
      setVizId('301a2eee-1519-4c92-8f1c-4c18e219c13b'); // Default vizId
    } else{
      switch (storedPriority) {
        case 'P0':
          setVizId('301a2eee-1519-4c92-8f1c-4c18e219c13b');
          break;
        case 'P1':
          setVizId('def91044-dd64-4ea6-94fe-d4c2d59d676b');
          break;
        case 'P2':
          setVizId('3e323c01-a43c-48d0-99a1-4ca8ce1f4904');
          break;
        case 'P3':
          setVizId('98442848-0cd8-4acd-b81b-6dd413957aae');
          break;
        default:
          setVizId('301a2eee-1519-4c92-8f1c-4c18e219c13b');
      }
    }

    const isValidPriority: boolean = ['P0', 'P1', 'P2', 'P3'].includes(storedPriority);
    console.log(isValidPriority, "Priority is valid");
    console.log(storedPriority, typeof storedPriority);
    if (isValidPriority) {
      setSelectedPriority(storedPriority as PriorityLevel);
    } else {
      setSelectedPriority('P0');
    }
  

    const initialVizId = isValidPriority ? priorityToVizIdMapping[storedPriority as PriorityLevel] : priorityToVizIdMapping.P0;
    console.log(initialVizId, "This is initial Viz Id, ", )
    setVizId(initialVizId);
    // setSelectedPriority(isValidPriority ? (storedPriority as PriorityLevel) : 'P0');

    // const runtimeFilters = storedUsers.map((user: any) => ({
    //   columnName: 'Case Owner Name',
    //   operator: RuntimeFilterOp.EQ,
    //   values: [user],
    // }));
    const userSpecificLB = async () => {
      const { email } = await fetchUserAndToken();
      const emailNamePart = email.split('@')[0];
      const formattedName = emailNamePart.split('.').join(' ');

      const case_owner_name = 'Case Owner Name';
      const runtimeFilters = [ {
        columnName: 'Case Owner Name',
        operator: RuntimeFilterOp.EQ,
        values: ['azimuddin mohammed'],
      }];
      setRuntimeFilters(runtimeFilters);
    }
    userSpecificLB();

    const caseId = '500VE000002GtCHYA0';
    setIframSource(caseId);

    // const fetchSalesforceSessionDetails = async () => {
    //   const userId = searchURLParam.get('user_id');
    //   const caseId = '500VE000002GtCHYA0';
    //   try {
    //     const response = await axios.get(`${be_url}/api/salesforce/session-details?user_id=${userId}`);
    //     console.log(response.data.instance_url);
    //     const { instance_url, access_token } = response.data;
    //     console.log(access_token, 'This is access Token');
    //     const lightningOutJsUrl = `${instance_url}/lightning/lightning.out.js`;

    //     loadScript(lightningOutJsUrl, () => {
    //       window.$Lightning.use(
    //         'c:TSE_Dogfooding_View',
    //         () => {
    //           console.log('Load Script Function: Inside');
    //           window.$Lightning.createComponent(
    //             'c:CaseDetailsEditView',
    //             { recordId: '500VE000002GtCHYA0' },
    //             'lightningOutApp',
    //             (component: any) => {
    //               console.log('Component created:', component);
    //             },
    //           );
    //         },
    //         instance_url,
    //         access_token,
    //       );
    //     });
    //   } catch (error) {
    //     console.error('Failed to load Salesforce Lightning Out:', error);
    //   }
    // };
    //   fetchSalesforceSessionDetails();
  }, [status]);

  const handleCustomAction = useCallback((paylod: any) => {
    if (paylod.data.id == 'details-view-sfdc') {
      console.log(paylod.data);
    }
  }, []);

  const fetchCaseDetails = async (caseNumber: any) => {
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
      } else {
        console.error('Failed to create case:', data.message);
      }
    } catch (error) {
      console.error('Failed to load Salesforce Lightning Out:', error);
    }
  };

  const handleCreateCase = async () => {
    fetchCaseDetails('00353955');
  };

  // const handleSearch = async () => {
  //   try {
  //     const [data, error] = await advancedSearchData({
  //       ...searchParams,
  //       casePriority: selectedPriority !== 'All' ? selectedPriority : undefined,
  //     });
  //     console.log(data);
  //     if (error) {
  //       console.error('Error fetching search data:', error);
  //       return;
  //     }
  //     setAllSearchResults(data);
  //     filterResults(data);
  //     setSearchResults(data);
  //   } catch (error) {
  //     console.error('Error fetching search data:', error);
  //   }
  // };
  // const filterResults = (data: any) => {
  //   if (selectedPriority === 'All') {
  //     setSearchResults(data);
  //   } else {
  //     const filteredData = data.filter((item: any) => item.casePriority === selectedPriority);
  //     setSearchResults(filteredData);
  //   }
  // };
  // const handleSelectItem = (item: any) => {
  //   setSelectedItem(item);
  // };
  const handleDoubleClick = async (data: any) => {
    setLoading(true); // Start loading before fetching iframe details
  
    const first = data.data.clickedPoint.deselectedAttributes;
    const second = data.data.clickedPoint.selectedAttributes;
    const mergedAttributes = [...first, ...second];
    const caseSfdcUrlItem = mergedAttributes.find((item) => item.column.name === 'Case Sfdc Url');
    const caseSfdcUrlValue = caseSfdcUrlItem ? caseSfdcUrlItem.value : null;
  
    if (caseSfdcUrlValue) {
      const caseId = caseSfdcUrlValue.split('/').pop();
      await setIframSource(caseId); // Wait for iframe source to be set
    } else {
      console.error("Case SFDC URL not found.");
    }
  
    setLoading(false); // End loading after setting iframe source or if an error occurs
  };
  // useEffect(() => {
  //   filterResults(allSearchResults);
  // }, [selectedPriority, allSearchResults]);

  const liveboardEmbedComponent = useMemo(() => {
    return (
      <LiveboardEmbed
        ref={embedRef as any}
        className="detailed-view"
        liveboardId="72699018-683d-4b42-b599-1ba304beb281"
        vizId={vizId}
        onVizPointDoubleClick={(data: any) => {
          handleDoubleClick(data);
        }}
        hiddenActions={[
          Action.AddToFavorites,
          Action.Edit,
          Action.SyncToOtherApps,
          Action.SyncToSheets,
          Action.ManagePipelines,
        ]}
        onCustomAction={handleCustomAction}
        disabledActions={[
          Action.DownloadAsPdf,
          Action.ExportTML,
          Action.Share,
          Action.RenameModalTitleDescription,
          Action.SpotIQAnalyze,
        ]}
        runtimeFilters={runtimeFilters}
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
    );
  }, [vizId, runtimeFilters, theme]);

  return (
    <div key={theme} className="container-detailedview" style={{ display: 'flex' }}>
      <LeftSideCol className="LeftSideListView" style={{ width: '700px' }}>
        <Btn style={{ margin: '1em' }} onClick={() => navigate('/')}>
          Get Back to LB
        </Btn>
        <div style={{ margin: '1em' }}>
          <label style={{ marginRight: '1.1em' }} htmlFor="prioritySelect">
            Filter by Priority:
          </label>

          <Select key={selectedPriority} defaultValue={selectedPriority} style={{ width: 120 }} onChange={handlePriorityChange}>
          {Object.keys(priorityToVizIdMapping).map(priority => (
            <Option key={priority} value={priority}>{priority}</Option>
          ))}
        </Select>
        </div>
        <TseWrapper>{liveboardEmbedComponent}</TseWrapper>
      </LeftSideCol>
      <div style={{ display: 'flex', width: '100%' }}>
        {/* <div id="lightningOutApp" style={{ flexGrow: 1, minHeight: '100vh', minWidth:'inherit' }}> */}
        <div id="iframeparent" style={{ flexGrow: 1, minWidth: 'inherit' }}>
          {(iframeUrl && !loading) ? (
            <iframe id="iframeId" src="https://thoughtspot--preprod.sandbox.lightning.force.com/lightning/r/Case/500VE000002GtCHYA0/view" width="100%" height="95%" frameBorder="0" title="Salesforce Case Details"></iframe>
          ) : (
            <p>Loading Salesforce case details...</p>
          )} 
        </div>
      </div>
    </div>
  );
};

export default DetailsViewPage;
