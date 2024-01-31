import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

import { useResponsive } from '@app/hooks/useResponsive';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import {
  Action,
  HostEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
  useEmbedRef,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';

import './dashboard.css';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select } from 'antd';
import axios from 'axios';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import Base from 'antd/lib/typography/Base';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { Btn } from '@app/components/header/components/HeaderSearch/HeaderSearch.styles';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import JiraIssueModal from '@app/components/common/Modal/JiraIssueModal';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { getFilterAndTabs, saveFilterAndTabs } from '@app/api/db.api';
import { OperationType } from '@thoughtspot/visual-embed-sdk/lib/src/utils/graphql/answerService/answerService';
import { SuperSelect } from './support-central/SuperSelect';
import { Tab } from './support-central/types';
// import CardHeader from './support-central/CardHeader';
import fetchAndTransformTabs from '@app/api/getTabs';

const staticTabOptions: Tab[] = [
  { name: 'Goals', id: 'f897c5de-ee38-46e0-9734-d9ed5d4ecc83' },
  { name: 'Cases', id: 'c82cdade-51f8-492e-93ab-9181155bd9aa' },
  { name: 'Customer Case History', id: '8ad26876-752e-4d0d-a763-f4aa98323b6f' },
  { name: 'Clusters', id: '257da5ab-2678-435e-9bfb-711e413502da' },
  { name: 'Red Accounts', id: 'bf1d15f4-3690-4b37-8cd1-5f0967cf588c' },
  { name: 'Yellow Accounts', id: 'd1a7e93b-21a7-419c-8834-e1760ec1659a' },
  { name: 'NPS', id: 'b08310de-a581-401b-bed1-b0416a6e1b58' },
  { name: 'SRE View', id: '0d953678-adf9-4c90-baf1-e861d13cb9e6' },
  { name: 'Production Engineering View', id: 'd09ac3fb-00d9-4007-a614-c546183c19a0' },
  { name: 'Engineering View', id: '693df25f-69e3-4c32-9015-9b81c1785736' },
  { name: 'Patch Status', id: '6991021a-c267-4454-8056-989e48d7ced8' },
];

