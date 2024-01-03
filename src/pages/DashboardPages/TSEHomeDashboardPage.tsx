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
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TseStatisticsCards } from '@app/components/medical-dashboard/statisticsCards/TseStatisticsCards';
import { themeObject } from '@app/styles/themes/themeVariables';

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const theme = useAppSelector((state) => state.theme.theme);

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={14} xxl={17}>
        <BaseRow gutter={[30, 30]}>
          <BaseCol span={24}>
            <BaseRow gutter={[30, 30]}>
              <StatisticsCards />
            </BaseRow>
          </BaseCol>

          <BaseCol id="map" span={24}>
            <TseVizCard />
          </BaseCol>

          <BaseCol id="latest-screenings" span={24}>
            <TseLibTwo />
          </BaseCol>
        </BaseRow>
      </S.LeftSideCol>

      <S.RightSideCol xl={10} xxl={7}>
        <LiveboardEmbed
          liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
          visibleVizs={[
            '2db035d6-7a4f-4f13-a268-6e434aa8de07',
            '68abaa19-d461-45c7-84f2-fae78d559699',

            '5de21bc6-018d-47fc-99ff-000b8358723d',
          ]}
          activeTabId="48b86b67-7d62-4e86-86b7-707636f53d8f"
          className="tse-viz-three"
          hideLiveboardHeader={true}
          customizations={{
            style: {
              customCSS: {
                variables: {
                  '--ts-var-application-color': themeObject[theme].background,
                  '--ts-var-root-background': themeObject[theme].background,
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
      </S.RightSideCol>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow gutter={[20, 20]}>
      <StatisticsCards />

      <BaseCol id="map" md={24} order={4}>
        <TseVizCard />
      </BaseCol>

      <BaseCol id="latest-screenings" xs={24} md={12} order={(isTablet && 5) || 0}>
        <TseLibTwo />
      </BaseCol>

      <BaseCol id="activity" xs={24} md={12} order={(isTablet && 8) || 0}>
        <ActivityCard />
      </BaseCol>

      <BaseCol id="treatment-plan" xs={24} md={24} order={(isTablet && 10) || 0}>
        <TreatmentCard />
      </BaseCol>

      <BaseCol id="health" xs={24} md={12} order={(isTablet && 9) || 0}>
        <HealthCard />
      </BaseCol>

      <BaseCol id="patient-timeline" xs={24} md={12} order={(isTablet && 11) || 0}>
        <PatientResultsCard />
      </BaseCol>

      <BaseCol id="blood-screening" xs={24} md={12} order={(isTablet && 6) || 0}>
        <BloodScreeningCard />
      </BaseCol>

      <BaseCol id="favorite-doctors" xs={24} md={24} order={(isTablet && 13) || 0}>
        <FavoritesDoctorsCard />
      </BaseCol>

      <BaseCol id="covid" xs={24} md={12} order={(isTablet && 12) || 0}>
        <CovidCard />
      </BaseCol>

      <BaseCol id="news" xs={24} md={24} order={(isTablet && 14) || 0}>
        <NewsCard />
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.medical-dashboard')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default TSEHomeDashboardPage;
