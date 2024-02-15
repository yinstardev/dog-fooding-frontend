import React, { useEffect, useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import axios from 'axios';

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
        content: Array<{
          content: Array<{
            text: string;
          }>;
        }>;
      };
    };
  }
  

interface JiraIssueDetailsModalProps {
    jiraIssueId: string;
    isOpen: boolean;
    onClose: () => void;
  }

const JiraIssueDetailsModal: React.FC<JiraIssueDetailsModalProps> = ({ jiraIssueId, isOpen, onClose }) => {
    const [issueDetails, setIssueDetails] = useState<IssueDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJiraIssueDetails = async () => {
    if (!jiraIssueId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}/jira/issue/${jiraIssueId}`);
      setIssueDetails(response.data);
    } catch (error) {
      console.error('Error fetching JIRA issue:', error);
      setError('Failed to fetch issue details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchJiraIssueDetails();
    }
  }, [isOpen]);

  return (
    <BaseModal
      title="Jira Issue Details"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : issueDetails ? (
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
  );
};

export default JiraIssueDetailsModal;