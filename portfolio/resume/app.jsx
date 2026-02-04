import React, { useState, useRef, useEffect } from 'react';
import {
  Mail, Globe, Linkedin, MapPin, Download, ExternalLink, Award,
  Briefcase, Cpu, Code, Settings, GraduationCap, CheckCircle2,
  Languages, Microscope
} from 'lucide-react';

/**
 * Sector-specific resume versions.
 * Each version overrides summary, skills, projects, experience (partial).
 * Extend these objects with extra fields as needed (certs, publications, ...).
 */
const versions = {
  all: {
    key: 'all',
    label: 'All / General',
    title: 'Muhammad Areeb Rizwan Siddiqui',
    subtitle: 'Mechanical Engineer | Digital & Smart Manufacturing',
    summary: `Mechanical Engineer specializing in Digital and Smart Manufacturing, with a proven track record of deploying AI/ML, IoT, and Lean principles to drive efficiency gains in automotive and textile sectors. Experienced leading digital transformation projects (MES, Digital Twin) from conception to implementation.`,
    skills: [
      'MES & Digital Twin',
      'AI/ML for QC',
      'Lean Six Sigma (Black Belt)',
      'Mechatronics',
      'Materials Testing (ASTM, NDT)'
    ],
    projects: [
      { title: 'Full-Stack MES', desc: 'Production-ready MES for OEE & real-time analytics', link: 'https://mmcl-ultimate-database-by-areeb.streamlit.app/' },
      { title: 'Digital Twin App', desc: 'Predictive maintenance platform improving uptime.', link: 'https://digital-twin-tyre-project-by-areeb.streamlit.app/' },
      { title: 'AI Vehicle Defect Detection', desc: 'YOLOv8 & OpenCV vision system (~96% accuracy).', link: 'https://cardefectdetectormadebyareeb1.streamlit.app/' }
    ],
    // experience: fallback to full list in UI if not provided
  },

  digital: {
    key: 'digital',
    label: 'Digital / Smart Mfg',
    title: 'Muhammad Areeb Rizwan Siddiqui',
    subtitle: 'Digital & Smart Manufacturing Specialist',
    summary: `Digital Manufacturing specialist focused on MES, Digital Twins, Industrial IoT, and AI-driven quality systems. I build production-ready software and models that reduce data latency, automate QC, and enable predictive maintenance.`,
    skills: [
      'MES Development',
      'Industrial IoT & Telemetry',
      'Digital Twin Modelling',
      'Computer Vision (YOLO / OpenCV)',
      'OEE & Production Analytics'
    ],
    projects: [
      { title: 'Full-Stack MES', desc: 'Real-time production tracking & automated OEE analytics', link: 'https://mmcl-ultimate-database-by-areeb.streamlit.app/' },
      { title: 'Digital Twin - Prescriptive Maintenance', desc: 'Real-time telemetry with predictive analytics improving asset uptime', link: 'https://digital-twin-tyre-project-by-areeb.streamlit.app/' },
      { title: 'AI Vehicle Defect Detection', desc: 'YOLOv8 pipeline deployed via Streamlit (>96% accuracy)', link: 'https://cardefectdetectormadebyareeb1.streamlit.app/' }
    ],
    // Optionally you can provide a compact experience list to prioritize digital roles
    experience: [
      {
        title: 'Trainee Engineer – Production (Process Improvement Lead)',
        company: 'Master Motor Corporation (Pvt.) Ltd.',
        date: '2025 – Present',
        bullets: [
          'Reduced Hatrack DPU by 70% using root-cause analysis and 7 QC tools.',
          'Integrated AI/ML models for defect detection, automating 50% of QC tasks.',
          'Led 20+ Kaizen events; production throughput +15%.'
        ]
      },
      {
        title: 'MTO – Maintenance',
        company: 'Tristar Transport (Pvt.) Ltd.',
        date: '2024 – 2025',
        bullets: ['Rolled out PMP reducing fleet downtime by 40%.']
      }
    ]
  },

  sustainability: {
    key: 'sustainability',
    label: 'Sustainability',
    title: 'Muhammad Areeb Rizwan Siddiqui',
    subtitle: 'Sustainable Manufacturing & Lifecycle Engineer',
    summary: `Sustainability-focused mechanical engineer working at the intersection of lifecycle assessment, circular manufacturing, and Industry 4.0. I design cleaner production systems and lead projects to reduce emissions, reuse materials, and improve process energy efficiency.`,
    skills: [
      'Life Cycle Assessment (LCA)',
      'Sustainable Materials & Circular Economy',
      'Energy Efficiency & Hybrid Energy Systems',
      'Pulse-Jet Baghouse & Emission Control'
    ],
    projects: [
      { title: 'Advanced De-Dusting Plant', desc: 'IoT-enabled pulse-jet baghouse capturing 150,000 cfm, reducing pollutants by ~40%.' },
      { title: 'EcoLens LCA Platform', desc: 'ISO 14040/44-compliant LCA tool -> 40% faster assessments.' }
    ],
    experience: [
      {
        title: 'Trainee Engineer – Production',
        company: 'Master Motor Corporation (Pvt.) Ltd.',
        date: '2025 – Present',
        bullets: [
          'Spearheaded zero-waste initiative: 20% scrap upcycled into furniture.',
          'Implemented process changes increasing energy efficiency by +15%.'
        ]
      }
    ]
  },

  mechatronics: {
    key: 'mechatronics',
    label: 'Mechatronics',
    title: 'Muhammad Areeb Rizwan Siddiqui',
    subtitle: 'Mechatronics & Embedded Systems',
    summary: `Mechatronics-focused engineer experienced in robotics, control systems, and low-level embedded integration for smart manufacturing and precision automation.`,
    skills: ['Control Systems', 'BLDC & Motor Drives', 'Embedded Systems', 'Robotics'],
    projects: [
      { title: 'Smart Farming Weeding Robot', desc: 'Led mechanical design & fabrication; reduced operational costs by 35%.' }
    ]
  },

  renewable: {
    key: 'renewable',
    label: 'Renewable Energy',
    title: 'Muhammad Areeb Rizwan Siddiqui',
    subtitle: 'Renewable Energy & Hybrid Systems',
    summary: `Engineer working on hybrid energy systems (solar PV + battery + grid) and energy-optimizing manufacturing processes to lower LCOE and increase system reliability.`,
    skills: ['Hybrid Energy System Design', '8760-hour Simulations', 'Energy Efficiency Optimization'],
    projects: [
      { title: 'Industrial Hybrid Energy Designer', desc: 'Hybrid system optimizer achieving ≥95% reliability and 15–40% LCOE reductions.' }
    ]
  }
};

