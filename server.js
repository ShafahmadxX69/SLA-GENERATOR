const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/generate-sla', async (req, res) => {
  try {
    const {
      clientName,
      companyName,
      slaDate,
      duration,
      serviceType,
      clientSign,
      clientPosition
    } = req.body;

    const templatePath = path.join(__dirname, 'public', 'templates', 'blank.pdf');
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send('Template PDF tidak ditemukan.');
    }

    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    page.drawText(clientName, { x: 100, y: 700, size: 12 });
    page.drawText(companyName, { x: 100, y: 685, size: 12 });
    page.drawText(slaDate, { x: 100, y: 670, size: 12 });
    page.drawText(duration + " bulan", { x: 100, y: 655, size: 12 });
    page.drawText(serviceType, { x: 100, y: 640, size: 12 });
    page.drawText(clientSign, { x: 100, y: 100, size: 12 });
    page.drawText(clientPosition, { x: 100, y: 85, size: 12 });

    const finalPdf = await pdfDoc.save();

    // Save to log
    const logPath = path.join(__dirname, 'log.json');
    const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
    logs.push({ clientName, companyName, slaDate, duration, serviceType, clientSign, clientPosition, createdAt: new Date().toISOString() });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="SLA-All4Logistics.pdf"');
    res.send(Buffer.from(finalPdf));
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send('Gagal membuat PDF SLA.');
  }
});

app.listen(PORT, () => console.log(`✅ Server berjalan di http://localhost:${PORT}`));
