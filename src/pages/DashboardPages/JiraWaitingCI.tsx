import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import {
  LiveboardEmbed,
  useEmbedRef,
  RuntimeFilterOp,
  HostEvent,
  Action,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { SuperSelect } from './support-central/SuperSelect';
import { searchData } from './support-central/searchData';
import { json, useNavigate } from 'react-router-dom';
import JiraIssueDetailsModal from './support-central/JiraIssueModal';
import advancedSearchData from '@app/api/AdvancedSearchApi';

type RuntimeFilter = {
  columnName: string;
  operator: RuntimeFilterOp;
  values: string[];
};

const JiraWaitingCI: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const embedRef = useEmbedRef();
  const navigate = useNavigate();

  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
  const [runtimeFilters, setRuntimeFilters] = useState<RuntimeFilter[]>([]);
  const [editAccountOwnerName, setEditAccountOwnerName] = useState<string[]>([]);
  const [accountOwnerNameList, setAccountOwnerNameList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jiraIssueId, setJiraIssueId] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const updateOptions = (data: string[]) => {
    const allValues = [...new Set([...data, ...options])];
    setOptions(allValues);
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const { email } = await fetchUserAndToken();
        const emailNamePart = email.split('@')[0];
        const formattedName = emailNamePart.split('.').join(' ');

        const case_owner_name = 'Case Owner Name';
        const [data] = await searchData({ query: '', columnName: case_owner_name });

        if (embedRef.current) {
          if (data.includes(formattedName)) {
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
              {
                columnName: case_owner_name,
                operator: RuntimeFilterOp.EQ,
                values: [formattedName],
              },
            ]);
            setEditAccountOwnerName([formattedName]);
          } else {
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
              //     {
              //       columnName: case_owner_name,
              //       operator: RuntimeFilterOp.EQ,
              //       values: ['Akash Singhal']
              //   }
            ]);
            setEditAccountOwnerName([]);
          }
        }
      } catch (error) {
        console.error('Error setting data:', error);
      }
    };

    fetchAndSetData();
  }, [embedRef]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setJiraIssueId(null);
  }, []);

  const handleSuperSelectChange = (newValues: string[]) => {
    setEditAccountOwnerName(newValues);
    console.log(newValues);

    if (embedRef.current) {
      embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
        {
          columnName: 'Case Owner Name',
          operator: RuntimeFilterOp.EQ,
          values: newValues,
        },
      ]);
    }
  };

  const handleCustomAction = useCallback(
    (payload: any) => {
      if (payload.data.id == 'sfdc-detailed-view') {
        window.location.href = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
        navigate('/detailed-view-sfdc');
      }
    },
    [navigate],
  );
  const handleVizDoubleClick = (data: any) => {
    console.log(data.data);

    const first = data.data.clickedPoint.deselectedAttributes;
    const second = data.data.clickedPoint.selectedAttributes;
    const mergedAttributes = [...first, ...second];
    const caseSfdcUrlItem = mergedAttributes.find((item) => item.column.name === 'JIRA SCAL URL');
    const caseSfdcUrlValue = caseSfdcUrlItem ? caseSfdcUrlItem.value : null;
    console.log(caseSfdcUrlValue, 'This is the url for jira ticket');

    const pattern = /browse\/(SCAL-\d+)/;
    const match = caseSfdcUrlValue.match(pattern);
    let issueId = '';
    if (match) {
      issueId = match[1];
    }
    setJiraIssueId(issueId);
    setIsModalOpen(true);
  };

  function setCookie(name: any, value: any, days: any) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
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

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        {/* <div style={{ maxWidth: '25em', marginLeft: '1em' }}>
          <SuperSelect
            columnName="Case Owner Name"
            defaultValues={editAccountOwnerName}
            updateValues={handleSuperSelectChange}
          />
        </div> */}
        <TseWrapper>
          <LiveboardEmbed
            ref={embedRef}
            activeTabId="04ba6c35-aea7-42b8-9a83-6dfebb595759"
            visibleTabs={['04ba6c35-aea7-42b8-9a83-6dfebb595759']}
            hiddenActions={[
              Action.AddToFavorites,
              Action.Edit,
              Action.SyncToOtherApps,
              Action.SyncToSheets,
              Action.ManagePipelines,
            ]}
            hideLiveboardHeader={true}
            onVizPointDoubleClick={(data: any) => {
              handleVizDoubleClick(data);
            }}
            // defaultHeight={800}
            frameParams={{ height: '900px' }}
            fullHeight={true}
            className="tse-jira-tickets-wait-ci-style"
            liveboardId={liveboardId}
            runtimeFilters={runtimeFilters}
            onCustomAction={handleCustomAction}
            preRenderId="tse-jira-tickets-wait-ci"
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
        </TseWrapper>
        {isModalOpen && jiraIssueId && (
          <JiraIssueDetailsModal jiraIssueId={jiraIssueId} isOpen={isModalOpen} onClose={closeModal} />
        )}
      </BaseCol>
    </BaseRow>
  );

  return (
    <div key={theme}>
      <PageTitle>{t('common.home')}</PageTitle>
      {desktopLayout}
    </div>
  );
};

export default JiraWaitingCI;
