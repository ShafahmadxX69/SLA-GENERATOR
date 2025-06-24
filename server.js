const express = require('express');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/api/generate-sla', async (req, res) => {
  const {
    clientName, companyName, slaDate, duration,
    serviceType, clientSign, clientPosition
  } = req.body;

  // Load template
  const templatePath = path.join(__dirname, 'template_with_placeholders.pdf');
  const existingPdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Posisi teks bisa disesuaikan dengan kebutuhan
  firstPage.drawText(clientName,        { x: 100, y: 700, size: 12 });
  firstPage.drawText(companyName,      { x: 100, y: 685, size: 12 });
  firstPage.drawText(slaDate,          { x: 100, y: 670, size: 12 });
  firstPage.drawText(duration + " bulan", { x: 100, y: 655, size: 12 });
  firstPage.drawText(serviceType,      { x: 100, y: 640, size: 12 });
  firstPage.drawText(clientSign,       { x: 100, y: 100, size: 12 });
  firstPage.drawText(clientPosition,   { x: 100, y: 85, size: 12 });

  const pdfBytes = await pdfDoc.save();

  // Logging
  const logPath = path.join(__dirname, 'log.json');
  const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
  logs.push({ clientName, companyName, slaDate, duration, serviceType, clientSign, clientPosition, createdAt: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
