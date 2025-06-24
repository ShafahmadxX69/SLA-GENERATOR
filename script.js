document.getElementById('slaForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/api/generate-sla', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "SLA-All4Logistics.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert("Gagal membuat SLA.");
  }
});
