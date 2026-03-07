"use client";

import React from "react";
import Link from "next/link";
import { Shield, Twitter, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Overview", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Features", href: "#" },
        { name: "Demo", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Enterprise", href: "#" },
        { name: "SME", href: "#" },
        { name: "Education", href: "#" },
        { name: "Public Sector", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Docs", href: "#" },
        { name: "Community", href: "#" },
        { name: "Support", href: "#" },
        { name: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Privacy Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="py-16 md:py-20 relative border-t border-white/5 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-12 mb-16 md:mb-20">
          <div className="sm:col-span-2 space-y-6 md:space-y-8 text-center sm:text-left">
            <Link href="/" className="flex items-center justify-center sm:justify-start space-x-2 group">
              <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Human Firewall
              </span>
            </Link>
            <p className="text-white/50 max-w-xs leading-relaxed mx-auto sm:mx-0 text-sm md:text-base">
              Protecting organizations from the most sophisticated phishing threats through AI and human awareness.
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-white/5 hover:border-primary/30"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-4 md:space-y-6 text-center sm:text-left">
              <h5 className="font-bold text-white tracking-widest uppercase text-xs md:text-sm">
                {column.title}
              </h5>
              <ul className="space-y-3 md:space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-primary transition-colors flex items-center justify-center sm:justify-start group text-sm"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-[10px] md:text-sm text-white/30 text-center md:text-left">
          <p>© 2026 Human Firewall. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 gap-y-2">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
