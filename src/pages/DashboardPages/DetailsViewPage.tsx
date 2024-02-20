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
import { fetchUserAndToken } from '@app/api/getUserAndToken';
const { Option } = Select;
import './dashboard.css';

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
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [vizId, setVizId] = useState('');
  const [runtimeFilters, setRuntimeFilters] = useState([]);

  const navigate = useNavigate();
  const embedRef = useEmbedRef();
  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
  const theme = useAppSelector((state) => state.theme.theme);
  const location = useLocation();

  const [iframeUrl, setIframeUrl] = useState('');

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

  function generateIframeSrc(accessToken: any, userId: any, caseId: any) {
    const salesforceBaseUrl = 'https://thoughtspot--preprod.sandbox.lightning.force.com';
    const visualforcePagePath = '/apex/sfdc_case_view';
    const iframeSrc = `${salesforceBaseUrl}${visualforcePagePath}?access_token=${accessToken}&user_id=${userId}?&id=${caseId}`;
    return iframeSrc;
  }

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
      const response = await axios.get(`${be_url}/api/salesforce/session-details?user_id=${userId}`);
      const { instance_url, access_token } = response.data;
      const iframeSrc = generateIframeSrc(access_token, userId, caseId);
      setIframeUrl(iframeSrc);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (status !== 'success') {
      const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
      window.location.href = authUrl;
    } else {
      handleSearch();
    }

    const storedPriority = getCookie('PriorityDetailedView');
    const storedUsers = JSON.parse(getCookie('selectedUsers') || '[]');
    console.log(storedPriority, storedUsers);

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

    const runtimeFilters = storedUsers.map((user: any) => ({
      columnName: 'Case Owner Name',
      operator: RuntimeFilterOp.EQ,
      values: [user],
    }));

    setRuntimeFilters(runtimeFilters);

    const caseId = '500VE000002GtCHYA0';
    setIframSource(caseId);

    const fetchSalesforceSessionDetails = async () => {
      const userId = searchURLParam.get('user_id');
      const caseId = '500VE000002GtCHYA0';
      try {
        const response = await axios.get(`${be_url}/api/salesforce/session-details?user_id=${userId}`);
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

  const handleSearch = async () => {
    try {
      const [data, error] = await advancedSearchData({
        ...searchParams,
        casePriority: selectedPriority !== 'All' ? selectedPriority : undefined,
      });
      console.log(data);
      if (error) {
        console.error('Error fetching search data:', error);
        return;
      }
      setAllSearchResults(data);
      filterResults(data);
      setSearchResults(data);
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

  const handleDoubleClick = (data: any) => {
    const first = data.data.clickedPoint.deselectedAttributes;
    const second = data.data.clickedPoint.selectedAttributes;
    const mergedAttributes = [...first, ...second];
    const caseSfdcUrlItem = mergedAttributes.find((item) => item.column.name === 'Case Sfdc Url');
    const caseSfdcUrlValue = caseSfdcUrlItem ? caseSfdcUrlItem.value : null;
    console.log(caseSfdcUrlValue);
    const caseId = caseSfdcUrlValue.split('/').pop();
    console.log(caseId);
    setIframSource(caseId);
  };

  useEffect(() => {
    filterResults(allSearchResults);
  }, [selectedPriority, allSearchResults]);

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
    <div style={{ display: 'flex' }}>
      <LeftSideCol className="LeftSideListView" style={{ width: '700px', minHeight: '100%' }}>
        <TseWrapper>
          {/* <LiveboardEmbed
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
          /> */}
          {liveboardEmbedComponent}
        </TseWrapper>
      </LeftSideCol>
      <div style={{ display: 'flex', width: '100%' }}>
        {/* <div id="lightningOutApp" style={{ flexGrow: 1, minHeight: '100vh', minWidth:'inherit' }}> */}
        <div id="iframeparent" style={{ flexGrow: 1, minWidth: 'inherit' }}>
          {iframeUrl ? (
            <iframe src={iframeUrl} width="100%" height="95%" frameBorder="0" title="Salesforce Case Details"></iframe>
          ) : (
            <p>Loading Salesforce case details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsViewPage;
