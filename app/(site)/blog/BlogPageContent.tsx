"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  Search,
  Filter,
  Clock,
  Eye,
  Share2,
  Bookmark,
  TrendingUp,
  Globe,
  Truck,
  Ship,
  Plane
} from "lucide-react";

type CmsPostProp = {
  title: string;
  excerpt: string | null;
  slug: string;
  cover_image_url: string | null;
  published_at: string | null;
  read_time_minutes: number;
  views_count: number;
  featured: boolean;
  cms_categories?: { name: string } | null;
};

export default function BlogPageContent({ cmsPosts = [] }: { cmsPosts?: CmsPostProp[] }) {
  const featuredPost = {
    title: "The Future of Logistics: AI-Powered Supply Chain Optimization",
    excerpt: "Discover how artificial intelligence is revolutionizing logistics operations, from predictive analytics to autonomous vehicles, and what this means for businesses worldwide.",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    category: "Technology",
    readTime: "8 min read",
    views: "12.5K",
    image: "/api/placeholder/800/400",
    featured: true
  };

  const staticBlogPosts = [
    {
      title: "Sustainable Logistics: Reducing Carbon Footprint in Global Shipping",
      excerpt: "Explore innovative strategies for implementing eco-friendly logistics practices and how businesses can achieve sustainability goals while maintaining efficiency.",
      author: "Michael Chen",
      date: "December 12, 2024",
      category: "Sustainability",
      readTime: "6 min read",
      views: "8.2K",
      image: "/api/placeholder/400/250"
    },
    {
      title: "E-commerce Logistics: Meeting the Demands of Same-Day Delivery",
      excerpt: "How modern logistics solutions are enabling retailers to meet customer expectations for faster delivery while managing costs effectively.",
      author: "Emily Rodriguez",
      date: "December 10, 2024",
      category: "E-commerce",
      readTime: "7 min read",
      views: "9.1K",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Customs Clearance: Navigating International Trade Regulations",
      excerpt: "A comprehensive guide to understanding customs procedures, documentation requirements, and best practices for smooth international shipping.",
      author: "David Kim",
      date: "December 8, 2024",
      category: "International Trade",
      readTime: "10 min read",
      views: "6.8K",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Warehouse Automation: The Rise of Smart Logistics Facilities",
      excerpt: "From robotics to IoT sensors, discover how automation is transforming warehouse operations and improving supply chain efficiency.",
      author: "Lisa Thompson",
      date: "December 5, 2024",
      category: "Automation",
      readTime: "5 min read",
      views: "7.5K",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Cold Chain Logistics: Ensuring Product Integrity in Temperature-Sensitive Shipments",
      excerpt: "Best practices for maintaining product quality and compliance in pharmaceutical, food, and chemical logistics operations.",
      author: "Robert Wilson",
      date: "December 3, 2024",
      category: "Specialized Logistics",
      readTime: "9 min read",
      views: "5.9K",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Last-Mile Delivery: The Final Frontier of Logistics Innovation",
      excerpt: "How companies are revolutionizing the last leg of delivery with drones, autonomous vehicles, and smart routing systems.",
      author: "Alex Thompson",
      date: "December 1, 2024",
      category: "Innovation",
      readTime: "6 min read",
      views: "8.7K",
      image: "/api/placeholder/400/250"
    }
  ];

  const blogPosts =
    cmsPosts.length > 0
      ? cmsPosts.map((p) => ({
          title: p.title,
          excerpt: p.excerpt ?? "",
          author: "SwiftCargo",
          date: p.published_at
            ? new Date(p.published_at).toLocaleDateString()
            : "",
          category: p.cms_categories?.name ?? "News",
          readTime: `${p.read_time_minutes} min read`,
          views: String(p.views_count),
          image: p.cover_image_url ?? "/api/placeholder/400/250",
        }))
      : staticBlogPosts;

  const categories = [
    { name: "Technology", icon: TrendingUp, count: 15 },
    { name: "Sustainability", icon: Globe, count: 12 },
    { name: "E-commerce", icon: Truck, count: 18 },
    { name: "International Trade", icon: Ship, count: 14 },
    { name: "Automation", icon: Plane, count: 9 },
    { name: "Specialized Logistics", icon: Truck, count: 11 }
  ];

  const popularTags = [
    "AI & Machine Learning", "Supply Chain", "Sustainability", "E-commerce", 
    "Global Trade", "Warehousing", "Transportation", "Innovation", 
    "Customer Experience", "Cost Optimization", "Risk Management", "Compliance"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <SectionHeading
              variant="dark"
              eyebrow="Blog"
              title="Logistics Insights"
              subtitle="Stay ahead of the curve with expert analysis, industry trends, and actionable insights from the world of logistics and supply chain management."
              className="!mb-0"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <SectionHeading
              eyebrow="Editor's pick"
              title="Featured Article"
              subtitle="Our latest insights and analysis on the most important trends shaping the logistics industry."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-platinum-off rounded-3xl p-8 border border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-gradient text-white rounded-full px-4 py-2 text-sm mb-6">
                    <Tag className="w-4 h-4" />
                    <span>{featuredPost.category}</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredPost.views} views</span>
                    </div>
                  </div>
                  
                  <motion.button
                    className="btn-cta btn-cta-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="relative">
                  <div className="w-full h-80 bg-gradient-to-br from-graphite-mid/40 to-ember-main/10 rounded-2xl border border-white/20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <TrendingUp className="w-16 h-16 text-white mx-auto" />
                      <div className="text-white/80 text-lg">Featured Article Image</div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-platinum-off">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-12"
              >
                <h2 className="text-3xl lg:text-4xl font-display font-bold">
                  Latest{" "}
                  Articles
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="pl-10 pr-4 py-2 border border-border/50 rounded-lg focus:ring-2 focus:ring-ember-main focus:border-transparent transition-all"
                    />
                  </div>
                  <button className="p-2 border border-border/50 rounded-lg hover:bg-white hover:shadow-lg transition-all">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.title}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-graphite-mid/40 to-ember-main/10 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Truck className="w-12 h-12 text-white mx-auto" />
                          <div className="text-white/80 text-sm">Article Image</div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-graphite-dark transition-colors leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-muted-foreground hover:text-graphite-dark transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-graphite-dark transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <motion.button
                            className="text-graphite-mid hover:text-ember-main font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <motion.button
                  className="px-8 py-4 border-2 border-graphite-mid/30 text-graphite-dark rounded-lg font-semibold text-lg bg-white hover:bg-graphite-mid hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Load More Articles
                </motion.button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-8">
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon className="w-5 h-5 text-graphite-mid" />
                        <span className="group-hover:text-graphite-dark transition-colors">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Popular Tags */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-graphite-mid hover:text-white transition-all"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-graphite-dark rounded-2xl p-6 text-white text-center"
              >
                <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Get the latest logistics insights delivered to your inbox
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  <motion.button
                    className="w-full px-4 py-2 bg-ember-main text-white rounded-lg font-semibold hover:bg-ember-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <SectionHeading
              variant="dark"
              size="large"
              title={
                <>
                  Ready to Transform Your{" "}
                  <span className="text-accent">Logistics?</span>
                </>
              }
              subtitle="Get expert insights and solutions for your logistics challenges. Contact our team today to discuss how we can help optimize your supply chain."
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-cta"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Expert Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse Our Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
