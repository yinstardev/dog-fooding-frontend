import React, { useEffect, useState } from 'react';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { fetchUserAndToken } from '@app/api/getUserAndToken';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();
  const [emailName, setEmailName] = useState<string>('');
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const getUserEmail = async () => {
      const userData = await fetchUserAndToken();
      let emailPart = userData.email.split('@')[0];

      emailPart = emailPart
        .split('.')
        .map((part: any) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      setEmailName(emailPart);
    };

    getUserEmail();
  }, []);

  return emailName && user ? (
    <BasePopover trigger="click">
      <S.ProfileDropdownHeader as={BaseRow} gutter={[10, 10]} align="middle">
        {/* <BaseCol>
          <BaseAvatar src={user.imgUrl} alt="User" shape="circle" size={40} />
        </BaseCol> */}
        {isTablet && (
          <BaseCol>
            <span>{`${emailName}`}</span> {/* Use emailName here */}
          </BaseCol>
        )}
      </S.ProfileDropdownHeader>
    </BasePopover>
  ) : null;
};
