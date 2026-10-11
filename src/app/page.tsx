'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Printer, Building2, Users, ShieldCheck } from 'lucide-react';

interface StudentRecord {
  'Sr No': number;
  'Reg No': number | string;
  'Student Name': string;
  'Father Name': string;
  'Father-CNIC': string;
  'Class - Sec': string;
  'Campus': string;
  'Building No': string;
}

interface ParentInfo {
  fatherName: string;
  fatherCnic: string;
  totalChildren: number;
}

export default function PTMHome() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'cnic' | 'reg' | 'name' | 'father'>('cnic');
  const [results, setResults] = useState<StudentRecord[] | null>(null);
  const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${searchType}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        setParentInfo(data.parentInfo);
      } else {
        setError('Failed to fetch student records.');
      }
    } catch (err) {
      setError('An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    
    // Set the browser tab title to the Father's CNIC so the PDF save prompt pre-populates it
    if (parentInfo?.fatherCnic) {
      const cleanCnic = parentInfo.fatherCnic.replace(/\s+/g, '_');
      document.title = `PTM_Pass_${cleanCnic}`;
    }

    window.print();

    // Restore original title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Navbar / Web Header */}
      <header className="no-print bg-[#3B3B98] text-white shadow-lg border-b-4 border-[#F37021] py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-white p-1 rounded-xl shadow-md border-2 border-[#F37021] shrink-0">
              <Image
                src="/logo.jpg"
                alt="Ghazali Premier Schools Logo"
                width={48}
                height={48}
                className="object-contain sm:w-[55px] sm:h-[55px]"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-wide text-white uppercase leading-tight">
                Ghazali Premier Schools
              </h1>
              <p className="text-orange-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                Parent-Teacher Meeting (PTM) Portal
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#2D3282] px-3 py-1.5 rounded-lg text-xs font-medium text-orange-200 border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-[#F37021]" />
            Active Record System
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 mt-4 sm:mt-8">
        {/* Search Panel */}
        <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { id: 'cnic', label: 'Parent CNIC' },
                { id: 'reg', label: 'Reg Number' },
                { id: 'name', label: 'Student Name' },
                { id: 'father', label: 'Father Name' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchType(tab.id as any)}
                  className={`py-2 px-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                    searchType === tab.id
                      ? 'bg-[#F37021] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input & Search Button */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={
                    searchType === 'cnic'
                      ? 'Enter CNIC (e.g., 61101-8725446-5)...'
                      : searchType === 'reg'
                      ? 'Enter Registration No (e.g., 11)...'
                      : searchType === 'name'
                      ? 'Enter Student Name...'
                      : 'Enter Father Name...'
                  }
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B3B98] font-medium text-xs sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#3B3B98] hover:bg-[#2D3282] text-white px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Record'}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && <div className="no-print bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl mb-6 text-xs sm:text-sm font-medium">{error}</div>}

        {/* Results / PDF Slip Section */}
        {results !== null && (
          <div>
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-slate-700">No Student Records Found</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Please verify the query and try searching again.</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Responsive Search Action Bar */}
                <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center bg-orange-50 border border-orange-200 p-3.5 sm:p-4 rounded-xl gap-3">
                  <div className="text-slate-800 text-xs sm:text-sm">
                    Found <strong className="text-[#F37021]">{results.length} student(s)</strong> for father{' '}
                    <strong className="text-[#3B3B98]">{parentInfo?.fatherName}</strong>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="w-full sm:w-auto bg-[#F37021] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF Pass
                  </button>
                </div>

                {/* Print PDF Pass Card */}
                <div className="print-card bg-white rounded-2xl shadow-xl border-2 border-[#3B3B98] overflow-hidden print:border-2 print:border-black print:shadow-none">
                  {/* Brand Header */}
                  <div className="bg-[#3B3B98] text-white p-4 sm:p-6 print:bg-white print:text-black border-b-4 border-[#F37021] print:border-b-2 print:border-black">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1.5 rounded-xl shadow-inner border border-slate-200 shrink-0">
                          <Image
                            src="/logo.jpg"
                            alt="Ghazali Premier Schools Logo"
                            width={50}
                            height={50}
                            className="object-contain sm:w-[65px] sm:h-[65px]"
                          />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-2xl font-black uppercase tracking-wider text-white print:text-black">
                            Ghazali Premier Schools
                          </h2>
                          <p className="text-orange-300 print:text-slate-700 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-0.5">
                            Parent-Teacher Meeting (PTM) Gate Pass
                          </p>
                        </div>
                      </div>
                      <div className="self-end sm:self-auto">
                        <span className="inline-block bg-[#F37021] text-white print:bg-slate-200 print:text-black text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                          CNIC: {parentInfo?.fatherCnic}
                        </span>
                      </div>
                    </div>

                    {/* Parent Info Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-indigo-400/30 print:border-slate-300 text-xs sm:text-sm">
                      <div>
                        <span className="text-orange-200 print:text-slate-600 block text-[10px] sm:text-xs font-semibold uppercase">
                          Father / Guardian Name:
                        </span>
                        <strong className="text-sm sm:text-lg text-white print:text-black">{parentInfo?.fatherName}</strong>
                      </div>
                      <div>
                        <span className="text-orange-200 print:text-slate-600 block text-[10px] sm:text-xs font-semibold uppercase">
                          Total Registered Children:
                        </span>
                        <strong className="text-sm sm:text-lg text-white print:text-black">{parentInfo?.totalChildren} Child(ren)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Student Locations List */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 print:text-black">
                      Assigned Classrooms & Teacher Sitting Location
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                      {results.map((student, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-slate-200 print:border-slate-400 rounded-xl p-3.5 sm:p-5 bg-slate-50/50 print:bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#3B3B98] text-white print:bg-slate-200 print:text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md">
                                Reg #{student['Reg No']}
                              </span>
                              <h4 className="text-base sm:text-xl font-black text-slate-900">{student['Student Name']}</h4>
                            </div>
                            <div className="text-[11px] sm:text-xs text-slate-600 print:text-slate-800 flex flex-wrap gap-3 sm:gap-5 pt-1 font-medium">
                              <span>
                                Class & Sec: <strong className="text-slate-900">{student['Class - Sec']}</strong>
                              </span>
                              <span>
                                Campus: <strong className="text-slate-900">{student['Campus']}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Room / Building Destination Badge */}
                          <div className="bg-[#F37021] print:bg-slate-100 print:border print:border-black text-white print:text-black px-4 py-2.5 sm:py-3 rounded-xl flex items-center justify-between gap-3 w-full sm:w-auto shadow-sm shrink-0">
                            <div>
                              <span className="text-[9px] sm:text-[10px] uppercase font-black text-orange-100 print:text-slate-600 block tracking-wider">
                                Teacher Room Location
                              </span>
                              <div className="text-sm sm:text-lg font-black flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white print:text-black" /> Building / Room: {student['Building No']}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Print Footer */}
                    <div className="pt-4 sm:pt-6 border-t border-slate-200 print:border-slate-300 text-center text-[11px] sm:text-xs text-slate-500 print:text-slate-700">
                      <strong>Ghazali Premier Schools</strong> • Please present this slip at the respective classroom/building entry point.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}