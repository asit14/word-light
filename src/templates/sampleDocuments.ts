export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Career' | 'Business' | 'Academic';
  icon: string;
  htmlContent: string;
}

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start with a clean page and default formatting.',
    category: 'General',
    icon: 'FileText',
    htmlContent: '<p></p>',
  },
  {
    id: 'resume',
    name: 'Professional Resume',
    description: 'Modern executive resume template with work history and skills.',
    category: 'Career',
    icon: 'User',
    htmlContent: `
      <h1 style="text-align: center; margin-bottom: 4px;">ALEXANDER WRIGHT</h1>
      <p style="text-align: center; color: #555; margin-top: 0;">San Francisco, CA • (555) 019-2834 • alexander.wright@example.com • linkedin.com/in/alexwright</p>
      <hr style="border: none; border-top: 2px solid #1b365d; margin: 12px 0;" />
      
      <h2>Professional Summary</h2>
      <p>Results-driven Senior Systems Architect with over 10 years of experience delivering resilient distributed computing architectures, leading cross-functional engineering teams, and optimizing application throughput.</p>
      
      <h2>Work Experience</h2>
      <p><strong>Principal Architect</strong> — CloudScale Technologies <em>(2021 – Present)</em></p>
      <ul>
        <li>Spearheaded core platform modernization reducing operational infrastructure expenditure by 34%.</li>
        <li>Mentored an engineering department of 24 software developers across 3 agile teams.</li>
        <li>Maintained 99.99% system availability SLA across multi-region deployments.</li>
      </ul>
      
      <p><strong>Senior Software Engineer</strong> — Nexus Data Systems <em>(2017 – 2021)</em></p>
      <ul>
        <li>Designed microservice pipelines handling over 250 million daily transactional events.</li>
        <li>Decreased average query latency by 45% via automated indexing and query refactoring.</li>
      </ul>
      
      <h2>Education & Certifications</h2>
      <p><strong>Bachelor of Science in Computer Science</strong> — Stanford University (2013 – 2017)</p>
      <p>AWS Certified Solutions Architect – Professional (2023)</p>
      
      <h2>Core Skills</h2>
      <p>Distributed Systems, Rust, TypeScript, PostgreSQL, Linux Kernel Tuning, CI/CD Architecture, High-Availability Systems.</p>
    `,
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    description: 'Formal cover letter with header, date, recipient details and signature.',
    category: 'Career',
    icon: 'Mail',
    htmlContent: `
      <p><strong>Alexander Wright</strong><br />San Francisco, CA • (555) 019-2834 • alexander.wright@example.com</p>
      <p>October 9, 2026</p>
      <p><strong>Hiring Committee</strong><br />Horizon Innovative Labs<br />100 Innovation Way<br />San Francisco, CA 94105</p>
      <p><strong>Subject: Application for Lead Systems Architect Position</strong></p>
      <p>Dear Members of the Hiring Committee,</p>
      <p>I am writing to express my strong enthusiasm for the Lead Systems Architect position currently available at Horizon Innovative Labs. Having closely followed your recent breakthroughs in high-efficiency desktop runtimes, I was thrilled to see this opening aligning directly with my past decade of distributed engineering experience.</p>
      <p>In my current position as Principal Architect at CloudScale Technologies, I spearheaded large-scale architectural transformations that enhanced fault resilience while reducing compute overhead by over 30%. I pride myself on establishing pragmatic software patterns, empowering cross-discipline teams, and championing measurable engineering quality.</p>
      <p>I welcome the opportunity to discuss how my technical acumen and collaborative mindset can contribute to your team's upcoming milestones. Thank you very much for your time and consideration.</p>
      <p>Sincerely,</p>
      <p><strong>Alexander Wright</strong></p>
    `,
  },
  {
    id: 'business-letter',
    name: 'Business Letter',
    description: 'Formal corporate letter with company header and reference info.',
    category: 'Business',
    icon: 'Building',
    htmlContent: `
      <h2 style="color: #1b365d; margin-bottom: 2px;">VERTEX CORPORATION</h2>
      <p style="color: #777; font-size: 10pt; margin-top: 0;">Global Enterprise Headquarters • 450 Lexington Ave, New York, NY</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 16px 0;" />
      <p>Date: October 9, 2026<br />Reference: VC-LTR-2026-884</p>
      <p><strong>To:</strong><br />Mr. David Miller, Operations Director<br />Pinnacle Logistics Group<br />Chicago, IL</p>
      <p>Dear Mr. Miller,</p>
      <p>We are writing to formally confirm our mutual partnership agreement regarding the Q4 expansion program. Following our executive briefing on September 28, our board of directors has reviewed and unanimously ratified the partnership scope.</p>
      <p>Our implementation team has drafted the milestone timeline, attached herein in Exhibit A. Key dates include:</p>
      <ul>
        <li><strong>Phase 1 Initiation:</strong> November 1, 2026</li>
        <li><strong>System Integration Audit:</strong> December 15, 2026</li>
        <li><strong>Full Production Go-Live:</strong> January 20, 2027</li>
      </ul>
      <p>Please do not hesitate to contact our executive coordinator if you have any questions or require additional documentation.</p>
      <p>Warm regards,</p>
      <p><strong>Catherine Sterling</strong><br />Executive Vice President, Vertex Corporation</p>
    `,
  },
  {
    id: 'meeting-minutes',
    name: 'Meeting Minutes',
    description: 'Structured minutes format with attendees, agenda, action items and dates.',
    category: 'Business',
    icon: 'CheckSquare',
    htmlContent: `
      <h1 style="text-align: center;">Executive Committee Meeting Minutes</h1>
      <p style="text-align: center; color: #555;"><strong>Date:</strong> October 9, 2026 | <strong>Time:</strong> 10:00 AM – 11:30 AM EST | <strong>Location:</strong> Boardroom A & Virtual</p>
      <hr style="margin: 16px 0;" />
      <h2>1. Attendees</h2>
      <p><strong>Present:</strong> Catherine Sterling (Chair), Alexander Wright, David Miller, Sarah Jenkins (Secretary)<br />
      <strong>Apologies:</strong> Marcus Vance</p>
      
      <h2>2. Agenda Items</h2>
      <h3>2.1 Q3 Financial and Operational Review</h3>
      <p>The committee examined the quarterly operational performance indicators. Overall productivity metrics surpassed targets by 12%, while server bandwidth expenditures decreased by 8%.</p>
      
      <h3>2.2 Software Modernization Initiative (WordLite Rollout)</h3>
      <p>Alexander reported on the deployment of the lightweight word processor across low-memory terminal stations. Startup latency dropped below 2 seconds and RAM usage stabilized at under 120MB.</p>
      
      <h2>3. Action Items</h2>
      <table>
        <thead>
          <tr>
            <th>Action Item</th>
            <th>Responsible Owner</th>
            <th>Target Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Finalize security audit report</td>
            <td>Alexander Wright</td>
            <td>Oct 18, 2026</td>
            <td>In Progress</td>
          </tr>
          <tr>
            <td>Distribute revised vendor contracts</td>
            <td>David Miller</td>
            <td>Oct 22, 2026</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>Publish meeting summary to staff portal</td>
            <td>Sarah Jenkins</td>
            <td>Oct 11, 2026</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Adjournment</h2>
      <p>The meeting concluded at 11:32 AM. The next scheduled committee assembly will occur on November 13, 2026.</p>
    `,
  },
  {
    id: 'project-report',
    name: 'Project Status Report',
    description: 'Executive project report with milestones, budget table and risks.',
    category: 'Business',
    icon: 'PieChart',
    htmlContent: `
      <h1>Project Alpha: Comprehensive Progress Report</h1>
      <p><strong>Reporting Period:</strong> October 2026 &nbsp;|&nbsp; <strong>Project Lead:</strong> Marcus Vance &nbsp;|&nbsp; <strong>Health:</strong> <span style="color: #2e7d32; font-weight: bold;">ON TRACK</span></p>
      <hr style="margin: 16px 0;" />
      
      <h2>Executive Summary</h2>
      <p>This report documents the ongoing progress of Project Alpha, aimed at revamping legacy desktop client software into modern, memory-efficient applications that thrive on hardware with limited resources.</p>
      
      <h2>Key Milestones & Deliverables</h2>
      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Scheduled Delivery</th>
            <th>Actual Status</th>
            <th>Completion %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Core Engine Architecture</td>
            <td>September 15, 2026</td>
            <td>Verified</td>
            <td>100%</td>
          </tr>
          <tr>
            <td>DOCX Parser & Exporter</td>
            <td>October 5, 2026</td>
            <td>Verified</td>
            <td>100%</td>
          </tr>
          <tr>
            <td>Pagination & Layout Engine</td>
            <td>October 25, 2026</td>
            <td>In Progress</td>
            <td>90%</td>
          </tr>
          <tr>
            <td>Cross-Platform Packaging</td>
            <td>November 10, 2026</td>
            <td>Scheduled</td>
            <td>30%</td>
          </tr>
        </tbody>
      </table>
      
      <h2>Budget & Resource Allocation</h2>
      <p>Total allocated budget: <strong>$150,000</strong>. Total expended to date: <strong>$82,400</strong> (54.9%). Variance remains within permissible margins (+/- 3%).</p>
      
      <h2>Identified Risks & Mitigations</h2>
      <ul>
        <li><strong>Memory pressure on 2GB RAM devices:</strong> Mitigated via lazy-loading optional modules and streaming large document writes.</li>
        <li><strong>DOCX proprietary extensions:</strong> Mitigated through standard ECMA-376 schema compliance and fallback styling.</li>
      </ul>
    `,
  },
  {
    id: 'academic-assignment',
    name: 'Academic Assignment',
    description: 'Standard academic paper layout with title, course details, abstract and citations.',
    category: 'Academic',
    icon: 'BookOpen',
    htmlContent: `
      <p style="text-align: right; color: #555;">Course: CS-480 Distributed Computing<br />Instructor: Prof. Evelyn Bennett<br />Student: Jonathan Ramirez<br />Date: October 9, 2026</p>
      
      <h1 style="text-align: center; margin-top: 32px;">Memory Virtualization in Resource-Constrained Desktop Environments</h1>
      
      <h2>Abstract</h2>
      <p><em>In recent years, the ubiquity of multi-gigabyte browser-wrapped desktop runtimes has raised minimum hardware barriers for end users. This paper evaluates techniques for designing desktop text processing systems capable of sub-150MB resident memory sets on computers with only 2 gigabytes of total system RAM.</em></p>
      
      <h2>1. Introduction</h2>
      <p>Resource efficiency in personal productivity software has historically tracked Moore's Law. However, low-income educational settings and emerging markets frequently rely on secondary computing hardware characterized by dual-core processors and 2GB RAM limits.</p>
      
      <h2>2. Architectural Analysis</h2>
      <p>By decoupling DOM rendering from pagination calculation and adopting system-native rendering engines, application memory footprints can be reduced by over 80% compared to legacy multi-process chromium bundles.</p>
      
      <h2>3. Conclusion</h2>
      <p>Engineering applications with strict performance budgets ensures equitable computing access without compromising authoring capabilities.</p>
      
      <h2>References</h2>
      <ol>
        <li>Knuth, D. E. (1984). <em>The TeXbook</em>. Addison-Wesley.</li>
        <li>Lamport, L. (1994). <em>LaTeX: A Document Preparation System</em>. Addison-Wesley.</li>
      </ol>
    `,
  },
  {
    id: 'research-paper',
    name: 'Scientific Research Paper',
    description: 'Formal double-header research article with methods, results, and discussion.',
    category: 'Academic',
    icon: 'FileCode',
    htmlContent: `
      <h1 style="text-align: center;">Comparative Analysis of Document Object Model Pagination Engines</h1>
      <p style="text-align: center; font-style: italic;">Dr. Sarah Jenkins, Alexander Wright, PhD</p>
      <p style="text-align: center; font-size: 9pt; color: #666;">Institute of Computational Systems Engineering • October 2026</p>
      <hr style="margin: 20px 0;" />
      
      <h2>Abstract</h2>
      <p>We present an empirical study investigating pagination throughput across desktop word processing runtimes. Our findings reveal that incremental layout virtualization achieves a 12x reduction in typing input latency during large document authoring.</p>
      
      <h2>1. Problem Formulation</h2>
      <p>Real-time word processors must continually reconcile document node geometry against arbitrary page boundary thresholds, margin rules, and widow-orphan constraints.</p>
      
      <h2>2. Methodology</h2>
      <p>We subjected test documents ranging from 1 to 100 pages to continuous synthetic keystroke injection while monitoring resident set size (RSS) and garbage collection pauses.</p>
      
      <h2>3. Experimental Results</h2>
      <table>
        <thead>
          <tr>
            <th>Document Size</th>
            <th>Conventional Engine (MB)</th>
            <th>WordLite Engine (MB)</th>
            <th>Latency (ms)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 Page</td>
            <td>280 MB</td>
            <td>84 MB</td>
            <td>4.2 ms</td>
          </tr>
          <tr>
            <td>20 Pages</td>
            <td>390 MB</td>
            <td>98 MB</td>
            <td>7.8 ms</td>
          </tr>
          <tr>
            <td>100 Pages</td>
            <td>740 MB</td>
            <td>132 MB</td>
            <td>12.1 ms</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Discussion & Concluding Remarks</h2>
      <p>The empirical benchmarks establish that strict memory discipline enables smooth word processing even on low-tier 2GB machines.</p>
    `,
  },
  {
    id: 'invoice',
    name: 'Commercial Invoice',
    description: 'Clean billing invoice with itemized services, tax, terms and total sum.',
    category: 'Business',
    icon: 'DollarSign',
    htmlContent: `
      <table style="width: 100%; border: none;">
        <tr>
          <td style="border: none;">
            <h1 style="color: #1b365d; margin: 0;">INVOICE</h1>
            <p style="margin: 4px 0; color: #666;">Invoice #: <strong>INV-2026-1049</strong><br />Date: October 9, 2026<br />Due Date: November 8, 2026</p>
          </td>
          <td style="border: none; text-align: right;">
            <h3 style="margin: 0;">WordLite Design Studio</h3>
            <p style="color: #666; margin: 4px 0;">100 Market St, Suite 400<br />San Francisco, CA 94105<br />billing@wordlite.app</p>
          </td>
        </tr>
      </table>
      
      <hr style="margin: 20px 0;" />
      
      <p><strong>Billed To:</strong><br />Acme Global Technologies Inc.<br />Attn: Accounts Payable<br />742 Evergreen Terrace, Springfield, OR</p>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Hours / Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Desktop UI Engineering & Typography Design</td>
            <td style="text-align: center;">40</td>
            <td style="text-align: right;">$125.00</td>
            <td style="text-align: right;">$5,000.00</td>
          </tr>
          <tr>
            <td>DOCX OpenXML Conversion Module Development</td>
            <td style="text-align: center;">35</td>
            <td style="text-align: right;">$140.00</td>
            <td style="text-align: right;">$4,900.00</td>
          </tr>
          <tr>
            <td>Memory Optimization & Performance Benchmarking</td>
            <td style="text-align: center;">25</td>
            <td style="text-align: right;">$130.00</td>
            <td style="text-align: right;">$3,250.00</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="text-align: right;">$13,150.00</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Tax (0%):</td>
            <td style="text-align: right;">$0.00</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold; font-size: 13pt; color: #1b365d;">Total Due:</td>
            <td style="text-align: right; font-weight: bold; font-size: 13pt; color: #1b365d;">$13,150.00</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 32px; color: #666;"><strong>Payment Terms:</strong> Net 30 days. Remit payment via wire transfer to Account #991820491 or credit card portal. Thank you for your business!</p>
    `,
  },
  {
    id: 'simple-business-proposal',
    name: 'Business Proposal',
    description: 'Complete commercial proposal outlining objectives, scope, timeline and fees.',
    category: 'Business',
    icon: 'Briefcase',
    htmlContent: `
      <h1 style="text-align: center; color: #1b365d;">Business Proposal</h1>
      <h3 style="text-align: center; color: #555; margin-top: 0;">Enterprise Modernization & Document Infrastructure</h3>
      <p style="text-align: center; color: #888;">Prepared for: Acme Global Technologies &bull; Prepared by: WordLite Solutions &bull; October 2026</p>
      <hr style="margin: 24px 0;" />
      
      <h2>1. Project Purpose & Scope</h2>
      <p>This proposal defines the scope and delivery mechanism for deploying lightweight desktop document authoring infrastructure across Acme Global's terminal fleet. The objective is to eliminate heavy licensing overhead while preserving 100% interoperability with existing DOCX document archives.</p>
      
      <h2>2. Deliverables & Technical Architecture</h2>
      <ul>
        <li><strong>Native Desktop Clients:</strong> High-performance macOS and Windows binaries with zero external runtime dependencies.</li>
        <li><strong>DOCX Interoperability:</strong> Lossless roundtrip import and export for contracts, letters, and reports.</li>
        <li><strong>Offline Isolation:</strong> Complete confidentiality with zero cloud synchronization requirements.</li>
      </ul>
      
      <h2>3. Proposed Implementation Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Deliverable Focus</th>
            <th>Estimated Timeline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Architecture design & sandbox testing</td>
            <td>Weeks 1 – 2</td>
          </tr>
          <tr>
            <td>Phase 2</td>
            <td>Corporate template digitization & pilot launch</td>
            <td>Weeks 3 – 4</td>
          </tr>
          <tr>
            <td>Phase 3</td>
            <td>Full rollout and end-user onboarding</td>
            <td>Weeks 5 – 6</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Acceptance & Signatures</h2>
      <p>By signing below, the parties agree to the terms, deliverables, and timeline described above.</p>
      <br /><br />
      <table style="width: 100%; border: none;">
        <tr>
          <td style="border: none; width: 50%;">
            ____________________________________<br />
            <strong>Authorized Representative (Client)</strong><br />
            Date:
          </td>
          <td style="border: none; width: 50%;">
            ____________________________________<br />
            <strong>Authorized Representative (WordLite)</strong><br />
            Date:
          </td>
        </tr>
      </table>
    `,
  },
];
