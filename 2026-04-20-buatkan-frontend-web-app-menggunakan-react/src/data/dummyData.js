export const residents = [
  { id: "W001", name: "Budi Santoso", houseNumber: "A-12", phone: "0812-1234-5678" },
  { id: "W002", name: "Siti Rahma", houseNumber: "B-08", phone: "0813-2222-1111" },
  { id: "W003", name: "Andi Pratama", houseNumber: "C-03", phone: "0812-9988-7766" },
  { id: "W004", name: "Maya Lestari", houseNumber: "D-15", phone: "0812-5555-4433" },
];

export const initialBills = [
  { id: "BILL-APR-001", residentId: "W001", month: "April 2026", amount: 250000, dueDate: "2026-04-25", status: "UNPAID" },
  { id: "BILL-APR-002", residentId: "W002", month: "April 2026", amount: 250000, dueDate: "2026-04-25", status: "PENDING" },
  { id: "BILL-APR-003", residentId: "W003", month: "April 2026", amount: 250000, dueDate: "2026-04-25", status: "APPROVED" },
  { id: "BILL-APR-004", residentId: "W004", month: "April 2026", amount: 250000, dueDate: "2026-04-25", status: "UNPAID" },
];

export const initialPayments = [
  {
    id: "PAY-001",
    billId: "BILL-APR-002",
    residentId: "W002",
    submittedAt: "2026-04-18 09:10",
    amount: 250000,
    method: "QRIS",
    payerName: "Siti Rahma",
    note: "Transfer via mobile banking",
    proofName: "bukti-siti.jpg",
    status: "PENDING",
    matchedBankTransactionId: null,
  },
  {
    id: "PAY-002",
    billId: "BILL-APR-003",
    residentId: "W003",
    submittedAt: "2026-04-10 14:30",
    amount: 250000,
    method: "QRIS",
    payerName: "Andi Pratama",
    note: "Pembayaran tepat waktu",
    proofName: "bukti-andi.png",
    status: "APPROVED",
    matchedBankTransactionId: "BNK-002",
  },
];

export const initialBankTransactions = [
  {
    id: "BNK-001",
    date: "2026-04-18",
    description: "QRIS IPL SITI",
    amount: 250000,
    balance: 6350000,
    assignedPaymentId: null,
  },
  {
    id: "BNK-002",
    date: "2026-04-10",
    description: "QRIS IPL ANDI",
    amount: 250000,
    balance: 6100000,
    assignedPaymentId: "PAY-002",
  },
  {
    id: "BNK-003",
    date: "2026-04-19",
    description: "TRANSFER IPL TAMBAHAN",
    amount: 500000,
    balance: 6850000,
    assignedPaymentId: null,
  },
];
