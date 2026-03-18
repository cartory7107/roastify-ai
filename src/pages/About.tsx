import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageCircle, Rocket, Flame, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import creatorImage from "@/assets/creator-placeholder.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Fire background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-flame-orange/6 blur-[160px] flame-flicker" />
        <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-flame-red/5 blur-[120px] flame-flicker" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Roastify
        </Link>
      </nav>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <Badge className="bg-flame-orange/10 text-flame-orange border-flame-orange/20 px-4 py-1.5 text-xs font-semibold gap-1.5">
            <Rocket className="h-3.5 w-3.5" />
            Built with Vision
          </Badge>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="relative mb-6 group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-flame-orange/40 via-flame-red/30 to-flame-yellow/40 blur-md group-hover:blur-lg transition-all duration-500 heat-pulse" />
            <img
              src={creatorImage}
              alt="AL-AMIN JISAN"
              className="relative h-32 w-32 rounded-full object-cover border-2 border-flame-orange/30"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            AL-AMIN <span className="fire-gradient-text">JISAN</span>
          </h1>
          <p className="text-base font-semibold text-flame-orange mb-3">CEO of Cartory BD</p>
          <p className="text-sm text-muted-foreground max-w-md" style={{ textWrap: "pretty" }}>
            Founder and CEO of Cartory BD, building AI-powered tools and global digital solutions.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          <a
            href="mailto:cartorymain@gmail.com"
            className="glass-surface glass-surface-hover group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-flame-orange/20"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-orange/10 text-flame-orange group-hover:bg-flame-orange/20 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Business Email</p>
              <p className="text-sm font-medium text-foreground">cartorymain@gmail.com</p>
            </div>
          </a>

          <a
            href="https://wa.me/8801843253599"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-surface glass-surface-hover group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-green-500/20"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">WhatsApp</p>
              <p className="text-sm font-medium text-green-400">Chat on WhatsApp</p>
            </div>
          </a>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-flame-orange/20 to-transparent" />
          <Flame className="h-4 w-4 text-flame-orange/40" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-flame-orange/20 to-transparent" />
        </div>

        {/* Company Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-surface rounded-xl p-8 text-center"
          style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-flame-orange/10">
              <Building2 className="h-6 w-6 text-flame-orange" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3">About Cartory BD</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Cartory Roastify AI is a product of Cartory BD (GOC). Cartory BD focuses on building modern AI tools, automation systems, and global SaaS solutions.
          </p>
        </motion.div>

        {/* Footer attribution */}
        <p className="text-center text-xs text-muted-foreground mt-12">
          © {new Date().getFullYear()} Cartory BD. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default About;
