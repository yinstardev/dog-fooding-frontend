import React from "react";

type JiraIssueModalProps = {
    issueData: any;
    onClose: () => void;
  };
  
  const JiraIssueModal = ({ issueData, onClose }: JiraIssueModalProps) => {
    if (!issueData) return null;
  
    return (
      <div className="modal">
        <h2>JIRA Issue: {issueData.key}</h2>
        <p><strong>Summary:</strong> {issueData.fields.summary}</p>
        <p><strong>Status:</strong> {issueData.fields.status.name}</p>
        <p><strong>Assignee:</strong> {issueData.fields.assignee ? issueData.fields.assignee.displayName : 'Unassigned'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  
  export default JiraIssueModal;
  