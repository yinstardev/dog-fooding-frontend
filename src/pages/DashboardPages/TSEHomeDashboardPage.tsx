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
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';

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
          
{/* 
          <BaseCol id="map" span={24}>
            <TseVizCard />
          </BaseCol>

          <BaseCol id="latest-screenings" span={24}>
            <TseLibTwo />
          </BaseCol> */}
        </BaseRow>
      </S.LeftSideCol>

      {/* <S.RightSideCol xl={10} xxl={7}>
        
      </S.RightSideCol> */}
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.home')}</PageTitle>
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};

export default TSEHomeDashboardPage;
