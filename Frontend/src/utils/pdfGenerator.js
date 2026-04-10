import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateLoanPDF = (loan, projection) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-IN');


    doc.setFontSize(22);
    doc.setTextColor(0, 43, 73);
    doc.text("LoanLens", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Personal Repayment Statement", 14, 28);
    doc.text(`Generated: ${date}`, 150, 28);

    doc.setDrawColor(230);
    doc.line(14, 32, 196, 32);


    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Overview", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nickname: ${loan.loanName}`, 14, 50);
    doc.text(`Category: ${loan.category}`, 14, 57);
    doc.text(`Principal: Rs. ${loan.amount.toLocaleString('en-IN')}`, 14, 64);
    doc.text(`Rate: ${loan.rate}% p.a.`, 14, 71);

    doc.text(`Projected Tenure: ${projection.tenureMonths} Months`, 110, 50);
    doc.text(`Total Interest: Rs. ${projection.totalInterest.toLocaleString('en-IN')}`, 110, 57);
    doc.text(`Monthly EMI: Rs. ${loan.emi.toLocaleString('en-IN')}`, 110, 64);
    doc.text(`Total Repayment: Rs. ${projection.totalAmount.toLocaleString('en-IN')}`, 110, 71);


    const tableColumn = ["Month", "Interest Paid", "Principal Paid", "Remaining Balance"];
    const tableRows = projection.schedule.map(row => [
        `Month ${row.month}`,
        `Rs. ${row.interest.toLocaleString('en-IN')}`,
        `Rs. ${row.principal.toLocaleString('en-IN')}`,
        `Rs. ${row.closingBalance.toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [0, 43, 73], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 10 }
    });


    doc.save(`${loan.loanName.replace(/\s+/g, '_')}_Statement.pdf`);
};