import React, { useEffect, useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import axios from 'axios';
import { Btn } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay.styles';

interface Mention {
  attrs: {
    text: string;
  };
}

interface ContentItem {
  mentions?: Mention[];
  text?: {
    text: string;
  };
}

interface ContentBlock {
  content: ContentItem[];
  type: string;
}

interface Comment {
  author: {
    displayName: string;
  };
  body: {
    content: ContentBlock[];
  };
  created: string;
}

interface IssueDetail {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: { displayName: string };
    priority: { name: string };
    description: { content: Array<{ content: Array<{ text: string }> }> };
    comment: {
      comments: Comment[];
    };
  };
}

function formatDate(isoDateString: any) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${dayOfWeek}, ${month} ${day}, ${year}, ${formattedHours}:${paddedMinutes} ${ampm}`;
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
  const [showComments, setShowComments] = useState(false);
  const [modalWidth, setModalWidth] = useState('30%');

  const jiraBaseUrl = 'https://thoughtspot.atlassian.net/browse/';
  const issueUrl = `${jiraBaseUrl}${jiraIssueId}`;

  const fetchJiraIssueDetails = async () => {
    if (!jiraIssueId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}/jira/issue/${jiraIssueId}`);
      console.log(response.data.fields.comment.comments);
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

  useEffect(() => {
    setModalWidth(showComments ? '60%' : '35%');
  }, [showComments]);

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  const renderContentItem = (item: any) => {
    if (item.type === 'text') {
      return <span>{item.text}</span>;
    } else if (item.type === 'mention') {
      return <strong>{item.attrs.text}</strong>;
    }
  };

  const renderContentBlock = (contentBlock: any) => {
    return contentBlock.content.map((item: any, index: any) => (
      <React.Fragment key={index}>{renderContentItem(item)} </React.Fragment>
    ));
  };

  const renderCommentBody = (body: any) => {
    return body.content.map((contentBlock: any, index: any) => (
      <p style={{ fontWeight: 'lighter', marginLeft: '0.5em' }} key={index}>
        {renderContentBlock(contentBlock)}
      </p>
    ));
  };

  return (
    <BaseModal
      className="basemodal"
      title="Jira Issue Details"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      width={modalWidth}
      style={{ overflow: 'hidden' }}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : issueDetails ? (
        <div
          className="modalContent"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            overflowY: 'scroll',
            maxHeight: '60vh',
            paddingRight: '0em',
          }}
        >
          <div style={{ flex: showComments ? 1 : 1, overflowY: 'scroll', paddingRight: '1.5em' }}>
            <div className="modalHeading">{issueDetails.fields.summary || 'No Summary Available'}</div>
            <div className="modalSection">
              <div className="modalSubheading">
                <i className="statusIcon"></i>Status:
              </div>
              <div className="modalText">{issueDetails.fields.status?.name || 'Status Unknown'}</div>
            </div>
            <div className="modalSection">
              <div className="modalSubheading">
                <i className="assigneeIcon"></i>Assignee:
              </div>
              <div className="modalText">{issueDetails.fields.assignee?.displayName || 'Unassigned'}</div>
            </div>
            <div className="modalSection">
              <div className="modalSubheading">
                <i className="priorityIcon"></i>Priority:
              </div>
              <div className="modalText">{issueDetails.fields.priority?.name || 'Priority Unspecified'}</div>
            </div>
            <div className="modalSection">
              <div className="modalSubheading">
                <i className="descriptionIcon"></i>Description:
              </div>
              <div className="modalText">
                {issueDetails.fields.description?.content?.[0]?.content?.[0]?.text || 'No Description Provided'}
              </div>
            </div>
            <div className="modalSection">
              <div className="modalSubSubheading">
                <i className="priorityIcon"></i>Go to Original Issue:
              </div>
              <div className="modalText">
                <Btn onClick={() => window.open(issueUrl, '_blank')} className="viewOnJiraButton">
                  Jira Issue
                </Btn>
              </div>
              <div className="modalText">
                <Btn onClick={toggleShowComments} style={{ marginTop: '0.8em' }}>
                  {showComments ? 'Hide Comments' : 'Show Comments'}
                </Btn>
              </div>
            </div>
          </div>

          {showComments && (
            <div
              className="modalSection"
              style={{
                flex: 1,
                overflow: 'auto',
                borderLeft: '1px solid #ccc',
                padding: '0 20px',
                marginLeft: '1em',
                maxHeight: '80vh',
              }}
            >
              <h3>Comments</h3>
              {issueDetails?.fields.comment?.comments?.length ? (
                issueDetails.fields.comment.comments.map((comment, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'normal' }}>
                      {comment.author.displayName} ({formatDate(comment.created)}):
                    </div>
                    {renderCommentBody(comment.body)}
                  </div>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No issue details available.</p>
      )}
    </BaseModal>
  );
};

export default JiraIssueDetailsModal;
