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
import { Select } from 'antd';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
const { Option } = Select;
import './dashboard.css';
import { ThemeType } from '@app/interfaces/interfaces';
import axios from 'axios';

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

const be_url = process.env.REACT_APP_BE_URL;

const DetailsViewPage = () => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | null>('P0');
  const [loading, setLoading] = useState<boolean>(false);

  const [vizId, setVizId] = useState('');
  const [runtimeFilters, setRuntimeFilters] = useState<RuntimeFilter[]>([]);

  const navigate = useNavigate();
  const embedRef = useEmbedRef();
  const theme: ThemeType = useAppSelector((state) => state.theme.theme);
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
      console.error('Invalid priority level:', value);
    }
  };

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

  useEffect(() => {
    if (status !== 'success') {
      const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
      window.location.href = authUrl;
    } else {
      console.log('User is already authenticated !');
    }

    const storedPriority = getCookie('PriorityDetailedView') || 'P0';
    const storedUsers = JSON.parse(getCookie('selectedUsers') || '[]');
    console.log(storedPriority, storedUsers);

    if (storedPriority === null) {
      console.log('Priority cookie not found, setting default vizId.');
      setVizId('301a2eee-1519-4c92-8f1c-4c18e219c13b');
    } else {
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
    console.log(storedPriority, typeof storedPriority);
    if (isValidPriority) {
      setSelectedPriority(storedPriority as PriorityLevel);
    } else {
      setSelectedPriority('P0');
    }

    const initialVizId = isValidPriority
      ? priorityToVizIdMapping[storedPriority as PriorityLevel]
      : priorityToVizIdMapping.P0;
    console.log(initialVizId, 'This is initial Viz Id, ');
    setVizId(initialVizId);

    const userSpecificLB = async () => {
      const { email } = await fetchUserAndToken();
      const emailNamePart = email.split('@')[0];
      const formattedName = emailNamePart.split('.').join(' ');

      const runtimeFilters = [
        {
          columnName: 'Case Owner Name',
          operator: RuntimeFilterOp.EQ,
          values: [formattedName],
        },
      ];
      setRuntimeFilters(runtimeFilters);
    };
    userSpecificLB();

    const caseId = '5003n00002lS4FQAA0';
    setIframSource(caseId);
  }, [status]);

  const handleCustomAction = useCallback((paylod: any) => {
    if (paylod.data.id == 'details-view-sfdc') {
      console.log(paylod.data);
    }
  }, []);

  const handleDoubleClick = async (data: any) => {
    setLoading(true);

    const first = data.data.clickedPoint.deselectedAttributes;
    const second = data.data.clickedPoint.selectedAttributes;
    const mergedAttributes = [...first, ...second];
    const caseSfdcUrlItem = mergedAttributes.find((item) => item.column.name === 'Case Sfdc Url');
    const caseSfdcUrlValue = caseSfdcUrlItem ? caseSfdcUrlItem.value : null;

    if (caseSfdcUrlValue) {
      const caseId = caseSfdcUrlValue.split('/').pop();
      await setIframSource(caseId);
    } else {
      console.error('Case SFDC URL not found.');
    }

    setLoading(false);
  };

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
        <div style={{ margin: '1em' }}>
          <label style={{ marginRight: '1.1em' }} htmlFor="prioritySelect">
            Filter by Priority:
          </label>

          <Select
            key={selectedPriority}
            defaultValue={selectedPriority}
            style={{ width: 120 }}
            onChange={handlePriorityChange}
          >
            {Object.keys(priorityToVizIdMapping).map((priority) => (
              <Option key={priority} value={priority}>
                {priority}
              </Option>
            ))}
          </Select>
        </div>
        <TseWrapper>{liveboardEmbedComponent}</TseWrapper>
      </LeftSideCol>
      <div style={{ display: 'flex', width: '100%', marginTop: '6em' }}>
        <div id="iframeparent" style={{ flexGrow: 1, minWidth: 'inherit', height: '90%' }}>
          {iframeUrl && !loading ? (
            <iframe
              id="iframeId"
              src="https://thoughtspot--preprod.sandbox.my.salesforce.com/apex/sfdc_case_view?id=500VE000002GtCHYA0"
              width="100%"
              height="95%"
              frameBorder="0"
              title="Salesforce Case Details"
            ></iframe>
          ) : (
            <p>Loading Salesforce case details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsViewPage;