const versionsOrder = ['all', 'digital', 'sustainability', 'mechatronics', 'renewable'];

const App = () => {
  const resumeRef = useRef();
  const [active, setActive] = useState('all');

  // Read ?v=<key> from query param for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v') || window.location.hash.replace('#', '') || null;
    if (v && versions[v]) setActive(v);
  }, []);

  // When switching active version, update URL (shallow) so it's linkable/bookmarkable
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', active);
    window.history.replaceState({}, '', url.toString());
    // Optionally set document title for the print PDF
    document.title = `${versions[active].label} — ${versions[active].title}`;
  }, [active]);

  const handleDownload = () => {
    // You can optionally set a special CSS class or attribute on resumeRef to alter print layout per version.
    window.print();
  };

  const vData = versions[active];

  // Common static data (experience & lists). For brevity this demo keeps a subset.
  const commonExperience = [
    {
      title: 'MTO – Maintenance',
      company: 'SM Denim Textile Mills',
      date: '2024',
      bullets: [
        'Automated spare parts tracking; reduced machine downtime by 85%.',
        'Standardized maintenance protocols; cut mean repair time by 50%.'
      ]
    },
    {
      title: 'Mechanical Project Lead',
      company: 'National Center of Artificial Intelligence (NCAI, NEDUET)',
      date: '2022 – 2023',
      bullets: [
        'Led mechanical team to build a robotic weeder, cutting costs 35%.'
      ]
    }
  ];

  // Function to render experience list: prefer version-specific if provided
  const experienceToRender = vData.experience ?? [
    {
      title: 'Trainee Engineer – Production',
      company: 'Master Motor Corporation (Pvt.) Ltd.',
      date: '2025 – Present',
      bullets: [
        'Reduced Hatrack Defects Per Unit (DPU) by 70% using root-cause analysis and 7 QC tools.',
        'Integrated AI/ML models for defect detection, automating 50% of QC tasks.',
        'Led 20+ Kaizen events, increasing production throughput by 15%.'
      ]
    },
    ...commonExperience
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 print:p-0 print:bg-white">
      {/* Controls - Hidden during print */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row items-start justify-between gap-4 print:hidden">
        <div className="flex gap-2 items-center">
          {/* Version Tabs */}
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1 border border-slate-200">
            {versionsOrder.map((k) => {
              const isActive = k === active;
              return (
                <button
                  key={k}
                  onClick={() => setActive(k)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-pressed={isActive}
                >
                  {versions[k].label}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-slate-500 ml-3">Choose a tailored resume</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all font-medium"
            title="Download PDF / Print"
          >
            <Download size={18} />
            Download PDF / Print
          </button>
        </div>
      </div>

      {/* Resume Container */}
      <div
        ref={resumeRef}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:rounded-none border border-slate-200 print:border-none"
      >
        {/* Header Section */}
        <header className="bg-slate-900 text-white p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 uppercase">
                {vData.title}
              </h1>
              <p className="text-blue-400 text-lg font-semibold uppercase tracking-widest">{vData.subtitle}</p>
              <p className="mt-3 text-slate-300 max-w-2xl text-sm leading-relaxed">
                {vData.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-300 whitespace-nowrap">
              <span className="flex items-center gap-2"><Mail size={16} className="text-blue-400"/> engr.areebriz@gmail.com</span>
              <span className="flex items-center gap-2"><Globe size={16} className="text-blue-400"/> www.areebrizwan.com</span>
              <span className="flex items-center gap-2"><Linkedin size={16} className="text-blue-400"/> linkedin.com/in/areebrizwan</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400"/> Karachi, Pakistan</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Column - Sidebar */}
          <aside className="col-span-1 bg-slate-50 border-r border-slate-200 p-8 flex flex-col gap-8 print:bg-white">
            {/* Education */}
            <section>
              <h2 className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-1">
                <GraduationCap size={18} className="text-blue-600"/> Education
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">BE Mechanical Engineering</h3>
                  <p className="text-xs text-slate-600">NED University (10/2020 – 10/2024)</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">Final Year GPA: 3.69 | CGPA: 3.29</p>
                </div>
              </div>
            </section>

            {/* Core Skills - use vData.skills */}
            <section>
              <h2 className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-1">
                <Cpu size={18} className="text-blue-600"/> Core Skills
              </h2>
              <div className="space-y-2">
                {vData.skills.map((s) => (
                  <div key={s}>
                    <p className="text-sm text-slate-800 leading-tight">• {s}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Software Tools */}
            <section>
              <h2 className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-1">
                <Code size={18} className="text-blue-600"/> Software
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {["SolidWorks", "MATLAB", "Ansys", "Python", "Power BI", "Streamlit", "Primavera P6", "PLC"].map((tool) => (
                  <span key={tool} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] rounded font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications (static short list) */}
            <section>
              <h2 className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-1">
                <CheckCircle2 size={18} className="text-blue-600"/> Certifications
              </h2>
              <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                <li>Lean Six Sigma Black Belt</li>
                <li>Digital Manufacturing - SUNY Buffalo</li>
                <li>ISO 9001:2015 Lead Auditor</li>
              </ul>
            </section>

            {/* Languages */}
            <section>
              <h2 className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-1">
                <Languages size={18} className="text-blue-600"/> Languages
              </h2>
              <div className="text-xs space-y-1">
                <p className="font-bold">English: <span className="text-slate-600 font-normal underline decoration-blue-500">Proficient (C2)</span></p>
                <p className="font-bold">Urdu: <span className="text-slate-600 font-normal">Native</span></p>
                <p className="font-bold">German: <span className="text-slate-600 font-normal">Basic (A1)</span></p>
              </div>
            </section>
          </aside>

          {/* Right Column - Experience & Projects */}
          <main className="col-span-2 p-8 md:p-12 flex flex-col gap-10">
            {/* Work Experience */}
            <section>
              <h2 className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest mb-6 text-lg">
                <Briefcase size={22} className="text-blue-600"/> Professional Experience
              </h2>

              <div className="space-y-8">
                {experienceToRender.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-blue-600' : 'bg-slate-300'} rounded-full border-4 border-white`}></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900">{exp.title}</h3>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{exp.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company}</p>
                    <ul className="text-sm text-slate-700 space-y-2 list-inside list-disc">
                      {exp.bullets.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: b }} />)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects / Digital Manufacturing */}
            <section>
              <h2 className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest mb-6 text-lg">
                <Settings size={22} className="text-blue-600"/> Key Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(vData.projects || []).map((project, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{project.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{project.desc}</p>
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 flex items-center gap-1 font-bold uppercase">
                        View Project <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Research & Publications */}
            <section>
              <h2 className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest mb-4 text-lg">
                <Microscope size={22} className="text-blue-600"/> Research & Publications
              </h2>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-slate-900 text-sm italic">Experimental Study of Mechanical Properties: PVC vs Wood Plastic Composite (WPC)</h4>
                <p className="text-xs text-slate-700 mt-2">
                  Conducted ASTM-compliant tensile and hardness tests demonstrating WPC’s superior performance for sustainable manufacturing. Submitted to peer-reviewed journals.
                </p>
              </div>
            </section>

            {/* Certifications / Honors */}
            <section>
              <h2 className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest mb-4 text-lg">
                <Award size={22} className="text-blue-600"/> Honours & Certifications
              </h2>
              <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-700">
                <p>• Lean Six Sigma Black Belt</p>
                <p>• Digital Mfg - SUNY Buffalo</p>
                <p>• ISO 9001:2015 Lead Auditor</p>
                <p>• Additive Manufacturing - Arizona State</p>
                <p>• AI for Mechanical Engineers - University of Michigan</p>
                <p>• Google Project Management</p>
              </div>
            </section>
          </main>
        </div>

        <footer className="bg-slate-50 border-t border-slate-200 p-6 text-center text-slate-400 text-[10px] print:hidden">
          Built with React & Tailwind CSS | Printed Version: {vData.label}
        </footer>
      </div>

      {/* Print specific CSS */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body { background: white; padding: 0; }
          aside { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
          .marker\\:text-blue-500::marker { color: #2563eb !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
