export interface Tab {
  id: string;
  name: string;
}

export interface FilterCriteria {
  accountNames: string[];
  caseNumbers: string[];
}

export interface SuperSelectProps {
  columnName: string;
  defaultValues?: string[];
  updateValues: (values: string[]) => void;
}

export interface CardHeaderProps {
  onFilterClick: () => void;
  selectedTabs: Tab[];
  handleTabChange: (selectedTabIds: string[]) => void;
  tabOptions: Tab[] | undefined;
  isBasicModalOpen: boolean;
  setIsBasicModalOpen: (isOpen: boolean) => void;
  isJiraModalOpen: boolean;
  setIsJiraModalOpen: (isOpen: boolean) => void;
  jiraIssueData: any;
}
