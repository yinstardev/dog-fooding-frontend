import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const [jiraIssues, setJiraIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const theme = useAppSelector((state) => state.theme.theme);

  const be_url = process.env.REACT_APP_BE_URL;
  useEffect(() => {
    const fetchJiraIssuesForEmail = async () => {
      try {
        const userIdResponse = await axios.get(`${be_url}/jira/get-user-id`);
        console.log("Response Data:", userIdResponse.data);
        const userId = userIdResponse.data.accountId;
        console.log("Fetched userId:", userId);
        const issueId = 'SCAL-188514';
        const issurResponse = await axios.get(`${be_url}/jira/issue/${issueId}`);

        const jiraDomain = 'thoughtspot.atlassian.net';
        const globalAccessToken = 'ATATT3xFfGF0GXs2_wlApRzn6141kWvaLzDNEOAhdybu_y6NqFWyPw99Ac7oU4J5gEb23T81ak57SBPnJoR3VKoJ-htZpTUaoIk_5b-cbOM4kSVgPBax3Y6DgADYZ9kknifDQWtqG-XrawRQWRB-EQcxLUqJ_XJz9sMKJOmlnnTK7e_ssDbsq0k=D4D31199';
        const apiToken = Buffer.from(`prashant.patil@thoughtspot.com:ATATT3xFfGF0EBxCkhQSR4QSdbJHZRuF146FnqQhdkHLvTfGmEE86GW9ozblxWNhAguCMM0Sep6Y7tk9xJ0HdGc0f-XW5JkhqFxDiADRCBdqiR7i4NoiUeTs279QvDsGoyuJ58kaLWjdXsHL2Nc5z_KJUSkZ_ht5e3Jg5wsRDCG_DSAGQKsticU=5C182968`).toString('base64');

        const fetchAllIssues = async () => {
          const jiraApiUrl = `https://thoughtspot.atlassian.net/rest/api/3/search?jql=project=SCAL`;
          console.log("Inside fetch all userss ::: :::: ")
          try {
              const response = await axios.get(jiraApiUrl, {
                  headers: {
                      'Authorization': `Bearer ${globalAccessToken}`,
                      'Accept': 'application/json'
                  }
              });
              // Process response.data to get the list of issues
              console.log("Before displaying data")
              console.log(response, "frontend me response ka data");
          } catch (error) {
              console.error('Error fetching issues from JIRA:', error);
              // Handle error
          }
        };
        fetchAllIssues();
        console.log(issurResponse)
        if (userId) {
          console.log("Fetching issues for userId:", userId);
          const issuesResponse = await axios.get(`${be_url}/jira/user-issues/${userId}`);
          console.log("Issues response:", issuesResponse);
          setJiraIssues(issuesResponse.data.issues || []);
        } else {
          console.log("UserId is not available or undefined.");
        }
      } catch (error) {
        console.error('Error fetching Jira issues:', error);
      }
    };
  
    fetchJiraIssuesForEmail();
  }, [be_url]); // Added be_url as a dependency
  


  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol>
        <BaseRow gutter={[30, 30]}>
          <BaseCol span={24}>
            <BaseRow gutter={[30, 30]}>
              <StatisticsCards />
            </BaseRow>
          </BaseCol>
          {jiraIssues.map((issue: any) => (
            <div key={issue.id}>
              <h3>{issue.fields.summary}</h3>
              {/* Render other issue details as needed */}
            </div>
          ))}

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
