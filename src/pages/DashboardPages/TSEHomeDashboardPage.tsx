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

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const { email } = await fetchUserAndToken();
        const emailNamePart = email.split('@')[0];
        const formattedName = emailNamePart.split('.').join(' ');

        const case_owner_name = 'Case Owner Name';
        const [data] = await searchData({ query: '', columnName: case_owner_name });

        setAccountOwnerNameList(data);

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
              {
                columnName: case_owner_name,
                operator: RuntimeFilterOp.EQ,
                values: ['azimuddin mohammed'],
              },
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
    [navigate, runtimeFilters],
  );
  const handleVizDoubleClick = (data: any) => {
    // console.log(data);
    const allowedVizIds = ['2b259a42-9faf-4446-8aae-d77e790174d9', 'ee46d717-3051-4402-bc62-b5cf8d1921f1', 'adc0ce7b-f383-4eb0-893d-ce265c0e3747', 'af185922-5648-4e26-94c2-826ff8dfab36'];
    // console.log(data.data);
    // if(allowedVizIds.includes(data.data.vizId)){

    console.log(data.data.vizId);
    const viz_id = data.data.vizId;
    console.log('Viz Id : ', viz_id);
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
    const priority_console = getCookie('PriorityDetailedView');
    console.log(priority_console, 'Priority Console.');
    const authUrl = `${process.env.REACT_APP_BE_URL}/salesforce/oauth2/auth`;
    window.location.href = authUrl;
    navigate('/details-view-sfdc')

  // } else {
  //   console.log("Double click doesn't work here. No Action Assigned to this Viz");
  //   return;
  // }
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
        <div style={{ maxWidth: '25em', marginLeft: '1em' }}>
          <SuperSelect
            columnName="Case Owner Name"
            defaultValues={editAccountOwnerName}
            updateValues={handleSuperSelectChange}
          />
        </div>
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
            runtimeFilters={runtimeFilters}
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
