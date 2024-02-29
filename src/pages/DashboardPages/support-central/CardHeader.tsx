import React from 'react';
import { Select } from 'antd';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { CardHeaderProps } from './types';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Btn } from '@app/components/common/forms/components/BaseButtonsGroup/BaseButtonsGroup.styles';
import JiraIssueModal from '@app/components/common/Modal/JiraIssueModal';
import '../dashboard.css';

const CardHeader: React.FC<CardHeaderProps> = ({
  onFilterClick,
  selectedTabs,
  handleTabChange,
  tabOptions,
  isBasicModalOpen,
  setIsBasicModalOpen,
  isJiraModalOpen,
  setIsJiraModalOpen,
  jiraIssueData,
}) => {
  return (
    <BaseRow>
      <BaseCol lg={4}>Support Central</BaseCol>
      <BaseCol>
        <div className="search-container">
          <Btn icon={<FilterIcon />} onClick={() => setIsBasicModalOpen(!isBasicModalOpen)} size="small" />
          <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '50px' }}
            placeholder="Select tabs"
            onChange={handleTabChange}
            value={selectedTabs.map((tab) => tab.name)}
            className="custom-multi-select"
          >
            {tabOptions?.map((option) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        {isJiraModalOpen && <JiraIssueModal issueData={jiraIssueData} onClose={() => setIsJiraModalOpen(false)} />}
      </BaseCol>
    </BaseRow>
  );
};

export default CardHeader;
