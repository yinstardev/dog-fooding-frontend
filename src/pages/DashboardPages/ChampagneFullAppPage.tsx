import React, { useEffect } from 'react';
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
import { AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';

import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import Base from 'antd/lib/typography/Base';

import './dashboard.css';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';

export const ChampagneFullAppPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const theme = useAppSelector((state) => state.theme.theme);

  const ref = useEmbedRef();

  useEffect(() => {
    const time = setTimeout(() => {
      ref.current?.syncPreRenderStyle();
    }, 1000);

    return () => {
      clearTimeout(time);
    };
  }, []);

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <DashboardCard title="Champagne">
          <BaseCol xl={24} lg={24}>
            <TseWrapper>
              <AppEmbed
                showPrimaryNavbar={true}
                ref={ref as any}
                className="champagne-full-app-embed"
                preRenderId="champagne-full-app-embed"
                customizations={{
                  style: {
                    customCSS: {
                      variables: {
                        '--ts-var-application-color': themeObject[theme].background,
                        '--ts-var-root-background': themeObject[theme].background,
                        '--ts-var-nav-background': themeObject[theme].siderBackground,
                        '--ts-var-root-color': themeObject[theme].textMain,
                      },
                      rules_UNSTABLE: {
                        '.bk-powered-footer': {
                          display: 'none',
                        },
                        '.home-container-module__homepageCarouselContainer': {
                          'background-color': themeObject[theme].siderBackground,
                          color: themeObject[theme].textSiderPrimary,
                        },
                        '.home-trending-module__rightPanelWrapper': {
                          'background-color': themeObject[theme].siderBackground,
                          color: themeObject[theme].textSiderPrimary,
                        },
                        '.bk-powered-by-ts-ribbon': {
                          'background-color': themeObject[theme].siderBackground,
                          color: themeObject[theme].textSiderPrimary,
                        },
                        '.bk-column-title-text': {
                          color: themeObject[theme].textSiderPrimary,
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
      <PageTitle>{t('common.medical-dashboard')}</PageTitle>
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};
