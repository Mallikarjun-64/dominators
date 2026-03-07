"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MailSearch, 
  Globe, 
  Inbox, 
  Users, 
  ShieldAlert, 
  Activity 
} from "lucide-react";

const features = [
  {
    title: "AI Email Analyzer",
    description: "Deep neural network analysis of email headers and content for hidden phishing markers.",
    icon: MailSearch,
    color: "bg-primary",
  },
  {
    title: "URL Phishing Scanner",
    description: "Real-time scanning and classification of suspicious URLs and domain landing pages.",
    icon: Globe,
    color: "bg-secondary",
  },
  {
    title: "Gmail Inbox Scanner",
    description: "Connect your workspace directly for continuous monitoring of all incoming communication.",
    icon: Inbox,
    color: "bg-accent",
  },
  {
    title: "Employee Risk Monitoring",
    description: "Identify high-risk behavior and track security posture across your organization.",
    icon: Users,
    color: "bg-warning",
  },
  {
    title: "Phishing Training Simulator",
    description: "Conduct safe phishing simulation tests to train and evaluate employee responses.",
    icon: ShieldAlert,
    color: "bg-danger",
  },
  {
    title: "Real-time Threat Detection",
    description: "Immediate notification and blocking of verified phishing threats across the platform.",
    icon: Activity,
    color: "bg-primary",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm"
          >
            Core Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            Advanced Security <span className="text-primary">Features</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-white/60"
          >
            Our platform combines cutting-edge AI with behavioral science to provide a comprehensive security perimeter.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 md:p-8 glass rounded-[32px] glass-hover relative overflow-hidden"
            >
              {/* Feature Icon Background Decoration */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity ${feature.color}`} />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform ${feature.color}/20 text-white`}>
                <feature.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-primary/80 group-hover:text-primary transition-colors font-semibold text-sm cursor-pointer">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
