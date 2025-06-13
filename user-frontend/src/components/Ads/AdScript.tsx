import { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
    const globalScriptId = 'profitablerate-global-script';

    // Inject the global ad script (only once)
    if (!document.getElementById(globalScriptId)) {
      const globalScript = document.createElement('script');
      globalScript.src = '//pl26898592.profitableratecpm.com/dd/45/70/dd4570f10c3909a60545b6d702f75d39.js';
      globalScript.type = 'text/javascript';
      globalScript.async = true;
      globalScript.id = globalScriptId;
      document.body.appendChild(globalScript);
    }

    // Inject the native invoke ad
    const containerId = 'container-554b1f56f294bf75beeef98599be9619';
    const container = document.getElementById(containerId);

    if (container) {
      container.innerHTML = ''; // Clear on re-render

      const invokeScript = document.createElement('script');
      invokeScript.src = '//pl26898601.profitableratecpm.com/554b1f56f294bf75beeef98599be9619/invoke.js';
      invokeScript.async = true;
      invokeScript.setAttribute('data-cfasync', 'false');

      container.appendChild(invokeScript);
    }

    // Optional cleanup: remove only the global ad script
    return () => {
      const script = document.getElementById(globalScriptId);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 my-6 px-4">
      {/* Global script effect zone (ad may be injected anywhere) */}
      <div id="ad-slot" className="w-full" />

      {/* Fixed-size invoke ad (ad injected directly here) */}
      <div
        id="container-554b1f56f294bf75beeef98599be9619"
        className="w-full max-w-[700px] h-[100px] bg-gray-800 rounded-lg flex items-center justify-center"
      >
        {/* fallback loader text (optional) */}
        <span className="text-gray-400 text-sm">Ad loading...</span>
      </div>
    </div>
  );
};

export default AdScript;
