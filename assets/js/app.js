async function updateLiveTelemetry() {
    const endpoint = 'http://129.80.222.26:3000/metrics';
    const elements = {
        cpu: document.getElementById('cpu-perc'),
        ram: document.getElementById('ram-perc'),
        disk: document.getElementById('disk-perc'),
        diskFill: document.getElementById('disk-fill'),
        diskTotal: document.getElementById('disk-total'), // Added diskTotal
        uptime: document.getElementById('uptime-val'),
        statusDot: document.getElementById('status-dot'),
        statusText: document.getElementById('status-text')
    };

    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('API Offline');
        const data = await res.json();

        if(elements.cpu) elements.cpu.innerText = data.cpu + '%';
        if(elements.ram) elements.ram.innerText = data.mem + '%';
        if(elements.disk) elements.disk.innerText = data.disk.capacity + '%';
        if(elements.diskFill) elements.diskFill.style.width = data.disk.capacity + '%';
        if(elements.diskTotal) elements.diskTotal.innerText = data.disk.total;
        
        if(elements.uptime) {
            const h = Math.floor(data.uptime / 3600);
            const m = Math.floor((data.uptime % 3600) / 60);
            elements.uptime.innerText = h + 'h ' + m + 'm';
        }

        if(elements.statusDot) elements.statusDot.className = 'dot-online';
        if(elements.statusText) elements.statusText.innerText = 'SERVER LIVE';

    } catch (err) {
        if(elements.statusDot) elements.statusDot.className = 'dot-offline';
        if(elements.statusText) elements.statusText.innerText = 'SERVER OFFLINE';
        if(elements.diskTotal) elements.diskTotal.innerText = 'OFFLINE'; // Fallback for diskTotal
    }
}
setInterval(updateLiveTelemetry, 10000);
updateLiveTelemetry();
