import Link from 'next/link';
import { bankEmiData } from '../../lib/emiData';

const monthColumns = [
  { key: 'm3', label: '3M' },
  { key: 'm6', label: '6M' },
  { key: 'm9', label: '9M' },
  { key: 'm12', label: '12M' },
  { key: 'm18', label: '18M' },
  { key: 'm24', label: '24M' },
  { key: 'm36', label: '36M' },
];

export default function EmiPolicyPage() {
  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-outfit)]">
      <div className="max-w-[1248px] mx-auto px-4 md:px-8 py-10 md:py-14">

        {/* Breadcrumb */}
        <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900">EMI Policy</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M2 10H22" stroke="white" strokeWidth="1.5"/>
                <path d="M6 15H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">EMI Policy & Bank Charge Table</h1>
          </div>
          <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
            This page shows the EMI bank charge dataset used in the EMI calculator on product pages. Charges vary by bank, tenure, and card/payment channel.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Eligibility</p>
            <p className="text-sm text-gray-700 font-medium">EMI facility is available for eligible card holders and supported banks.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Charge Type</p>
            <p className="text-sm text-gray-700 font-medium">Values below are charge percentages by tenure, not flat fees.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Need Help?</p>
            <p className="text-sm text-gray-700 font-medium">For latest bank updates, contact support before placing order.</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-5 py-3.5 text-left text-[11px] uppercase tracking-widest text-gray-300 font-bold border-b border-gray-700 font-[family-name:var(--font-outfit)]">Bank</th>
                  {monthColumns.map((col) => (
                    <th key={col.key} className="px-4 py-3.5 text-center text-[11px] uppercase tracking-widest text-gray-300 font-bold border-b border-gray-700">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bankEmiData.map((bank, idx) => (
                  <tr key={bank.bank} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900 whitespace-nowrap font-[family-name:var(--font-outfit)]">{bank.bank}</td>
                    {monthColumns.map((col) => (
                      <td key={`${bank.bank}-${col.key}`} className={`px-4 py-3 text-center text-sm ${bank[col.key] ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
                        {bank[col.key] ? `${bank[col.key]}%` : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
          Disclaimer: Rates can be updated by banks without prior notice. Applex reserves the right to update this table to match latest partner bank instructions.
        </p>

      </div>
    </main>
  );
}
