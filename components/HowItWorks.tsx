"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Unlink, 
  BrainCircuit, 
  LayoutDashboard 
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Register or Login",
    description: "Create your secure account to access our suite of phishing detection tools.",
    icon: UserPlus,
    color: "from-primary/40 to-primary/10",
  },
  {
    id: 2,
    title: "Connect Workspace",
    description: "Integrate Gmail, Outlook, or paste suspicious content directly for immediate scanning.",
    icon: Unlink,
    color: "from-secondary/40 to-secondary/10",
  },
  {
    id: 3,
    title: "AI Analysis",
    description: "Our neural networks process the content for phishing indicators and domain spoofing.",
    icon: BrainCircuit,
    color: "from-accent/40 to-accent/10",
  },
  {
    id: 4,
    title: "Actionable Insights",
    description: "View real-time threat levels and receive guidance on how to secure your communication.",
    icon: LayoutDashboard,
    color: "from-warning/40 to-warning/10",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-background/50 rounded-[32px] md:rounded-[64px] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[50%] h-[1px] bg-gradient-to-l from-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[1px] bg-gradient-to-r from-accent to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm"
          >
            The Process
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            How to Build Your <span className="text-primary">Human Firewall</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-white/60"
          >
            Get started in minutes and protect your organization with four simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative">
          {/* Connector lines (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center space-y-4 md:space-y-6"
            >
              <div className="relative mx-auto">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-br ${step.color} border border-white/10 group-hover:scale-110 group-hover:neon-glow-cyan transition-all duration-300`}>
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border border-white/10 flex items-center justify-center font-bold text-xs md:text-sm text-primary group-hover:text-white transition-colors">
                  {step.id}
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
