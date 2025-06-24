import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { PDFDocument } from 'pdf-lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const {
      clientName,
      companyName,
      slaDate,
      duration,
      serviceType,
      clientSign,
      clientPosition
    } = req.body

    const templatePath = path.join(process.cwd(), 'public/templates/template1.pdf')
    const pdfBytes = fs.readFileSync(templatePath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const page = pdfDoc.getPages()[0]

    page.drawText(clientName, { x: 100, y: 700, size: 12 })
    page.drawText(companyName, { x: 100, y: 685, size: 12 })
    page.drawText(slaDate, { x: 100, y: 670, size: 12 })
    page.drawText(duration + " bulan", { x: 100, y: 655, size: 12 })
    page.drawText(serviceType, { x: 100, y: 640, size: 12 })
    page.drawText(clientSign, { x: 100, y: 100, size: 12 })
    page.drawText(clientPosition, { x: 100, y: 85, size: 12 })

    const finalPdf = await pdfDoc.save()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=SLA.pdf')
    res.send(Buffer.from(finalPdf))
  } catch (err: any) {
    console.error("❌ Gagal generate:", err)
    res.status(500).send('Gagal generate PDF SLA')
  }
}
