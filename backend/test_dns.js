    // backend/test_dns.js
    import dns from 'dns';

    const hostname = 'animedb-zaidulwrites.aws-ap-south-1.turso.io';

    dns.lookup(hostname, (err, address, family) => {
      if (err) {
        console.error(`DNS lookup failed for ${hostname}:`, err);
      } else {
        console.log(`DNS lookup successful for ${hostname}:`);
        console.log(`  Address: ${address}`);
        console.log(`  Family: IPv${family}`);
      }
    });

    console.log(`Attempting DNS lookup for ${hostname}...`);
    