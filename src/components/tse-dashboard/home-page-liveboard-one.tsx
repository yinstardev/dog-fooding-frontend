import React from 'react';
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DashboardCard } from '../medical-dashboard/DashboardCard/DashboardCard';
import { AuthType, init } from '@thoughtspot/visual-embed-sdk';
import './tse-styles.css';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from './TseWrapper';

init({
  thoughtSpotHost: 'https://champagne.thoughtspotstaging.cloud',
  authType: AuthType.None,
});

export const TseVizCard: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  console.log(theme);

  return (
    <DashboardCard padding={0}>
      <TseWrapper>
        <LiveboardEmbed
          liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
          vizId="60be9072-c1d4-49b1-9738-a70ca254ec00"
          className="tse-viz-one"
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
      </TseWrapper>
    </DashboardCard>
  );
};
