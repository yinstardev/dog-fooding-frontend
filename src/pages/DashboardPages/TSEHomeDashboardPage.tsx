import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import {
  LiveboardEmbed,
  useEmbedRef,
  RuntimeFilterOp,
  HostEvent,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { SuperSelect } from './support-central/SuperSelect';
import { searchData } from './support-central/searchData';

type RuntimeFilter = {
  columnName: string;
  operator: RuntimeFilterOp;
  values: string[];
};

const TSEHomeDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const embedRef = useEmbedRef();

  const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b'; // Your liveboard ID
  const [runtimeFilters, setRuntimeFilters] = useState<RuntimeFilter[]>([]);
  const [editAccountOwnerName, setEditAccountOwnerName] = useState<string[]>([]);
  const [accountOwnerNameList, setAccountOwnerNameList] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const {email} = await fetchUserAndToken();
  //       if (email) {

  //         const emailNamePart = email.split('@')[0];
  //         const formattedName = emailNamePart.split('.').join(' ');
  //         console.log(formattedName, "this is the formatted user name");
  //         console.log(email, "this is the user email");
  //         // Assuming 'username' is the field you want to filter on in the liveboard
  //         // Adjust this to match the actual field name and value you need
  //         const filter = {
  //           columnName: 'Case Owner Name', // Adjust the column name based on your liveboard's setup
  //           operator: RuntimeFilterOp.EQ,
  //           values: ['azimuddin mohammed'], // Use the appropriate property from userData
  //         };
  //         setRuntimeFilters([filter]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //       // Handle error appropriately
  //     }
  //   };

  //   fetchUserData();
  //   const case_owner_name : string = 'Case Owner Name'

  //   searchData({ query: '', columnName: case_owner_name }).then(([data]) => {
  //     setAccountOwnerNameList(data);
  //     console.log("-------------*****************______------------------")
  //     console.log(data);
  //   });

  // }, []); // Dependency array is empty to fetch user data only once on component mount

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const { email } = await fetchUserAndToken();
        const emailNamePart = email.split('@')[0];
        const formattedName = emailNamePart.split('.').join(' ');
  
        const case_owner_name = 'Case Owner Name';
        const [data] = await searchData({ query: '', columnName: case_owner_name });
  
        setAccountOwnerNameList(data);
  
        // Wait for the embed to be initialized
        if(embedRef.current)
          {
            if (data.includes(formattedName)) {
              // If the user's name is in the list, apply it as a runtime filter
              embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [{
                columnName: case_owner_name,
                operator: RuntimeFilterOp.EQ,
                values: [formattedName],
              }]);
              setEditAccountOwnerName([formattedName]);
            } else {
              // If the user's name is not in the list, clear the runtime filters
              embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, []);
              setEditAccountOwnerName([]);
            }
          ;}
      } catch (error) {
        console.error('Error setting data:', error);
      }
    };
  
    fetchAndSetData();
  }, [embedRef]);
  
  const handleSuperSelectChange = (newValues: string[]) => {
    setEditAccountOwnerName(newValues);
  
    // Check if the embed is ready and then update the runtime filters
    if(embedRef.current)
    {
      embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
        {
          columnName: 'Case Owner Name', // Adjust as per your column name
          operator: RuntimeFilterOp.EQ,
          values: newValues,
        },
      ])
    }
  }

  const desktopLayout = (
    <BaseRow>
      <BaseCol xl={24} lg={24}>
        <div style={{maxWidth:'25em', marginLeft:'1em'}}>
          <SuperSelect
                    columnName="Case Owner Name"
                    defaultValues={editAccountOwnerName}
                    updateValues={handleSuperSelectChange}
                  />
        </div>
        <TseWrapper>
          <LiveboardEmbed
            ref={embedRef}
            className="support-central-liveboard-embed"
            liveboardId={liveboardId}
            runtimeFilters={runtimeFilters}
            
            customizations={{
              style: {
                customCSS: {
                  variables: {
                    '--ts-var-application-color': themeObject[theme].background,
                    '--ts-var-root-background': themeObject[theme].background,
                    '--ts-var-nav-background': themeObject[theme].siderBackground,
                  },
                  rules_UNSTABLE: {
                    'body > app-controller > blink-app-page > div > div > div > bk-powered-footer': {
                      display: 'none',
                    },
                  },
                },
              },
            }}
          />
        </TseWrapper>
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.home')}</PageTitle>
      {desktopLayout}
    </>
  );
};

export default TSEHomeDashboardPage;
