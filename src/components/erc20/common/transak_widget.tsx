
import React, { useEffect } from 'react';

/**
 * @see https://cleverbeagle.com/blog/articles/tutorial-how-to-load-third-party-scripts-dynamically-in-javascript
 */
const loadScript = (callback: any) => {
    const existingScript = document.getElementById('transak');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://global.transak.com/sdk/v1.1/widget.js';
        script.id = 'transak';
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) {
                callback();
            }
        };
    }

    if (existingScript && callback) {
        callback();
    }
};

interface Props {
    enable?: string;
    tokenSymbol?: string;
    walletAddress?: string;
    onClose?: any;

  /*  tokenAddress: string;
    walletAddress: string;*/
}

declare var TransakSDK: any;

export const TransakWidget = (props: Props) => {

    const launchTransak = async () => {
        const transak = new TransakSDK.default({
            apiKey: '30bec7d3-ec08-48ff-87db-486cb5744cf5', // Your API Key
            environment: 'STAGING', // STAGING/PRODUCTION
            defaultCryptoCurrency: props.tokenSymbol || 'ETH',
            walletAddress: props.walletAddress || '',
            themeColor: '#02112c', // App theme color in hex
            fiatCurrency: '', // INR/GBP
            redirectURL: '',
            hostURL: window.location.origin,
            widgetHeight: '650px',
            widgetWidth: '100%',
            hideMenu: true,
          });

        transak.init();

        transak
          .on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (data: any) => {
              props.onClose();
            // console.log(data)
          });

    };

    useEffect(() => {
        loadScript(() => {
            launchTransak();
        });
    }, []);

  /*  useEffect(() => {
       if(isScriptReady && enable){
           launchTransak();
       }
    }, [enable, isScriptReady]);*/

    return (
            <>
            </>
        );
};
