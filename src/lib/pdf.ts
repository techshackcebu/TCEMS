import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceiptPDF = (ticket: any, totals: any) => {
    const doc = new jsPDF({
        unit: 'mm',
        format: [80, 200] // Standard Thermal Receipt Width
    });

    // Branding
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(241, 90, 36); // LTT Orange
    doc.text('TECHSHACK', 40, 15, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Premium Electronics Repair Hub', 40, 20, { align: 'center' });
    doc.text('Mandaue City, Cebu, PH', 40, 24, { align: 'center' });

    // Header Info
    doc.setDrawColor(200, 200, 200);
    doc.line(5, 28, 75, 28);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`TICKET #: ${ticket.ticket_number}`, 5, 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 5, 40);
    doc.text(`CUST: ${ticket.customers.full_name}`, 5, 45);
    doc.text(`DEVICE: ${ticket.devices.brand} ${ticket.devices.model}`, 5, 50);

    // Items Table
    const tableData: any[] = [
        ['Service (Labor)', `₱${totals.labor.toLocaleString()}`]
    ];

    (ticket.probing_history?.expert_data?.parts || []).forEach((p: any) => {
        tableData.push([p.name || 'Component', `₱${(p.price || 0).toLocaleString()}`]);
    });

    autoTable(doc, {
        startY: 55,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'plain',
        styles: { fontSize: 7, cellPadding: 1 },
        headStyles: { fillColor: [241, 90, 36], textColor: [255, 255, 255] },
        columnStyles: { 1: { halign: 'right' } }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL:', 5, finalY);
    doc.text(`₱${totals.grandTotal.toLocaleString()}`, 75, finalY, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing TechShack!', 40, finalY + 15, { align: 'center' });
    doc.setFontSize(6);
    doc.text('Keep this receipt for warranty claims.', 40, finalY + 20, { align: 'center' });

    doc.save(`TechShack_Receipt_${ticket.ticket_number}.pdf`);
};
