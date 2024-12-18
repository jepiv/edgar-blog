import React, { useState, useEffect } from 'react';

const SearchTreeViz = () => {
  const SEARCH_TREE_DATA = {
    steps: [
      {
        title: "Step 1: Finding Company",
        description: "Searching for Google in EDGAR",
        nodes: [
          { 
            id: "1a", 
            text: "Search 'Google'", 
            query: "Looking up Google", 
            result: "Found old CIK", 
            status: "error",
            judgment: "Old company name"
          },
          { 
            id: "1b", 
            text: "Search 'Google Inc.'", 
            query: "Looking up Google Inc.", 
            result: "Found old CIK", 
            status: "error",
            judgment: "Old ticker"
          },
          { 
            id: "1c", 
            text: "Search 'Alphabet'", 
            query: "Looking up Alphabet", 
            result: "Found current CIK", 
            status: "success",
            judgment: "Current company"
          },
          { 
            id: "1d", 
            text: "Search 'Alphabet'", 
            query: "Looking up Alphabet", 
            result: "Found current CIK", 
            status: "success",
            judgment: "Current ticker"
          },
          { 
            id: "1e", 
            text: "Search 'Alphabet Inc.'", 
            query: "Looking up Alphabet Inc.", 
            result: "Found current CIK", 
            status: "success",
            judgment: "Current company"
          }
        ],
        pruneNodes: ["1a", "1b"],
        pruneReason: "Google/GOOG searches found old company info - need to search for Alphabet"
      },
      {
        title: "Step 2: Finding 8-Ks",
        description: "Searching for Item 5.02 mentions",
        nodes: [
          { 
            id: "2a", 
            parentId: "1c", 
            text: "Full Search", 
            query: "2 year search", 
            result: "3 departures found", 
            status: "success",
            judgment: "Complete search"
          },
          { 
            id: "2b", 
            parentId: "1d", 
            text: "Full Search", 
            query: "2 year search", 
            result: "3 departures found", 
            status: "success",
            judgment: "Complete search"
          },
          { 
            id: "2c", 
            parentId: "1e", 
            text: "Recent Only", 
            query: "2023 only", 
            result: "2 departures found", 
            status: "error",
            judgment: "Missed 2022 filing"
          }
        ],
        pruneNodes: ["2c"],
        pruneReason: "One search only looked at 2023, missing an earlier departure"
      },
      {
        title: "Step 3: Results",
        description: "Executive departures found",
        nodes: [
          { 
            id: "3a", 
            parentId: "2a", 
            text: "Final List", 
            query: "Compiling names", 
            result: "3 executives", 
            finalAnswer: "Departures Found:\n• Ruth Porat (CFO)\n• Philipp Schindler (CBO)\n• Prabhakar Raghavan (SVP)"
          },
          { 
            id: "3b", 
            parentId: "2b", 
            text: "Final List", 
            query: "Compiling names", 
            result: "3 executives", 
            finalAnswer: "Departures Found:\n• Ruth Porat (CFO)\n• Philipp Schindler (CBO)\n• Prabhakar Raghavan (SVP)"
          }
        ],
        pruneNodes: [],
        pruneReason: null
      }
    ]
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [showJudgments, setShowJudgments] = useState({});
  const [successfulNodes, setSuccessfulNodes] = useState(new Set());

  useEffect(() => {
    const stepKeys = Object.keys(showJudgments);
    if (stepKeys.length > 0) {
      const lastStepWithJudgment = Math.max(...stepKeys.map(Number));
      const step = SEARCH_TREE_DATA.steps[lastStepWithJudgment];
      const successful = step.nodes
        .filter(node => !step.pruneNodes.includes(node.id))
        .map(node => node.id);
      setSuccessfulNodes(prev => new Set([...prev, ...successful]));
    }
  }, [showJudgments]);

  const getNodeColor = (node, step, showingJudgment) => {
    if (showingJudgment && step.pruneNodes.includes(node.id)) return 'bg-red-500/80';
    return 'bg-blue-500';
  };

  const renderTreeLevel = (stepIndex) => {
    const step = SEARCH_TREE_DATA.steps[stepIndex];
    const showingJudgment = showJudgments[stepIndex];
    const isPruned = (nodeId) => showingJudgment && step.pruneNodes.includes(nodeId);

    if (showingJudgment && stepIndex === 2) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 text-gray-200 w-full">
            <pre className="text-sm whitespace-pre-wrap">
              {step.nodes[0].finalAnswer}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {step.nodes.map((node, idx) => {
          const isSuccessful = successfulNodes.has(node.id);
          const appearsInThisColumn = stepIndex === currentStep || 
                                    (stepIndex < currentStep && !isSuccessful);
          const appearsInNextColumn = stepIndex === currentStep - 1 && 
                                    isSuccessful && 
                                    showJudgments[stepIndex];

          let opacity = '100';
          let transform = 'translate(0, 0)';
          
          if (appearsInNextColumn) {
            opacity = '0';
            transform = 'translate(100%, 0)';
          } else if (!appearsInThisColumn) {
            opacity = '0';
          }

          return (
            <div 
              key={node.id}
              className={`transition-all duration-700 ease-in-out transform
                         ${isPruned(node.id) ? 'opacity-30 scale-95' : ''}`}
              style={{
                opacity: `${opacity}%`,
                transform,
              }}
            >
              <div
                className={`p-4 rounded-lg ${getNodeColor(node, step, showingJudgment)} 
                          transition-all duration-500 ease-in-out
                          hover:scale-105 cursor-pointer relative
                          ${isPruned(node.id) ? 'line-through' : ''}`}
                onMouseEnter={() => setShowTooltip(node.id)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="text-white text-sm font-medium">{node.text}</div>
                <div className="text-white/80 text-xs mt-2">{node.result}</div>

                {showTooltip === node.id && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 p-3 
                                bg-gray-800 rounded shadow-lg z-10">
                    <div className="text-gray-200 text-xs">
                      <div className="font-medium mb-1">Query:</div>
                      {node.query}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 rounded-lg border border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Example: "Which of Google's 8-ks in the past two years have had an item 5.02? Which of them were executive departures?"
        </h2>

        <div className="grid grid-cols-3 gap-8 min-h-[600px]">
          {SEARCH_TREE_DATA.steps.map((step, index) => (
            <div key={index} 
                className={`relative border-r last:border-r-0 border-gray-800 
                           transition-opacity duration-500 ease-in-out
                           ${index > currentStep ? 'opacity-0' : 'opacity-100'}
                           flex flex-col gap-4 p-4`}>
              {/* Step Title & Description */}
              <div>
                <div className="text-gray-200 font-medium mb-2">
                  {step.title}
                </div>
                <div className="text-gray-400 text-sm mb-4">
                  {step.description}
                </div>
              </div>

              {/* Judgment Text */}
              {showJudgments[index] && step.pruneReason && (
                <div className="text-red-400/80 text-sm bg-gray-800/50 rounded-lg p-4 
                              transition-all duration-500 ease-in-out text-center">
                  {step.pruneReason}
                </div>
              )}

              {/* Show Judgment Button */}
              {!showJudgments[index] && currentStep === index && (
                <button
                  onClick={() => setShowJudgments(prev => ({ ...prev, [index]: true }))}
                  className="px-4 py-2 rounded-full text-sm bg-gray-800 hover:bg-gray-700 
                           text-gray-300 transition-all duration-200 w-fit mx-auto"
                >
                  {index === 2 ? "Show Final Answer" : "Show Judgment"}
                </button>
              )}

              {/* Tree Level Content */}
              <div className="flex-1">
                {renderTreeLevel(index)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setCurrentStep(Math.max(0, currentStep - 1));
              setShowJudgments({});
              setSuccessfulNodes(new Set());
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 
                      ${currentStep > 0 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}
            disabled={currentStep === 0}
          >
            Previous Step
          </button>
          <div className="text-gray-400 text-sm">
            Step {currentStep + 1} of {SEARCH_TREE_DATA.steps.length}
          </div>
          <button
            onClick={() => {
              if (!showJudgments[currentStep]) {
                alert("Please show judgment before proceeding to the next step.");
                return;
              }
              setCurrentStep(Math.min(SEARCH_TREE_DATA.steps.length - 1, currentStep + 1));
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 
                      ${currentStep < SEARCH_TREE_DATA.steps.length - 1
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}
            disabled={currentStep === SEARCH_TREE_DATA.steps.length - 1}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchTreeViz;