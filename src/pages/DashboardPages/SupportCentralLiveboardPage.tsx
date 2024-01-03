import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MapCard } from '@app/components/medical-dashboard/mapCard/MapCard';
import { ScreeningsCard } from '@app/components/medical-dashboard/screeningsCard/ScreeningsCard/ScreeningsCard';
import { ActivityCard } from '@app/components/medical-dashboard/activityCard/ActivityCard';
import { TreatmentCard } from '@app/components/medical-dashboard/treatmentCard/TreatmentCard';
import { CovidCard } from '@app/components/medical-dashboard/covidCard/CovidCard';
import { HealthCard } from '@app/components/medical-dashboard/HealthCard/HealthCard';
import { FavoritesDoctorsCard } from '@app/components/medical-dashboard/favoriteDoctors/FavoriteDoctorsCard/FavoritesDoctorsCard';
import { PatientResultsCard } from '@app/components/medical-dashboard/PatientResultsCard/PatientResultsCard';
import { StatisticsCards } from '@app/components/medical-dashboard/statisticsCards/StatisticsCards';
import { BloodScreeningCard } from '@app/components/medical-dashboard/bloodScreeningCard/BloodScreeningCard/BloodScreeningCard';
import { NewsCard } from '@app/components/medical-dashboard/NewsCard/NewsCard';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { TseVizCard } from '@app/components/tse-dashboard/home-page-liveboard-one';
import { TseLibTwo } from '@app/components/tse-dashboard/tse-lib-two/TseLibTwo';
import { Action, LiveboardEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TseStatisticsCards } from '@app/components/medical-dashboard/statisticsCards/TseStatisticsCards';
import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import Base from 'antd/lib/typography/Base';

import './dashboard.css';
import { themeObject } from '@app/styles/themes/themeVariables';

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

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <DashboardCard title="Support Central">
          <BaseCol xl={24} lg={24}>
            Filters
          </BaseCol>

          <BaseCol xl={24} lg={24}>
            <LiveboardEmbed
              ref={embedRef as any}
              className="support-central-liveboard-embed"
              liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
              hiddenActions={[Action.AddToFavorites, Action.Edit]}
              visibleTabs={showTabs}
              customizations={{
                style: {
                  customCSS: {
                    variables: {
                      '--ts-var-viz-background': themeObject[theme].background,
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
          </BaseCol>
        </DashboardCard>
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.medical-dashboard')}</PageTitle>
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};
