import React from 'react';
import EDGARFiletypes from './components/EDGARFiletypes';
import SECFilingsViz from './components/SECFilingsViz';
import SearchTreeViz from './components/EDGARTree';

function App() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] py-12 px-4">
      {/* Big page title */}
      <p className="text-gray-300 max-w-3xl mx-auto text-lg italic opacity-80 justify-left">
      January 15, 2025
      </p>
      <div className="my-2"></div>
      <h1 className="page-title">
        Agentic Workflows with Vecflow: SEC EDGAR
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto text-lg italic mb-8 opacity-80 text-center">
        Joseph Parker & The Vecflow Research Team
      </p>

      <img 
        src={`${import.meta.env.BASE_URL}data/pexels.jpg`}
        alt="Description"
        className="w-full max-w-3xl mx-auto"
      />

      <div className="my-6"></div>

      {/* Introduction */}
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        At Vecflow, it’s our job to apply intelligent systems to the world’s most complicated problems. But unlike OpenAI, we are not a general intelligence platform. We serve only one demographic – those who practice law. General-purpose LLMs are smart but inexperienced and, as every supervisor of interns or summer associates knows, there is a big difference between intelligence and knowledge. Our flagship product, Oliver, connects the reasoning power of LLMs to the tools needed to succeed in a legal context. 
      </p>
      <div className="my-6"></div>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        This is the inaugural post in a new series, Agentic Workflows with Vecflow, covering the technology, intuition, and legal underpinnings of our key workflows. We begin with our SEC EDGAR researcher, a tool which enables lawyers to ask broad, amorphous questions over the SEC’s rich history of PubCo filings. 
      </p>
      <div className="my-6"></div>

      {/* Subheader */}

      <p className="sub-header">
        The Promise of EDGAR
      </p>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        The SEC (Securities and Exchange Commission) is an American corporate regulatory body. It requires companies to submit filings for a variety of purposes, publicly accessible to all internet users. The SEC’s Electronic Data Gathering, Analysis, and Retrieval (EDGAR) system facilitates the search and review of these filings. 
      </p>
      <div className="my-6"></div>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        EDGAR's mission statement is admirable: democratic, rapid access to all corporate filings. But the reality is more complex. EDGAR is a sprawling database, requiring broad initial searches and heavy manual review. At Vecflow, we’re working to make EDGAR rapidly searchable and understandable, so that lawyers can focus on the legal implications of filings, rather than the filings themselves. Oliver's SEC capabilities are a strong step in this direction, providing research comparable to junior associates in a fraction of the time.
      </p>
      <div className="my-6"></div>

      <p className="sub-header">
        Anatomy of EDGAR
      </p>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        Enhancing EDGAR's usability requires a knowledge of the database's history. EDGAR was made mandatory in 1995 and contains a wide variety of filetypes. The term ‘EDGARizing’ is not merely a process but a profession for many lawyers. This was Vecflow’s first challenge – namely, how to standardize document understanding across disparate PDFs, images, XML, and more. We started with a thorough review – on balance, just how much of EDGAR is PDFs? How much is in text? To break down the data in EDGAR, we first need to understand EDGAR’s filing composition.
      </p>
      <div className="my-6"></div>

      {/* First vis: filing popularity */}
      <div className="space-y-12">
        <SECFilingsViz />
      </div>

      <div className="my-6"></div>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        EDGAR’s filings are not evenly distributed; Form 4 (insider trading) is the most submitted overall, with other popular filings (10-Q, 8-K, 424B2) not far behind. We need further analysis – not just the most common filings, but the most common files. Below is a sample of some selected filings, with a breakdown of their composition by filetype.
      </p>
      <div className="my-6"></div>

      {/* Second vis: filetype breakdown */}

      <div className="space-y-12">
        <EDGARFiletypes />
      </div>
      <div className="my-6"></div>

      <p className="text-gray-400 max-w-3xl mx-auto text-sm text-center italic">
        Based on a random sample of 1,000 filings per filing type, per year.
      </p>
      <div className="my-6"></div>

      {/* Explanation of search */}
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        Luckily, txt and html are both somewhat text-based, and XBRL affords us enhanced, structured context. By supporting textual understanding of txt, pdf, html, jpeg, png, and xml, we support &gt;90% of EDGAR’s content. 
      </p>
      <div className="my-6"></div>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        Now that we grasp what we’re looking for, how exactly can we find it? There are several ways to perform an EDGAR search, the most simple of which is the ‘full-text’ search. EDGAR supports full-text search directly on its platform – 
      </p>
      <div className="my-6"></div>

      {/* Image of EDGAR search */}

      <img 
        src={`${import.meta.env.BASE_URL}data/edgar_search.png`}
        alt="Description"
        className="w-full max-w-4xl mx-auto"
      />
      <div className="my-6"></div>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        The user can include a search key, as well as a company name / CIK, filing type, and date range. EDGAR also supports viewing all filings from a specific company and filtering by other metadata.
      </p>
      <div className="my-12"></div>

      {/* Second subheader */}
      <p className="sub-header">
        EDGAR Research
      </p>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        When first building our SEC agent, we were met by an outpouring of interest from lawyers. We quickly realized that our beta tool – built on simple search and document parsing – was too unsophisticated to answer the class of questions being posed by our users. For instance:
      </p>

      <hr className="w-16 mx-auto my-8 border-t border-gray-600" />

      <p className="font-serif indent-lg text-gray-300 max-w-3xl mx-auto text-lg text-center italic">
        “How has Amazon’s ESG strategy changed over the past 10 years?”
      </p>
      <div className="my-6"></div>
      <p className="font-serif indent-lg text-gray-300 max-w-3xl mx-auto text-lg text-center italic">
        “Give me Nevada-based companies with a letter of resignation from a director in the past 24 months.”
      </p>
      <div className="my-6"></div>
      <p className="font-serif indent-lg text-gray-300 max-w-3xl mx-auto text-lg text-center italic">
        “What are the principal risks of oil and gas companies located on the East Coast? How do they compare to companies on the West Coast? Any differences? Make a table delineating general and specific risks.”
      </p>
      <hr className="w-16 mx-auto my-8 border-t border-gray-600" />

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        These questions require more than the ability to search and read specific documents. We needed an agent with autonomy – the ability to form and execute a plan – over the SEC corpus. 
      </p>
      <div className="my-6"></div>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        Vecflow's EDGAR Agent is built on a proprietary tree search, the same algorithm that informed Deep Blue’s defeat of Kasparov. Simply put, our agent tries many different research approaches, ranking them at each stage and continuing with only the best ones. Let’s see an example of this thinking in action. 
      </p>
      <div className="my-6"></div>

      {/* Third vis: tree search */}
      <SearchTreeViz />
      <div className="my-6"></div>
      <p className="text-gray-200 max-w-3xl mx-auto text-sm text-center italic">
        Please note that all data contained herein is synthetic and for illustrative purposes only.
      </p>

      <div className="my-6"></div>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        Tree search facilitates the exploration of many paths at once, allowing the agent to avoid common pitfalls and informational dead ends. This is especially important when contrasted with many of our competitors, who rely not only on linear search, but on the user to actively provide lists of documents beforehand. 
        Oliver's EDGAR agent allows for a more natural and expedient research process.
      </p>

      <div className="my-6"></div>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        We are committed to empowering lawyers with the best research tools. If you are interested in learning more about Vecflow’s EDGAR Agent, please send questions or business inquiries to <a href="mailto:team@vecflow.ai" className="text-blue-400">team@vecflow.ai</a>. 
      </p>
    </div>
  );
}

export default App;
