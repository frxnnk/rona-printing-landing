module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      var r = await fetch('https://aarxujwmhsubwlpvcnzv.supabase.co/rest/v1/waitlist?select=*&order=id.asc', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcnh1andtaHN1YndscHZjbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Nzg4NzgsImV4cCI6MjA4NjM1NDg3OH0.NwmcX3g5NdSNtwx_BriLPs3o10-wuTawwF6UGIhxHq0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcnh1andtaHN1YndscHZjbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Nzg4NzgsImV4cCI6MjA4NjM1NDg3OH0.NwmcX3g5NdSNtwx_BriLPs3o10-wuTawwF6UGIhxHq0',
        },
      });
      var wl = await r.json();
      return res.status(200).json({ count: wl.length, waitlist: wl });
    } catch(e) {
      return res.status(200).json({ count: 0, waitlist: [], err: e.message });
    }
  }

  if (req.method === 'POST') {
    var body = {};
    try {
      if (req.body && typeof req.body === 'object') body = req.body;
      else if (typeof req.body === 'string') body = JSON.parse(req.body);
    } catch(e) {
      return res.status(400).json({ error: 'JSON error' });
    }

    var type = body.type;
    var value = body.value;
    if (!type || !value) return res.status(400).json({ error: 'Falta type o value' });

    try {
      var insertRes = await fetch('https://aarxujwmhsubwlpvcnzv.supabase.co/rest/v1/waitlist', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcnh1andtaHN1YndscHZjbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Nzg4NzgsImV4cCI6MjA4NjM1NDg3OH0.NwmcX3g5NdSNtwx_BriLPs3o10-wuTawwF6UGIhxHq0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcnh1andtaHN1YndscHZjbnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Nzg4NzgsImV4cCI6MjA4NjM1NDg3OH0.NwmcX3g5NdSNtwx_BriLPs3o10-wuTawwF6UGIhxHq0',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ type: type, value: type === 'instagram' ? (value.startsWith('@') ? value : '@' + value) : value.toLowerCase() }),
      });

      if (!insertRes.ok) {
        var err = await insertRes.json();
        if (err.code === '23505') return res.status(409).json({ error: 'Ya estas anotado!' });
        return res.status(400).json({ error: err.message || 'Error' });
      }

      return res.status(200).json({ success: true });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'no' });
};
