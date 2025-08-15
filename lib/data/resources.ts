export interface IndustryReport {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  downloadUrl: string;
  keyInsights: string[];
  highlights: string[];
  content: {
    executiveSummary: string;
    marketOverview: string;
    keyTrends: string[];
    regionalAnalysis: string;
    futureOutlook: string;
    methodology: string;
    dataSources: string[];
    authors: string[];
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  industry: string;
  results: string[];
  challenges: string;
  solution: string;
  duration: string;
  teamSize: string;
  content: {
    companyBackground: string;
    problemStatement: string;
    solutionDetails: string;
    implementation: string;
    results: string[];
    lessonsLearned: string[];
    recommendations: string[];
    metrics: {
      name: string;
      before: string;
      after: string;
      improvement: string;
    }[];
  };
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  readTime: string;
  keyPoints: string[];
  benefits: string[];
  content: {
    overview: string;
    stepByStep: string[];
    tools: string[];
    examples: string[];
    commonMistakes: string[];
    successFactors: string[];
    implementation: string;
    resources: string[];
  };
}

export interface GlobalInsight {
  id: string;
  title: string;
  description: string;
  region: string;
  focus: string;
  keyInsights: string[];
  opportunities: string[];
  content: {
    regionalOverview: string;
    marketAnalysis: string;
    challenges: string[];
    solutions: string[];
    caseStudies: string[];
    futureTrends: string[];
    investmentOpportunities: string[];
    regulatoryEnvironment: string;
  };
}

// Sample data - will be expanded
export const industryReports: IndustryReport[] = [
  {
    id: "q4-2024-logistics",
    title: "Q4 2024 Global Logistics Market Report",
    description: "Comprehensive analysis of Q4 2024 logistics trends, market performance, and future outlook",
    date: "January 2025",
    category: "Market Analysis",
    downloadUrl: "#",
    keyInsights: [
      "Global shipping volumes increased by 8.5% compared to Q3",
      "Air freight rates stabilized after seasonal fluctuations",
      "E-commerce logistics demand continues strong growth",
      "Sustainability initiatives driving industry transformation"
    ],
    highlights: ["Market Trends", "Performance Metrics", "Future Forecast", "Regional Analysis"],
    content: {
      executiveSummary: "The global logistics market showed strong recovery in Q4 2024, with shipping volumes increasing by 8.5% compared to Q3. Air freight rates stabilized after seasonal fluctuations, while e-commerce logistics demand continued its strong growth trajectory. Sustainability initiatives are becoming a key driver of industry transformation.",
      marketOverview: "The global logistics market reached $9.2 trillion in 2024, representing a 6.8% year-over-year growth. This growth was driven by increased e-commerce activity, supply chain resilience investments, and the continued recovery of global trade.",
      keyTrends: [
        "Digital transformation accelerating across all logistics segments",
        "Sustainability becoming a competitive differentiator",
        "Last-mile delivery innovation driving customer expectations",
        "Supply chain resilience investments increasing"
      ],
      regionalAnalysis: "Asia-Pacific led growth with 9.2% increase, followed by North America at 7.1% and Europe at 5.8%. Emerging markets in Africa and Latin America showed strong potential with 12.3% and 8.7% growth respectively.",
      futureOutlook: "We project continued strong growth in 2025, with the market expected to reach $9.8 trillion. Key drivers include continued e-commerce expansion, sustainability initiatives, and technology adoption.",
      methodology: "This report is based on comprehensive market research, including surveys of 500+ logistics companies, analysis of financial data from 200+ public companies, and interviews with 50+ industry experts.",
      dataSources: [
        "SwiftCargo internal data",
        "Industry association reports",
        "Financial market data",
        "Government trade statistics",
        "Academic research"
      ],
      authors: [
        "Dr. Sarah Chen - Chief Economist",
        "Michael Rodriguez - Head of Market Research",
        "Lisa Thompson - Senior Analyst"
      ]
    }
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "techcorp-supply-chain",
    title: "TechCorp Electronics: Global Supply Chain Transformation",
    description: "How TechCorp Electronics achieved 45% reduction in customs clearance time and 30% decrease in shipping costs",
    industry: "Electronics Manufacturing",
    results: [
      "45% reduction in customs clearance time",
      "30% decrease in shipping costs",
      "Improved delivery reliability to 99.2%",
      "Enhanced supplier collaboration"
    ],
    challenges: "Managing complex supply chains across 15 countries with varying customs regulations",
    solution: "Implemented SwiftCargo's global logistics platform with customs clearance automation",
    duration: "6 months",
    teamSize: "12 specialists",
    content: {
      companyBackground: "TechCorp Electronics is a leading manufacturer of electronic components with operations in 15 countries. The company faced significant challenges managing complex supply chains with varying customs regulations and documentation requirements.",
      problemStatement: "TechCorp was experiencing delays averaging 7-10 days in customs clearance, leading to production delays and increased inventory costs. The lack of visibility across their global supply chain was causing inefficiencies and customer dissatisfaction.",
      solutionDetails: "SwiftCargo implemented a comprehensive global logistics platform that included automated customs clearance, real-time tracking, and integrated supplier management. The solution provided end-to-end visibility and automated documentation processing.",
      implementation: "The implementation was completed in phases over 6 months, starting with high-priority routes and gradually expanding to all 15 countries. Training was provided to 200+ staff members across different regions.",
      results: [
        "45% reduction in customs clearance time (from 7-10 days to 3-5 days)",
        "30% decrease in shipping costs through route optimization",
        "Improved delivery reliability from 94% to 99.2%",
        "Enhanced supplier collaboration through integrated platform",
        "Reduced inventory holding costs by 25%"
      ],
      lessonsLearned: [
        "Phased implementation reduces risk and allows for learning",
        "Local expertise is crucial for customs compliance",
        "Technology integration requires significant change management",
        "Supplier collaboration is key to success"
      ],
      recommendations: [
        "Start with high-priority routes and expand gradually",
        "Invest in comprehensive staff training",
        "Establish clear communication channels with suppliers",
        "Monitor and measure results continuously"
      ],
      metrics: [
        {
          name: "Customs Clearance Time",
          before: "7-10 days",
          after: "3-5 days",
          improvement: "45% reduction"
        },
        {
          name: "Shipping Costs",
          before: "$2.3M annually",
          after: "$1.6M annually",
          improvement: "30% reduction"
        },
        {
          name: "Delivery Reliability",
          before: "94%",
          after: "99.2%",
          improvement: "5.2% increase"
        }
      ]
    }
  }
];

export const bestPractices: BestPractice[] = [
  {
    id: "inventory-optimization",
    title: "Inventory Optimization Strategies",
    description: "Proven strategies for optimizing inventory levels while maintaining service quality",
    category: "Operations",
    difficulty: "Intermediate",
    readTime: "15 min read",
    keyPoints: [
      "ABC analysis for inventory categorization",
      "Safety stock calculation methods",
      "Demand forecasting techniques",
      "Supplier collaboration strategies"
    ],
    benefits: ["Reduced holding costs", "Improved cash flow", "Better service levels", "Enhanced efficiency"],
    content: {
      overview: "Inventory optimization is crucial for balancing service levels with cost efficiency. This guide provides proven strategies for optimizing inventory across different business scenarios.",
      stepByStep: [
        "Conduct ABC analysis to categorize inventory by value and importance",
        "Calculate optimal safety stock levels using statistical methods",
        "Implement demand forecasting using historical data and market trends",
        "Establish supplier collaboration programs for better lead time management",
        "Monitor and adjust inventory levels based on performance metrics"
      ],
      tools: [
        "ABC analysis software",
        "Demand forecasting tools",
        "Inventory management systems",
        "Supplier collaboration platforms",
        "Performance analytics dashboards"
      ],
      examples: [
        "A retail company reduced inventory costs by 25% using ABC analysis",
        "A manufacturer improved service levels by 15% through better forecasting",
        "A distributor reduced stockouts by 40% with optimized safety stock"
      ],
      commonMistakes: [
        "Focusing only on cost reduction without considering service levels",
        "Using outdated forecasting methods",
        "Ignoring seasonal variations in demand",
        "Failing to collaborate with suppliers"
      ],
      successFactors: [
        "Data-driven decision making",
        "Regular performance monitoring",
        "Cross-functional collaboration",
        "Continuous improvement mindset"
      ],
      implementation: "Start with a pilot program in one product category or location. Measure results and gradually expand to other areas. Ensure buy-in from all stakeholders.",
      resources: [
        "Inventory management software",
        "Training programs for staff",
        "Consulting services",
        "Industry benchmarks and best practices"
      ]
    }
  }
];

export const globalInsights: GlobalInsight[] = [
  {
    id: "asia-pacific-logistics",
    title: "Asia-Pacific Logistics Landscape 2025",
    description: "Comprehensive analysis of logistics trends and opportunities in the Asia-Pacific region",
    region: "Asia-Pacific",
    focus: "Regional Trends",
    keyInsights: [
      "China's Belt and Road Initiative impact",
      "Southeast Asia e-commerce boom",
      "Port infrastructure developments",
      "Regional trade agreements"
    ],
    opportunities: ["Manufacturing hubs", "E-commerce growth", "Infrastructure investment", "Trade facilitation"],
    content: {
      regionalOverview: "The Asia-Pacific region is the fastest-growing logistics market globally, with annual growth rates of 8-12%. The region is characterized by diverse economies, from developed markets like Japan and Australia to emerging markets like Vietnam and Indonesia.",
      marketAnalysis: "E-commerce is driving significant growth in the region, with online retail growing at 25% annually. Manufacturing continues to be a key driver, particularly in China, Vietnam, and Thailand. Infrastructure development is accelerating across the region.",
      challenges: [
        "Infrastructure gaps in emerging markets",
        "Regulatory complexity across different countries",
        "Talent shortage in logistics and technology",
        "Environmental concerns and sustainability requirements"
      ],
      solutions: [
        "Investment in infrastructure development",
        "Technology adoption for efficiency improvement",
        "Partnerships with local logistics providers",
        "Sustainability initiatives and green logistics"
      ],
      caseStudies: [
        "Alibaba's logistics network expansion in Southeast Asia",
        "JD.com's drone delivery program in rural China",
        "Lazada's cross-border e-commerce logistics"
      ],
      futureTrends: [
        "Continued e-commerce growth and innovation",
        "Increased automation and robotics adoption",
        "Sustainability becoming a key differentiator",
        "Regional trade agreements driving growth"
      ],
      investmentOpportunities: [
        "Last-mile delivery solutions",
        "Cross-border e-commerce logistics",
        "Cold chain logistics for food and pharmaceuticals",
        "Technology platforms for logistics optimization"
      ],
      regulatoryEnvironment: "The regulatory environment varies significantly across the region. China has strict logistics regulations, while Southeast Asian countries are generally more open to foreign investment. Regional trade agreements like RCEP are reducing barriers."
    }
  }
];
