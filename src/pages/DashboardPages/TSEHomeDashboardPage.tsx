import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { LiveboardEmbed, useEmbedRef, RuntimeFilterOp, HostEvent } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { SuperSelect } from './support-central/SuperSelect';
import { searchData } from './support-central/searchData';
import { useNavigate } from 'react-router-dom';

type RuntimeFilter = {
  columnName: string;
  operator: RuntimeFilterOp;
  values: string[];
};

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const embedRef = useEmbedRef();
  const navigate = useNavigate();

  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
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
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, []);
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
        navigate('/detailed-view-sfdc');
      }
    },
    [navigate],
  );

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
            className="support-central-liveboard-embed"
            liveboardId={liveboardId}
            runtimeFilters={runtimeFilters}
            onCustomAction={handleCustomAction}
            // preRenderId='homepage-view'
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
    <>
      <PageTitle>{t('common.home')}</PageTitle>
      {desktopLayout}
    </>
  );
};

export default TSEHomeDashboardPage;
