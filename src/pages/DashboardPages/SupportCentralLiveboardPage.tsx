import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

import { useResponsive } from '@app/hooks/useResponsive';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Action, HostEvent, LiveboardEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';

import './dashboard.css';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select } from 'antd';
import axios from 'axios';
import { getFullAccessToken } from '@app/utils/tse.utils';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import Base from 'antd/lib/typography/Base';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { Btn } from '@app/components/header/components/HeaderSearch/HeaderSearch.styles';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import JiraIssueModal from '@app/components/common/Modal/JiraIssueModal';

function SuperSelect({
  columnName,
  defaultValues,
  updateValues,
}: {
  columnName: string;
  defaultValues?: string[];
  updateValues?: (values: string[]) => void;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues || []);
  const { t } = useTranslation();

  const updateOptions = (data: string[]) => {
    const allValues = [...new Set([...data, ...options])];
    setOptions(allValues);
  };
  const handleDeselect = (deselectedValue: any) => {
    const newValues = selectedValues.filter((value) => value !== deselectedValue);
    setSelectedValues(newValues);
    updateValues?.(newValues);
  };

  useEffect(() => {
    setSelectedValues(defaultValues || []);
    searchData({ query: '', columnName }).then(([data]) => updateOptions(data));
  }, [defaultValues, columnName]);

  return (
    <BaseButtonsForm.Item
      name={columnName}
      label={columnName}
      rules={[{ required: false, message: t('forms.validationFormLabels.colorError'), type: 'array' }]}
    >
      <Select
        mode="multiple"
        options={options.map((e) => ({ value: e, label: e }))}
        onSearch={async (query) => {
          if (isLoading) return;
          setIsLoading(true);
          try {
            const [values, error] = await searchData({ query, columnName });
            if (!values || error) {
              console.error(error);
              setIsLoading(false);
              return;
            }
            updateOptions(values);
          } catch (e) {
            console.error(e);
          }
          setIsLoading(false);
        }}
        onSelect={(e: any) => {
          const newValues = [...selectedValues, e];
          updateValues?.(newValues);
          setSelectedValues(newValues);
        }}
        onDeselect={handleDeselect}
        value={selectedValues}
        loading={isLoading}
      />
    </BaseButtonsForm.Item>
  );
}

export const SupportCentralLiveboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const showTabs = [
    '765995db-647c-410f-993f-85db418bf827',
    '2887b9c7-1c9c-4b74-86f4-c89e5be8d8ca',
    'fc99351e-a1ca-4713-b5c6-09440d47ab5c',
    'e58d337e-ee71-45ad-9688-f80484779dc6',
    '48b86b67-7d62-4e86-86b7-707636f53d8f',
    '06966713-b410-4fc6-a4ce-0f57b088af37',
    '286d3100-33f9-49c5-87bc-3f21fb2b6569',
    'd82cbce4-5705-45c3-b3fe-ff86a785b5de',
    'c1aa1d4c-ad47-4263-9acc-234bc0b67b12',
    'c3cf356c-cbae-4d47-9536-e2ee559617ec',
    '1e38bc17-66dc-4930-b2b2-8510a5c674d2',
  ];

  const theme = useAppSelector((state) => state.theme.theme);

  const embedRef = useEmbedRef();

  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [jiraIssueId, setJiraIssueId] = useState('');
  const [jiraIssueData, setJiraIssueData] = useState(null);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);

  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [caseNumbers, setCaseNumbers] = useState<string[]>([]);

  const [editAccountNames, setEditAccountNames] = useState<string[]>([]);
  const [editCaseNumbers, setEditCaseNumbers] = useState<string[]>([]);

  const handleJiraIssueIdChange = (event: any) => {
    setJiraIssueId(event.target.value);
  };
  const fetchJiraIssueData = async () => {
    const jiraBaseUrl = process.env.REACT_APP_JIRA_BASE_URL;
    const jiraToken = btoa(`${process.env.REACT_APP_JIRA_USERNAME}:${process.env.REACT_APP_JIRA_API_TOKEN}`);
  
    try {
      const response = await axios.get(
        `${jiraBaseUrl}/rest/api/3/issue/${jiraIssueId}`,
        {
          headers: {
            'Authorization': `Basic ${jiraToken}`,
            'Accept': 'application/json'
          }
        }
      );
  
      if (response.data) {
        setJiraIssueData(response.data);
        setIsJiraModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching JIRA issue:', error);
    }
  };

  const CardHeader = () => {
    return (
      <BaseRow>
        <BaseCol lg={4}>Support Central</BaseCol>
        <BaseCol>
          <Btn icon={<FilterIcon />} onClick={() => setIsBasicModalOpen(!isBasicModalOpen)} size="small" />
        </BaseCol>
      </BaseRow>
    );
  };

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <DashboardCard title={<CardHeader />}>
          <BaseModal
            title={'Filter'}
            open={isBasicModalOpen}
            onOk={() => {
              setAccountNames(editAccountNames);
              setCaseNumbers(editCaseNumbers);
              setIsBasicModalOpen(false);
              if (embedRef.current) {
                if (editAccountNames.length == 0 && editCaseNumbers.length > 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Case Number',
                      operator: 'EQ',
                      values: editCaseNumbers,
                    },
                  ]);
                } else if (editAccountNames.length > 0 && editCaseNumbers.length == 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Account Name',
                      operator: 'EQ',
                      values: editAccountNames,
                    },
                  ]);
                } else if (editAccountNames.length > 0 && editCaseNumbers.length > 0) {
                  embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
                    {
                      columnName: 'Case Number',
                      operator: 'EQ',
                      values: editCaseNumbers,
                    },
                    {
                      columnName: 'Account Name',
                      operator: 'EQ',
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
                liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
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
                visibleTabs={showTabs}
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
      <div>
        <input
          type="text"
          value={jiraIssueId}
          onChange={(e) => setJiraIssueId(e.target.value)}
          placeholder="Enter JIRA Issue ID"
        />
        <button onClick={fetchJiraIssueData}>Fetch JIRA Issue</button>
      </div>
      {isJiraModalOpen && (
        <JiraIssueModal
          issueData={jiraIssueData}
          onClose={() => setIsJiraModalOpen(false)}
        />
      )}
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};

interface SearchDataParam {
  query: string;
  columnName: string;
}

const cachedData: { [key: string]: { data: string[] } } = {};

async function searchData({ query, columnName }: SearchDataParam): Promise<[string[], any]> {
  let result: string[] = [];
  let error = null;

  if (cachedData[columnName + query]?.data !== undefined) {
    return [cachedData[columnName + query].data, error];
  }

  const url = 'https://champagne.thoughtspotstaging.cloud/api/rest/2.0/searchdata';

  const { token } = await fetchUserAndToken();

  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const data = {
    query_string: `[${columnName}] CONTAINS '${query}'`,
    logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f',
    data_format: 'COMPACT',
    record_offset: 0,
    record_size: 500,
  };

  const defaultData = {
    query_string: `[${columnName}]`,
    logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f',
    data_format: 'COMPACT',
    record_offset: 0,
    record_size: 500,
  };

  try {
    let response;
    if (query.length > 0) {
      response = await axios.post(url, data, { headers });
    } else {
      response = await axios.post(url, defaultData, { headers });
    }
    result = response.data.contents[0].data_rows.map((e: any) => e[0]);

    cachedData[columnName + query] = {
      data: result,
    };
  } catch (e) {
    error = e;
  }

  return [result, error];
}
