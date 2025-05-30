import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generateComparisonPDF(
  element: HTMLElement,
  user1: string,
  user2: string
) {
  try {
    // Wait for fonts to load
    await document.fonts.ready

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 0, // No timeout for images
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in the cloned document
        const style = clonedDoc.createElement('style')
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          }
        `
        clonedDoc.head.appendChild(style)
      }
    })

    const imgData = canvas.toDataURL('image/png', 1.0) // Maximum quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageHeight = 297 // A4 height in mm

    // Add title with better formatting
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('GitHub Profile Comparison', 105, 20, { align: 'center' })
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(14)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`${user1} vs ${user2}`, 105, 30, { align: 'center' })

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight)
    let heightLeft = imgHeight - (pageHeight - 40)

    // Add subsequent pages if needed
    while (heightLeft > 0) {
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    return pdf
  } catch (error) {
    console.error('Error in PDF generation:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
} 