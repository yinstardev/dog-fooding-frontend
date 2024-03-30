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
import { ThemeType } from '@app/interfaces/interfaces';

type RuntimeFilter = {
  columnName: string;
  operator: RuntimeFilterOp;
  values: string[];
};

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const theme: ThemeType = useAppSelector((state) => state.theme.theme);
  const embedRef = useEmbedRef();
  const navigate = useNavigate();

  const liveboardId = '72699018-683d-4b42-b599-1ba304beb281';
  const [runtimeFilters, setRuntimeFilters] = useState<RuntimeFilter[]>([]);
  const [editAccountOwnerName, setEditAccountOwnerName] = useState<string[]>([]);
  const [accountOwnerNameList, setAccountOwnerNameList] = useState<string[]>([]);
  const [filterByName, setFilterByName] = useState<string>('');

  const case_owner_name = 'Case Owner Name';

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const { email } = await fetchUserAndToken();
        const emailNamePart = email.split('@')[0];
        const formattedName = emailNamePart.split('.').join(' ');
        setFilterByName('azimuddin mohammed');
      } catch (error) {
        console.error('Error setting data:', error);
      }
    };

    fetchAndSetData();
  }, []);

  const handleCustomAction = useCallback(
    (payload: any) => {
      if (payload.data.id == 'sfdc-detailed-view') {
        window.location.href = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
        navigate('/detailed-view-sfdc');
      }
    },
    [navigate, runtimeFilters],
  );
  const handleVizDoubleClick = (data: any) => {
    const viz_id = data.data.vizId;
    setCookie('selectedUsers', JSON.stringify(editAccountOwnerName), 7);

    let priority = '';
    switch (viz_id) {
      case '3f0d5713-75cc-4126-87af-a2a0794a1118':
        priority = 'MP0';
        break;
      case '3099d805-fe1c-4f6d-9ede-2c748a4b8d3c':
        priority = 'MP1';
        break;
      case '1bc3873f-9c02-4dfb-b1ba-5c2ccdeee716':
        priority = 'MP2';
        break;
      case '132a5c84-600e-4182-b8f7-6edb302d52e6':
        priority = 'MP3';
        break;
      case '2b259a42-9faf-4446-8aae-d77e790174d9':
        priority = 'P0';
        break;
      case 'ee46d717-3051-4402-bc62-b5cf8d1921f1':
        priority = 'P1';
        break;
      case 'adc0ce7b-f383-4eb0-893d-ce265c0e3747':
        priority = 'P2';
        break;
      case 'af185922-5648-4e26-94c2-826ff8dfab36':
        priority = 'P3';
        break;
      default:
        priority = '';
    }
    setCookie('PriorityDetailedView', priority, 7);
    const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
    window.location.href = authUrl;
    navigate('/details-view-sfdc');
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

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <TseWrapper>
          <LiveboardEmbed
            ref={embedRef}
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
            className="tse-homepage-style"
            liveboardId={liveboardId}
            runtimeFilters={[
              {
                columnName: case_owner_name,
                operator: RuntimeFilterOp.EQ,
                values: [filterByName],
              },
            ]}
            onCustomAction={handleCustomAction}
            preRenderId="tse-homepage"
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
    </BaseRow>
  );

  return (
    <div key={theme}>
      <PageTitle>{t('common.home')}</PageTitle>
      {desktopLayout}
    </div>
  );
};

export default TSEHomeDashboardPage;
