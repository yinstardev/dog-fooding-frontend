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
`

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
    background-color: darken(#007bff, 10%); // Slightly darken the button on hover, you might need a CSS preprocessor or a function to handle this in JS
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