export const SupportCentralLiveboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const theme = useAppSelector((state) => state.theme.theme);

  const embedRef = useEmbedRef();

  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [jiraIssueId, setJiraIssueId] = useState('');
  const [jiraIssueData, setJiraIssueData] = useState(null);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [tabOptions, setTabOptions] = useState<Tab[] | undefined>(undefined);
  const [selectedTabIds, setSelectedTabIds] = useState<string[]>([]);
  const [selectedTabs, setSelectedTabs] = useState<Tab[]>([]);

  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [caseNumbers, setCaseNumbers] = useState<string[]>([]);

  const [editAccountNames, setEditAccountNames] = useState<string[]>([]);
  const [editCaseNumbers, setEditCaseNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiltersAndTabs = async () => {
      const { filters, tabs } = await getFilterAndTabs();
      setAccountNames(filters.accountNames);
      setCaseNumbers(filters.caseNumbers);
      setSelectedTabs(tabs);

      setEditAccountNames(filters.accountNames);
      setEditCaseNumbers(filters.caseNumbers);

      console.log('Edit Account Names:', filters.accountNames);
      console.log('Edit Case Numbers:', filters.caseNumbers);
    };
    fetchFiltersAndTabs();

    // const getTabs = async () => {
    //   const fetchedTabs = await fetchAndTransformTabs();
    //   console.log(fetchedTabs, 'Fetched Tabs : *** !! ***');
    //   await setTabOptions(fetchedTabs);
    // };

    // getTabs();

    const fetchData = async () => {
        try {
            const fetchedTabs = await fetchAndTransformTabs();
            if (fetchedTabs) {
                setTabOptions(fetchedTabs);
            }
        } catch (error) {
            console.error('Error fetching tabs:', error);
        }
    };

  fetchData();

    // const handleLiveboardReady = () => {

    //   const updateTabOptions = (tabs: Tab[]) => {
    //     setTabOptions(tabs);
    //   };

    //   if (embedRef.current) {
    //     embedRef.current?.trigger(HostEvent.GetTabs).then(data => {
    //       console.log("Tabs data:", data);
    //       const extractedTabs: Tab[] = data.Tabs.map((tab: any) => {
    //         return {
    //           id: tab.id,
    //           name: tab.name
    //         };
    //       });
    //       updateTabOptions(extractedTabs);
    //     }).catch(error => {
    //       console.error("Error fetching tabs:", error);
    //     });
    //   }
    // };

    // if (embedRef.current) {
    // handleLiveboardReady();
    // console.log("Embed Current")

    // } else {
    //   const liveboard = document.querySelector('.support-central-liveboard-embed');
    //   if (liveboard) {
    //     liveboard.addEventListener('load', handleLiveboardReady);
    //   }
    // }
    // return () => {
    //   const liveboard = document.querySelector('.support-central-liveboard-embed');
    //   if (liveboard) {
    //     liveboard.removeEventListener('load', handleLiveboardReady);
    //   }
    // };
  }, []);

  const updateTabsAndFiltersInDatabase = async (
    updatedTabs: Tab[],
    updatedAccountNames: string[],
    updatedCaseNumbers: string[],
  ) => {
    try {
      await saveFilterAndTabs({ accountNames: updatedAccountNames, caseNumbers: updatedCaseNumbers }, updatedTabs);
      console.log('Tabs and filters updated in database.');
    } catch (error) {
      console.error('Error updating tabs and filters in database:', error);
    }
  };

  const handleTabChange = (selectedTabIds: string[]) => {
    const updatedTabs = tabOptions?.filter((tab) => selectedTabIds.includes(tab.id)) || [];
    setSelectedTabs(updatedTabs);
    updateTabsAndFiltersInDatabase(updatedTabs, accountNames, caseNumbers);
  };
  const handleJiraIssueIdChange = (event: any) => {
    setJiraIssueId(event.target.value);
  };
  const fetchJiraIssueData = async () => {
    try {
      const response = await axios.get(`/jira-issue/${jiraIssueId}`);
      if (response.data) {
        setJiraIssueData(response.data);
        setIsJiraModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching JIRA issue:', error);
    }
  };
  const tabIdsForVisibleTabs = selectedTabs.length > 0 ? selectedTabs.map((tab) => tab.id) : undefined;

  const CardHeader = () => {
    return (
      <BaseRow>
        <BaseCol lg={4}>Support Central</BaseCol>
        <BaseCol>
          <div className="search-container">
            <Btn icon={<FilterIcon />} onClick={() => setIsBasicModalOpen(!isBasicModalOpen)} size="small" />
            <Select
              mode="multiple"
              allowClear
              style={{ minWidth: '50px' }}
              placeholder="Select tabs"
              onChange={handleTabChange}
              value={selectedTabs.map((tab) => tab.id)}
              className="custom-multi-select"
            >
              {tabOptions?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          {isJiraModalOpen && <JiraIssueModal issueData={jiraIssueData} onClose={() => setIsJiraModalOpen(false)} />}
        </BaseCol>
      </BaseRow>
    );
  };
  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <DashboardCard
          title={
            <CardHeader />
          }
        >
          <BaseModal
            title={'Filter'}
            open={isBasicModalOpen}
            onOk={() => {
              setAccountNames(editAccountNames);
              setCaseNumbers(editCaseNumbers);
              setIsBasicModalOpen(false);
              updateTabsAndFiltersInDatabase(selectedTabs, editAccountNames, editCaseNumbers);
              if (embedRef.current) {
                if (editAccountNames.length == 0 && editCaseNumbers.length > 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Case Number',
                      operator: RuntimeFilterOp.EQ,
                      values: editCaseNumbers,
                    },
                  ]);
                } else if (editAccountNames.length > 0 && editCaseNumbers.length == 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Account Name',
                      operator: RuntimeFilterOp.EQ,
                      values: editAccountNames,
                    },
                  ]);
                } else if (editAccountNames.length > 0 && editCaseNumbers.length > 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Case Number',
                      operator: RuntimeFilterOp.EQ,
                      values: editCaseNumbers,
                    },
                    {
                      columnName: 'Account Name',
                      operator: RuntimeFilterOp.EQ,
                      values: editAccountNames,
                    },
                  ]);
                } else {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, []);
                }
              }
            }}
            onCancel={() => setIsBasicModalOpen(false)}
          >
            <BaseForm>
              <SuperSelect
                columnName="Account Name"
                defaultValues={editAccountNames}
                updateValues={setEditAccountNames}
              />
              <SuperSelect columnName="Case Number" defaultValues={editCaseNumbers} updateValues={setEditCaseNumbers} />
            </BaseForm>
          </BaseModal>

          <BaseCol xl={24} lg={24}>
            <TseWrapper>
              <LiveboardEmbed
                ref={embedRef as any}
                className="support-central-liveboard-embed"
                liveboardId="1d8000d8-6225-4202-b56c-786fd73f95ad"
                hiddenActions={[
                  Action.AddToFavorites,
                  Action.Edit,
                  Action.SyncToOtherApps,
                  Action.SyncToSheets,
                  Action.ManagePipelines,
                ]}
                disabledActions={[
                  Action.DownloadAsPdf,
                  Action.ExportTML,
                  Action.Share,
                  Action.RenameModalTitleDescription,
                  Action.SpotIQAnalyze,
                ]}
                runtimeFilters={[
                  { columnName: 'Account Name', operator: RuntimeFilterOp.EQ, values: accountNames },
                  { columnName: 'Case Number', operator: RuntimeFilterOp.EQ, values: caseNumbers },
                ]}
                visibleTabs={tabIdsForVisibleTabs}
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
          </BaseCol>
        </DashboardCard>
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.support-central')}</PageTitle>
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};
