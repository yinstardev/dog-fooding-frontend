import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';

import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';

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
                        '--ts-var-application-color': themeObject[theme].tsEmbedAppColor,
                        '--ts-var-root-background': themeObject[theme].background,
                        '--ts-var-nav-background': themeObject[theme].tsEmbedNavBgColor,
                        '--ts-var-root-color': themeObject[theme].textDark,
                        '--ts-var-menu-color': themeObject[theme].textDark,
                        '--ts-var-search-data-button-background': themeObject[theme].textLight,
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
                          color: themeObject[theme].textDark,
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
      <PageTitle>{t('common.full-app-embed')}</PageTitle>
      {isDesktop ? desktopLayout : desktopLayout}
    </>
  );
};
