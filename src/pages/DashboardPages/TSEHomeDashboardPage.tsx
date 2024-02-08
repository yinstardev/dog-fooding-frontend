import React, { useRef, useState } from 'react';
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
import './dashboard.css'
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
import Modal from '@app/components/Modal';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { Error } from '@app/components/Error/Error';


interface IssueDetail {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
    priority: {
      name: string;
    };
    description: {
      // Assuming the description follows a consistent format, adjust accordingly
      content: Array<{
        content: Array<{
          text: string;
        }>;
      }>;
    };
  };
}

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const [ issueId, setIssueId ] = useState('');
  const [issueDetails, setIssueDetails] = useState<IssueDetail | null>(null);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [showError, setShowError] = useState(false);


  const fetchJiraIssueDetails = async (jiraIssueId: string) => {
    if (!jiraIssueId.trim()) {
      setShowError(true);
      setIssueDetails(null);
      setIsModalOpen(false);
      return;
    }

    setShowError(false);
  
    try {
      const apiResponse = await axios.get(`${process.env.REACT_APP_BE_URL}/jira/issue/${jiraIssueId}`);
      setIssueDetails(apiResponse.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setIsModalOpen(false);
    }
  };



// Placeholder values - replace these with actual data
const instanceUrl = 'https://fun-energy-8120.lightning.force.com';
const accessToken = 'mjqoKEKTyM33LmZImc0K4KyyH'; // Securely obtain this through proper OAuth flows in a real application
const apiVersion = 'v52.0'; // Example: Winter '21 release is v50.0. Adjust according to your Salesforce environment

const createCase = async () => {
      try {
        const response = await axios.post(
          `${instanceUrl}/services/data/${apiVersion}/sobjects/Case/`,
          {
            Subject: 'API Created Case',
            Status: 'New',
            Origin: 'Web',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Case created successfully:', response.data);
      } catch (error) {
        console.error('Error creating case:', error);
      }
    };
  

  const { t } = useTranslation();

  const theme = useAppSelector((state) => state.theme.theme);

  const desktopLayout = (
      <BaseRow className='TSEHomeRow'>
    <S.Div>
      <BaseRow gutter={[30, 30]}>
        <BaseCol span={24}>
          <BaseRow gutter={[30, 30]}>
            <StatisticsCards />
          </BaseRow>
          {/* Input and Button Container */}
          
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
          <S.FormContainer>
          {showError && <S.ErrorMessage>Please enter an Issue ID to search.</S.ErrorMessage>}
            <S.InputButtonContainer>
              <S.StyledInput
                value={issueId}
                onChange={(e) => {setIssueId(e.target.value);setShowError(false)}}
                placeholder="Enter Issue ID"
              />
              <S.StyledButton
                onClick={() => {
                  if (!issueId.trim()) {
                    setShowError(true);
                    return;
                  }
                  fetchJiraIssueDetails(issueId);
                  setIssueId('');
                }}>
                Search Issue
              </S.StyledButton>
            </S.InputButtonContainer>
            </S.FormContainer>
            <BaseModal
              title="Jira Issue Details"
              open={isModalOpen}
              onOk={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            >
              {issueDetails ? (
                <div className="modalContent">
                  <div className="modalHeading">{issueDetails.fields.summary || 'No Summary Available'}</div>
                  <div className="modalSection">
                    <div className="modalSubheading"><i className="statusIcon"></i>Status:</div>
                    <div className="modalText">{issueDetails.fields.status?.name || 'Status Unknown'}</div>
                  </div>
                  <div className="modalSection">
                    <div className="modalSubheading"><i className="assigneeIcon"></i>Assignee:</div>
                    <div className="modalText">{issueDetails.fields.assignee?.displayName || 'Unassigned'}</div>
                  </div>
                  <div className="modalSection">
                    <div className="modalSubheading"><i className="priorityIcon"></i>Priority:</div>
                    <div className="modalText">{issueDetails.fields.priority?.name || 'Priority Unspecified'}</div>
                  </div>
                  <div className="modalSection">
                    <div className="modalSubheading"><i className="descriptionIcon"></i>Description:</div>
                    <div className="modalText">
                      {issueDetails.fields.description?.content?.[0]?.content?.[0]?.text || 'No Description Provided'}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No issue details available.</p>
              )}
            </BaseModal>
          </div>
          <S.StyledButton
                onClick={() => createCase()}>
                Create Case SFDC
              </S.StyledButton>
        </BaseCol>
      </BaseRow>
    </S.Div>
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


