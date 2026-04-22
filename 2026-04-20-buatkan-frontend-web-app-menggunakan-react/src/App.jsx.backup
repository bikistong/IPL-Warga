import { useMemo, useReducer, useState } from "react";
import DashboardCard from "./components/DashboardCard";
import PaymentTable from "./components/PaymentTable";
import StatusBadge from "./components/StatusBadge";
import UploadForm from "./components/UploadForm";
import { initialBankTransactions, initialBills, initialPayments, residents } from "./data/dummyData";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const residentOptions = residents.map((resident) => ({
  value: resident.id,
  label: `${resident.name} - ${resident.houseNumber}`,
}));

const initialState = {
  bills: initialBills,
  payments: initialPayments,
  bankTransactions: initialBankTransactions,
};

function reducer(state, action) {
  switch (action.type) {
    case "SUBMIT_PAYMENT": {
      const payment = {
        id: `PAY-${String(state.payments.length + 1).padStart(3, "0")}`,
        submittedAt: new Date().toLocaleString("id-ID"),
        method: "QRIS",
        status: "PENDING",
        matchedBankTransactionId: null,
        ...action.payload,
      };

      return {
        ...state,
        payments: [payment, ...state.payments],
        bills: state.bills.map((bill) =>
          bill.id === payment.billId ? { ...bill, status: "PENDING" } : bill,
        ),
      };
    }
    case "UPLOAD_BANK_CSV": {
      return {
        ...state,
        bankTransactions: [...action.payload, ...state.bankTransactions],
      };
    }
    case "ASSIGN_PAYMENT": {
      const { paymentId, bankTransactionId } = action.payload;
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: "MATCHED", matchedBankTransactionId: bankTransactionId }
            : payment,
        ),
        bankTransactions: state.bankTransactions.map((transaction) =>
          transaction.id === bankTransactionId
            ? { ...transaction, assignedPaymentId: paymentId }
            : transaction,
        ),
      };
    }
    case "APPROVE_PAYMENT": {
      const paymentId = action.payload;
      const approvedPayment = state.payments.find((payment) => payment.id === paymentId);
      if (!approvedPayment) return state;

      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status: "APPROVED" } : payment,
        ),
        bills: state.bills.map((bill) =>
          bill.id === approvedPayment.billId ? { ...bill, status: "APPROVED" } : bill,
        ),
      };
    }
    case "REJECT_PAYMENT": {
      const paymentId = action.payload;
      const rejectedPayment = state.payments.find((payment) => payment.id === paymentId);
      if (!rejectedPayment) return state;

      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: "REJECTED", matchedBankTransactionId: null }
            : payment,
        ),
        bills: state.bills.map((bill) =>
          bill.id === rejectedPayment.billId ? { ...bill, status: "UNPAID" } : bill,
        ),
        bankTransactions: state.bankTransactions.map((transaction) =>
          transaction.assignedPaymentId === paymentId
            ? { ...transaction, assignedPaymentId: null }
            : transaction,
        ),
      };
    }
    default:
      return state;
  }
}

function getResidentById(residentId) {
  return residents.find((resident) => resident.id === residentId);
}

function parseCsvFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const rows = lines.slice(1).map((line, index) => {
        const [date, description, amount, balance] = line.split(",");
        return {
          id: `BNK-UP-${Date.now()}-${index + 1}`,
          date,
          description,
          amount: Number(amount) || 0,
          balance: Number(balance) || 0,
          assignedPaymentId: null,
        };
      });

      resolve(rows);
    };
    reader.readAsText(file);
  });
}

function StaticQrCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">Pembayaran Transfer Bank</p>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Silakan lakukan pembayaran melalui transfer ke rekening berikut, lalu upload bukti pembayaran.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 flex justify-between">
            <span className="text-slate-500">Bank</span>
            <span className="font-semibold text-slate-900">BCA</span>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 flex justify-between">
            <span className="text-slate-500">No. Rekening</span>
            <span className="font-semibold text-slate-900">1234567890</span>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 flex justify-between">
            <span className="text-slate-500">Atas Nama</span>
            <span className="font-semibold text-slate-900">Kas IPL Warga</span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Pastikan nominal transfer sesuai tagihan ya 👍
        </div>
      </div>
    </div>
  );
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeRole, setActiveRole] = useState("user");
  const [selectedResidentId, setSelectedResidentId] = useState(residents[0].id);
  const [search, setSearch] = useState("");
  const [assignmentMap, setAssignmentMap] = useState({});

  const selectedResident = getResidentById(selectedResidentId);
  const residentBills = state.bills.filter((bill) => bill.residentId === selectedResidentId);
  const residentPayments = state.payments.filter((payment) => payment.residentId === selectedResidentId);

  const unpaidResidents = state.bills.filter((bill) => bill.status !== "APPROVED").length;
  const totalIncome = state.payments
    .filter((payment) => payment.status === "APPROVED")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalCash = state.bankTransactions[state.bankTransactions.length - 1]?.balance ?? 0;

  const filteredBankTransactions = useMemo(() => {
    return state.bankTransactions.filter((transaction) => {
      const keyword = search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(keyword) ||
        transaction.id.toLowerCase().includes(keyword)
      );
    });
  }, [search, state.bankTransactions]);

  const paymentHistoryRows = residentPayments.map((payment) => ({
    ...payment,
    resident: selectedResident?.name ?? "-",
    proof: payment.proofName,
  }));

  const pendingMatchingRows = state.payments
    .filter((payment) => payment.status === "PENDING" || payment.status === "MATCHED")
    .map((payment) => {
      const resident = getResidentById(payment.residentId);
      const assignedTransaction = state.bankTransactions.find(
        (transaction) => transaction.id === payment.matchedBankTransactionId,
      );
      return {
        ...payment,
        resident: resident ? `${resident.name} (${resident.houseNumber})` : payment.residentId,
        bankReference: assignedTransaction?.description ?? "Belum di-assign",
      };
    });

  const userBill = residentBills[0];

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const file = form.proof.files?.[0];
    const amount = Number(form.amount.value);

    if (!userBill || !file || !amount) {
      return;
    }

    dispatch({
      type: "SUBMIT_PAYMENT",
      payload: {
        billId: userBill.id,
        residentId: selectedResidentId,
        amount,
        payerName: form.payerName.value,
        note: form.note.value,
        proofName: file.name,
      },
    });

    form.reset();
  };

  const handleCsvUpload = async (file) => {
    const parsedRows = await parseCsvFile(file);
    dispatch({ type: "UPLOAD_BANK_CSV", payload: parsedRows });
  };

  const availableTransactions = state.bankTransactions.filter(
    (transaction) => !transaction.assignedPaymentId,
  );

  return (
    <div className="min-h-screen px-4 py-8 text-slate-800 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                Sistem Pembayaran IPL
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Dashboard IPL Warga Mandalika
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
                Simulasi frontend untuk alur konfirmasi pembayaran warga dan verifikasi admin tanpa backend.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveRole("user")}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  activeRole === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                View Warga
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("admin")}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  activeRole === "admin"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                View Admin
              </button>
            </div>
          </div>
        </header>

        {activeRole === "user" ? (
          <main className="mt-8 space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/40 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Pilih Warga</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Simulasi multi-user untuk melihat dashboard dan riwayat tiap warga.
                  </p>
                </div>
                <select
                  value={selectedResidentId}
                  onChange={(event) => setSelectedResidentId(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {residentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <DashboardCard
                title="Tagihan Aktif"
                value={userBill ? currency.format(userBill.amount) : currency.format(0)}
                subtitle={userBill ? `Jatuh tempo ${userBill.dueDate}` : "Tidak ada tagihan"}
              />
              <DashboardCard
                title="Status Pembayaran"
                value={userBill?.status ?? "UNPAID"}
                subtitle={`Atas nama ${selectedResident?.name ?? "-"}`}
                accent="from-amber-400 to-orange-500"
              />
              <DashboardCard
                title="Riwayat Pembayaran"
                value={`${residentPayments.length} transaksi`}
                subtitle={`Rumah ${selectedResident?.houseNumber ?? "-"}`}
                accent="from-emerald-500 to-teal-500"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <StaticQrCard />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Ringkasan Tagihan</p>
                    <p className="mt-1 text-sm text-slate-500">Detail tagihan IPL periode berjalan.</p>
                  </div>
                  <StatusBadge status={userBill?.status ?? "UNPAID"} />
                </div>
                <dl className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-slate-500">Warga</dt>
                    <dd className="font-semibold text-slate-900">{selectedResident?.name}</dd>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-slate-500">Periode</dt>
                    <dd className="font-semibold text-slate-900">{userBill?.month ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-slate-500">Nominal</dt>
                    <dd className="font-semibold text-slate-900">
                      {currency.format(userBill?.amount ?? 0)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
              <form
                key={selectedResidentId}
                onSubmit={handlePaymentSubmit}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-lg font-semibold text-slate-900">Konfirmasi Pembayaran</p>
                <p className="mt-1 text-sm text-slate-500">
                  Submit pembayaran untuk mengubah status tagihan menjadi <strong>PENDING</strong>.
                </p>

                <div className="mt-6 grid gap-4">
                  <input
                    name="payerName"
                    defaultValue={selectedResident?.name}
                    placeholder="Nama pengirim"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                  <input
                    name="amount"
                    type="number"
                    defaultValue={userBill?.amount}
                    placeholder="Nominal"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                  <textarea
                    name="note"
                    rows="4"
                    placeholder="Catatan pembayaran"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                  <input
                    name="proof"
                    type="file"
                    accept="image/*,.pdf"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
                  >
                    Submit Konfirmasi
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Riwayat Pembayaran</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Menampilkan status pembayaran: PENDING, MATCHED, APPROVED, REJECTED.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <PaymentTable
                    columns={[
                      { key: "submittedAt", label: "Tanggal" },
                      {
                        key: "amount",
                        label: "Nominal",
                        render: (value) => currency.format(value),
                      },
                      { key: "proof", label: "Bukti" },
                      { key: "status", label: "Status" },
                    ]}
                    rows={paymentHistoryRows}
                    emptyText="Belum ada riwayat pembayaran"
                  />
                </div>
              </div>
            </section>
          </main>
        ) : (
          <main className="mt-8 space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <DashboardCard
                title="Total Kas"
                value={currency.format(totalCash)}
                subtitle="Saldo terakhir dari data mutasi"
              />
              <DashboardCard
                title="Total Pemasukan"
                value={currency.format(totalIncome)}
                subtitle="Akumulasi pembayaran APPROVED"
                accent="from-emerald-500 to-lime-500"
              />
              <DashboardCard
                title="Belum Bayar"
                value={`${unpaidResidents} warga`}
                subtitle="Jumlah tagihan yang belum APPROVED"
                accent="from-rose-500 to-orange-500"
              />
            </section>

            <UploadForm onUpload={handleCsvUpload} />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Tabel Transaksi Bank</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Cari transaksi lalu gunakan saat proses matching dengan pembayaran warga.
                  </p>
                </div>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari ID atau deskripsi transaksi"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </div>

              <div className="mt-6">
                <PaymentTable
                  columns={[
                    { key: "id", label: "ID" },
                    { key: "date", label: "Tanggal" },
                    { key: "description", label: "Deskripsi" },
                    {
                      key: "amount",
                      label: "Nominal",
                      render: (value) => currency.format(value),
                    },
                    {
                      key: "assignedPaymentId",
                      label: "Assignment",
                      render: (value) => value || "Belum diassign",
                    },
                  ]}
                  rows={filteredBankTransactions}
                  emptyText="Belum ada transaksi bank"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-lg font-semibold text-slate-900">Matching Pembayaran</p>
                <p className="mt-1 text-sm text-slate-500">
                  Cocokkan pembayaran warga dengan mutasi bank, lalu approve atau reject.
                </p>
              </div>

              <div className="mt-6">
                <PaymentTable
                  columns={[
                    { key: "resident", label: "Warga" },
                    {
                      key: "amount",
                      label: "Nominal",
                      render: (value) => currency.format(value),
                    },
                    { key: "submittedAt", label: "Submitted" },
                    { key: "bankReference", label: "Mutasi Terkait" },
                    { key: "status", label: "Status" },
                  ]}
                  rows={pendingMatchingRows}
                  emptyText="Tidak ada pembayaran yang perlu diverifikasi"
                  actions={(row) => (
                    <div className="flex min-w-[240px] flex-col gap-2">
                      <select
                        value={assignmentMap[row.id] ?? row.matchedBankTransactionId ?? ""}
                        onChange={(event) =>
                          setAssignmentMap((current) => ({
                            ...current,
                            [row.id]: event.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                      >
                        <option value="">Pilih transaksi bank</option>
                        {availableTransactions.map((transaction) => (
                          <option key={transaction.id} value={transaction.id}>
                            {transaction.id} - {currency.format(transaction.amount)}
                          </option>
                        ))}
                        {row.matchedBankTransactionId ? (
                          <option value={row.matchedBankTransactionId}>
                            {row.matchedBankTransactionId} - assigned
                          </option>
                        ) : null}
                      </select>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const bankTransactionId =
                              assignmentMap[row.id] ?? row.matchedBankTransactionId;
                            if (bankTransactionId) {
                              dispatch({
                                type: "ASSIGN_PAYMENT",
                                payload: { paymentId: row.id, bankTransactionId },
                              });
                            }
                          }}
                          className="rounded-xl bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-200"
                        >
                          Assign
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "APPROVE_PAYMENT", payload: row.id })}
                          className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "REJECT_PAYMENT", payload: row.id })}
                          className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                />
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
