"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MailSearch } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 md:py-20 relative">
      <div className="absolute inset-0 bg-primary/5 blur-[100px] md:blur-[150px] -z-10 rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto glass rounded-[32px] md:rounded-[48px] overflow-hidden p-8 md:p-20 text-center space-y-6 md:space-y-8 border-white/10 mx-4 md:mx-auto"
      >
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Start Building Your <br className="hidden sm:block" />
            <span className="text-primary">Human Firewall Today</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Join over 5,000 organizations protecting their most vulnerable asset—their people. Get started with our AI-powered phishing detection platform.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-primary text-background font-bold rounded-2xl flex items-center justify-center space-x-2 hover:neon-glow-cyan transition-all group text-base md:text-lg">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 glass border-white/20 font-bold rounded-2xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-all text-base md:text-lg">
            <span>Try Email Analyzer</span>
            <MailSearch className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-8 md:pt-10 flex flex-wrap justify-center items-center gap-x-6 md:gap-x-8 gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {["Cloudflare", "CrowdStrike", "Okta", "Microsoft", "Google"].map(brand => (
              <span key={brand} className="text-xl md:text-2xl font-black italic tracking-tighter">{brand}</span>
           ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
