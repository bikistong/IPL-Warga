export default function UploadForm({ onUpload }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target.csvFile.files?.[0];
    if (file) {
      onUpload(file);
      event.target.reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-base font-semibold text-slate-900">Upload mutasi bank</p>
          <p className="mt-1 text-sm text-slate-500">
            Simulasikan impor file CSV untuk menambah transaksi bank ke dashboard admin.
          </p>
        </div>
        <input
          type="file"
          name="csvFile"
          accept=".csv"
          className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:max-w-xs"
        />
        <button
          type="submit"
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Upload CSV
        </button>
      </div>
    </form>
  );
}
