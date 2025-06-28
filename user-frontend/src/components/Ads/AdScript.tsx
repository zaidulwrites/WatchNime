import { useLayoutEffect } from 'react';

const AdScript = () => {
  useLayoutEffect(() => {
    // 1️⃣ Inject Popunder Script (once)
    const popunderId = 'profitablerate-popunder-script';
    if (!document.getElementById(popunderId)) {
      const popunderScript = document.createElement('script');
      popunderScript.src = '//pl26940269.profitableratecpm.com/69/37/4b/69374bfaeefabfba6bb51d7d87bf8601.js';
      popunderScript.type = 'text/javascript';
      popunderScript.async = true;
      popunderScript.id = popunderId;
      document.body.appendChild(popunderScript);
    }

    // 2️⃣ Delay to inject banner/display ad
    const timeout = setTimeout(() => {
      const globalScriptId = 'profitablerate-ad-script';
      if (!document.getElementById(globalScriptId)) {
        const globalScript = document.createElement('script');
        globalScript.src = '//pl26898592.profitableratecpm.com/dd/45/70/dd4570f10c3909a60545b6d702f75d39.js';
        globalScript.type = 'text/javascript';
        globalScript.async = true;
        globalScript.id = globalScriptId;
        document.body.appendChild(globalScript);
      }

      const container = document.getElementById('container-554b1f56f294bf75beeef98599be9619');
      if (container) {
        container.innerHTML = ''; // Clean previous content
        const invokeScript = document.createElement('script');
        invokeScript.src = '//pl26898601.profitableratecpm.com/554b1f56f294bf75beeef98599be9619/invoke.js';
        invokeScript.async = true;
        invokeScript.setAttribute('data-cfasync', 'false');
        container.appendChild(invokeScript);
      }
    }, 1000); // Delay 1 second to let DOM load

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Inline Ad Container */}
      <div className="my-6 w-full flex justify-center items-center flex-col gap-6">
        <div id="container-554b1f56f294bf75beeef98599be9619" className="w-full max-w-[700px]" />
      </div>

      {/* ✅ CoinPayu Fixed Banner */}
      <a
        href="https://www.coinpayu.com/?r=Person3"
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://www.coinpayu.com/static/earners_banner/320X50.gif"
          alt="coinpayu"
          title="Join coinpayu to earn!"
        />
      </a>
    </>
  );
};

export default AdScript;
