'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Printer, Building2, Users, ShieldCheck, GraduationCap, MapPin } from 'lucide-react';

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
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Navbar / Web Header */}
      <header className="no-print bg-[#3B3B98] text-white shadow-lg border-b-4 border-[#F37021] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xl shadow-md border-2 border-[#F37021]">
              <Image
                src="/logo.jpg"
                alt="Ghazali Premier Schools Logo"
                width={55}
                height={55}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-white uppercase">
                Ghazali Premier Schools
              </h1>
              <p className="text-orange-300 text-xs font-semibold tracking-wider uppercase">
                Parent-Teacher Meeting (PTM) Desk Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#2D3282] px-4 py-2 rounded-lg text-xs font-medium text-orange-200 border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-[#F37021]" />
            Active Record System
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Search Panel */}
        <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    searchType === tab.id
                      ? 'bg-[#F37021] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={
                    searchType === 'cnic'
                      ? 'Enter CNIC (e.g., 56301-8354958-3)...'
                      : searchType === 'reg'
                      ? 'Enter Registration No (e.g., 11)...'
                      : searchType === 'name'
                      ? 'Enter Student Name...'
                      : 'Enter Father Name...'
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B3B98] font-medium text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3B3B98] hover:bg-[#2D3282] text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Record'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Notification */}
        {error && <div className="no-print bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}

        {/* Results / PDF Slip Section */}
        {results !== null && (
          <div>
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No Student Records Found</h3>
                <p className="text-slate-500 text-sm mt-1">Please verify the query and try searching again.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search Action Bar */}
                <div className="no-print flex justify-between items-center bg-orange-50 border border-orange-200 p-4 rounded-xl">
                  <div className="text-slate-800 text-sm">
                    Found <strong className="text-[#F37021]">{results.length} student(s)</strong> for father{' '}
                    <strong className="text-[#3B3B98]">{parentInfo?.fatherName}</strong>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="bg-[#F37021] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Visitor Pass
                  </button>
                </div>

                {/* Highly Stylized Print PDF Pass */}
                <div className="print-card bg-white rounded-2xl shadow-xl border-2 border-[#3B3B98] overflow-hidden print:border-2 print:border-black print:shadow-none">
                  {/* Brand Header */}
                  <div className="bg-[#3B3B98] text-white p-6 print:bg-white print:text-black border-b-4 border-[#F37021] print:border-b-2 print:border-black">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-inner border border-slate-200">
                          <Image
                            src="/logo.jpg"
                            alt="Ghazali Premier Schools Logo"
                            width={70}
                            height={70}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-wider text-white print:text-black">
                            Ghazali Premier Schools
                          </h2>
                          <p className="text-orange-300 print:text-slate-700 font-bold text-xs uppercase tracking-widest mt-0.5">
                            Parent-Teacher Meeting (PTM) Gate Pass
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-[#F37021] text-white print:bg-slate-200 print:text-black text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
                          CNIC: {parentInfo?.fatherCnic}
                        </span>
                      </div>
                    </div>

                    {/* Parent Info Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-indigo-400/30 print:border-slate-300 text-sm">
                      <div>
                        <span className="text-orange-200 print:text-slate-600 block text-xs font-semibold uppercase">
                          Father / Guardian Name:
                        </span>
                        <strong className="text-lg text-white print:text-black">{parentInfo?.fatherName}</strong>
                      </div>
                      <div>
                        <span className="text-orange-200 print:text-slate-600 block text-xs font-semibold uppercase">
                          Total Registered Children:
                        </span>
                        <strong className="text-lg text-white print:text-black">{parentInfo?.totalChildren} Child(ren)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Student Locations Table / Cards */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 print:text-black">
                      Assigned Classrooms & Teacher Sitting Location
                    </h3>

                    <div className="space-y-4">
                      {results.map((student, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-slate-200 print:border-slate-400 rounded-xl p-5 bg-slate-50/50 print:bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#3B3B98] text-white print:bg-slate-200 print:text-black text-xs font-bold px-2.5 py-0.5 rounded-md">
                                Reg #{student['Reg No']}
                              </span>
                              <h4 className="text-xl font-black text-slate-900">{student['Student Name']}</h4>
                            </div>
                            <div className="text-xs text-slate-600 print:text-slate-800 flex flex-wrap gap-5 pt-1 font-medium">
                              <span>
                                Class & Sec: <strong className="text-slate-900">{student['Class - Sec']}</strong>
                              </span>
                              <span>
                                Campus: <strong className="text-slate-900">{student['Campus']}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Room / Building Destination Badge */}
                          <div className="bg-[#F37021] print:bg-slate-100 print:border print:border-black text-white print:text-black px-5 py-3 rounded-xl flex items-center gap-4 w-full md:w-auto justify-between shadow-sm">
                            <div>
                              <span className="text-[10px] uppercase font-black text-orange-100 print:text-slate-600 block tracking-wider">
                                Teacher Room Location
                              </span>
                              <div className="text-lg font-black flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-white print:text-black" /> Building / Room: {student['Building No']}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer instructions on printout */}
                    <div className="pt-6 border-t border-slate-200 print:border-slate-300 text-center text-xs text-slate-500 print:text-slate-700">
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