import { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
    const scriptId = 'profitablerate-ad-script';

    // Prevent multiple script injections
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.src = '//pl26898592.profitableratecpm.com/dd/45/70/dd4570f10c3909a60545b6d702f75d39.js';
    script.type = 'text/javascript';
    script.async = true;
    script.id = scriptId;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="my-4" id="ad-slot">
      {/* Ad will be injected by the script */}
    </div>
  );
};

export default AdScript;
