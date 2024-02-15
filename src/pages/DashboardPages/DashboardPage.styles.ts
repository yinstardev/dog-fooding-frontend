import styled from 'styled-components';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const RightSideCol = styled(BaseCol)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${LAYOUT.desktop.headerHeight});
  background-color: var(--sider-background-color);
  overflow-y: auto;
`;

export const LeftSideCol = styled(BaseCol)`
  @media only screen and ${media.xl} {
    padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
    height: calc(100vh - ${LAYOUT.desktop.headerHeight});
    overflow: auto;
  }
`;

export const Space = styled.div`
  margin: 1rem 0;
`;

export const Div = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1 em;
  padding: 1em;
`;

export const ScrollWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 250px;

  .ant-card-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
`;

export const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 15px;

  background: black;

  min-height: 300px;
  overflow-y: auto;
`;

export const Item = styled.div`
  background: red;
  height: 150px;
  flex-shrink: 0;
`;

export const InputButtonContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 10px;
  margin-top: 0.1em;
`;

export const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  color: #333; // Improved for better visibility
  background-color: white; // Ensures input background contrasts well with text
`;

export const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: darken(
      #007bff,
      10%
    ); // Slightly darken the button on hover, you might need a CSS preprocessor or a function to handle this in JS
  }
`;

export const ErrorMessage = styled.div`
  color: red; // or any color that fits your design
  margin-bottom: 10px; // spacing before the input field
  text-align: left; // align to the start of the container
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
`;

export const SFDCList = styled.div`
  padding: 1em;
  color: black;
  width: 500px;
  height: 100vh;
  overflow-y: auto;
`;

export const ResultItem = styled.div`
  padding: 0.3em;
  &:hover {
    background-color: red; // Adds a hover effect for each item
  }
`;

export const SelectPriority = styled.select`
  &.ant-select-borderless {
    background: var(--secondary-background-color);
  }

  .ant-select-selection-placeholder {
    color: var(--text-main-color);
  }

  .ant-select-arrow {
    color: var(--text-main-color);
  }

  &.ant-select-multiple.ant-select-sm .ant-select-selection-item {
    height: 0.875rem;
    margin-top: 0.1875rem;
    margin-bottom: 0.1875rem;
  }

  &.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    color: var(--disabled-color);
  }

  .ant-select-clear {
    color: var(--disabled-color);
  }
  .ant-select-selection-item-remove {
    color: var(--icon-color);
    &:hover {
      color: var(--icon-hover-color);
    }
  }
  .ant-select-item-option-disabled {
    color: var(--disabled-color);
  }
`;
