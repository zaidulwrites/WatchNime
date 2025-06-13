import { useLayoutEffect } from 'react';

const AdScript = () => {
  useLayoutEffect(() => {
    // Wait until DOM is fully ready
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
        container.innerHTML = ''; // Clean previous
        const invokeScript = document.createElement('script');
        invokeScript.src = '//pl26898601.profitableratecpm.com/554b1f56f294bf75beeef98599be9619/invoke.js';
        invokeScript.async = true;
        invokeScript.setAttribute('data-cfasync', 'false');
        container.appendChild(invokeScript);
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="my-6 w-full flex justify-center items-center flex-col gap-6">
      <div id="container-554b1f56f294bf75beeef98599be9619" className="w-full max-w-[700px]" />
    </div>
  );
};

export default AdScript;
