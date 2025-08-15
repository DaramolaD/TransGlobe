// "use client";

import React from "react";
// import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  Users,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Globe,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industryReports } from "@/lib/data/resources";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const report = industryReports.find((r) => r.id === id);

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            // initial={{ opacity: 0, y: 40 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Link
                href="/resources/reports"
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Back to Reports
              </Link>
            </div>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                {report.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
              {report.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              {report.description}
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{report.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{report.content.authors.length} Authors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Key Insights */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-8 text-center">
                Key <span className="text-gradient">Insights</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {report.keyInsights.map((insight, index) => (
                  <div
                    key={index}
                    // initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    // whileInView={{ opacity: 1, x: 0 }}
                    // viewport={{ once: true }}
                    // transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20"
                  >
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Summary */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Executive <span className="text-gradient">Summary</span>
              </h2>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {report.content.executiveSummary}
                </p>
              </div>
            </div>

            {/* Market Overview */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Market <span className="text-gradient">Overview</span>
              </h2>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {report.content.marketOverview}
                </p>
              </div>
            </div>

            {/* Key Trends */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Key <span className="text-gradient">Trends</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {report.content.keyTrends.map((trend, index) => (
                  <div
                    key={index}
                    // initial={{ opacity: 0, y: 20 }}
                    // whileInView={{ opacity: 1, y: 0 }}
                    // viewport={{ once: true }}
                    // transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-border/50 hover:shadow-glow transition-all duration-300"
                  >
                    <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Analysis */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Regional <span className="text-gradient">Analysis</span>
              </h2>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                <div className="flex items-start space-x-3 mb-4">
                  <Globe className="w-8 h-8 text-primary flex-shrink-0" />
                  <h3 className="text-xl font-semibold">Geographic Insights</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {report.content.regionalAnalysis}
                </p>
              </div>
            </div>

            {/* Future Outlook */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Future <span className="text-gradient">Outlook</span>
              </h2>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-border/50">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {report.content.futureOutlook}
                </p>
              </div>
            </div>

            {/* Methodology & Sources */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Research <span className="text-gradient">Methodology</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-primary" />
                    <span>Methodology</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {report.content.methodology}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <span>Data Sources</span>
                  </h3>
                  <ul className="space-y-2">
                    {report.content.dataSources.map((source, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Authors */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Report <span className="text-gradient">Authors</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {report.content.authors.map((author, index) => (
                  <div
                    key={index}
                    // initial={{ opacity: 0, y: 20 }}
                    // whileInView={{ opacity: 1, y: 0 }}
                    // viewport={{ once: true }}
                    // transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-border/50 text-center hover:shadow-glow transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{author}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Download CTA */}
            <div
              // initial={{ opacity: 0, y: 40 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-display font-bold mb-4">
                  Download Full Report
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get the complete report with detailed analysis, charts, and
                  actionable insights to inform your logistics strategy.
                </p>
                <button
                  className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow flex items-center justify-center space-x-2 mx-auto"
                  // whileHover={{ scale: 1.05, y: -2 }}
                  // whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Reports */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div
            // initial={{ opacity: 0, y: 40 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Related <span className="text-gradient">Reports</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore other industry reports and insights to stay ahead of
              logistics trends.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryReports
              .filter((r) => r.id !== report.id)
              .slice(0, 3)
              .map((relatedReport, index) => (
                <div
                  key={relatedReport.id}
                  // initial={{ opacity: 0, y: 60 }}
                  // whileInView={{ opacity: 1, y: 0 }}
                  // viewport={{ once: true }}
                  // transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                      {relatedReport.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">
                      {relatedReport.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {relatedReport.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {relatedReport.date}
                    </span>
                    <Link href={`/resources/reports/${relatedReport.id}`}>
                      <button
                        className="px-4 py-2 text-primary hover:text-primary/80 font-medium flex items-center space-x-2 transition-colors"
                        // whileHover={{ scale: 1.05 }}
                        // whileTap={{ scale: 0.95 }}
                      >
                        <span>Read Report</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div
            // initial={{ opacity: 0, y: 40 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
              Stay <span className="text-gradient">Informed</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get the latest industry insights and market analysis delivered to
              your inbox. Stay ahead of trends and make informed decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-gradient text-white rounded-lg font-semibold text-lg shadow-glow-orange flex items-center justify-center space-x-2"
                // whileHover={{ scale: 1.05, y: -2 }}
                // whileTap={{ scale: 0.95 }}
              >
                <span>Subscribe to Reports</span>
                <Download className="w-5 h-5" />
              </button>

              <Link href="/resources/reports">
                <button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg backdrop-blur-custom hover:bg-white/10 transition-all"
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                >
                  View All Reports
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
