import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import {
    LiveboardEmbed,
    useEmbedRef,
    RuntimeFilterOp,
    HostEvent,
  } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';



const DetailedViewPage = () => {
    const navigate = useNavigate();
    const embedRef = useEmbedRef();
    const liveboardId = '4f737ba5-aebf-4fd0-9525-c4ebdd29a51b';
    const theme = useAppSelector((state) => state.theme.theme);



    const handleCustomAction = useCallback( (paylod: any) => {
        if(paylod.data.id=='sfdc-detailed-view'){
            console.log(paylod.data);
        }
    }, [])

    return <>
    <div>Hello there</div>
        <button onClick={()=> navigate(-1)}>Click ME !!!</button>
        <TseWrapper>
            <LiveboardEmbed
                ref={embedRef}
                className="sfdc-list"
                liveboardId={liveboardId}
                // runtimeFilters={runtimeFilters}
                onCustomAction={handleCustomAction}
                vizId='e5506a79-70f7-4cc7-b213-001759251858'
                // visibleVizs={['e5506a79-70f7-4cc7-b213-001759251858']}
                hideTabPanel={true}
                
                hideLiveboardHeader={true}
                // preRenderId='homepage-view'
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
    </>
}

export default DetailedViewPage;