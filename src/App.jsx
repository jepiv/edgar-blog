import React from 'react';
import EDGARFiletypes from './components/EDGARFiletypes';
import SECFilingsViz from './components/SECFilingsViz';
import { Space } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      {/* Big page title */}
      <h1 className="page-title">
      Agentic Workflows with Vecflow: SEC EDGAR
      </h1>

      {/* Introduction */}
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      At Vecflow, it’s our job to apply intelligent systems to the world’s most complicated problems. But unlike OpenAI, we are not a general intelligence platform. We serve only one demographic – those who practice law.  General-purpose LLMs are smart but inexperienced and, as every supervisor of interns or summer associates knows, there is a big difference between intelligence and knowledge. Our flagship product, Oliver, connects the reasoning power of LLMs to the tools needed to succeed in a legal context. 
      </p>
      <Space/>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      This is the inaugural post in a new series, Agentic Workflows with Vecflow, covering the technology, intuition, and legal underpinnings of our key workflows. We begin with our SEC EDGAR researcher, a tool which enables lawyers to ask broad, amorphous questions over the SEC’s rich history of PubCo filings. 
      </p>
      <Space/>
      
      {/* Subheader */}

      <p className="sub-header">
        Anatomy of EDGAR
      </p>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      The SEC (Securities and Exchange Commission) is an American corporate regulatory body. It requires companies to submit filings for a variety of purposes, publicly accessible to all internet users. The SEC’s Electronic Data Gathering, Analysis, and Retrieval (EDGAR) system facilitates the search and review of these filings. 
      </p>
      <Space/>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
        EDGAR was made mandatory in 1995 and contains a wide variety of filetypes. The term ‘EDGARizing’ is not merely a process, but a profession for many lawyers. This was Vecflow’s first challenge – namely, how to standardize document understanding across disparate PDFs, images, XML, and more. We started with a thorough review – on balance, just how much of EDGAR is PDFs? How much is in text? To break down the data in EDGAR, we first need to understand EDGAR’s filing composition.
      </p>
      <Space/>

      {/* First vis: filing popularity */}
      <div className="space-y-12">
        <SECFilingsViz />
      </div>

      <Space/>
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      EDGAR’s filings are not evenly distributed; Form 4 (insider trading) is the most submitted overall, with other popular filings (10-Q, 8-K, 424B2) not far behind. We need further analysis – not just the most common filings, but the most common files. Below is a sample of some selected filings, with a breakdown of their composition by filetype.
      </p>
      <Space/>

      {/* Second vis: filetype breakdown */}

      <div className="space-y-12">
        <EDGARFiletypes />
      </div>
      <Space/>

      {/* Explanation of search */}
      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      Luckily txt and html are both somewhat text-based, and XBRL affords us enhanced, structured context. By supporting textual understanding of txt, pdf, html, jpeg, png, and xml, we support &gt;90% of EDGAR’s content. 
      </p>

      <Space/>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      Now that we grasp what we’re looking for, how exactly can we find it? There are several ways to perform an EDGAR search, the most simple of which is the ‘full-text’ search. EDGAR supports full-text search directly on its platform – 
      </p>

      <Space/>

      {/* Image of EDGAR search */}

      <img 
        src={`${import.meta.env.BASE_URL}data/edgar_search.png`}
        alt="Description"
        className="w-full max-w-4xl mx-auto"
      />

      <Space/>

      <p className="indent-lg text-gray-300 max-w-3xl mx-auto text-lg">
      The user can include a search key, as well as a company name / CIK, filing type, and date range. EDGAR also supports viewing all filings from a specific company and filtering by other metadata.
      </p>


    </div>
  );
}

export default App;
