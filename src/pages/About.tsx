import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageCircle, Rocket, Flame, Building2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import creatorImage from "@/assets/creator-photo.png";

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

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
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

        {/* Brand Headline + Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              The <span className="fire-gradient-text">First AI Tech Brand</span> from Bangladesh 🇧🇩
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Built to lead the next generation of AI SaaS, automation, and digital innovation from Bangladesh to the world.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-surface rounded-2xl p-6 sm:p-8"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle), 0 18px 50px rgba(0,0,0,0.18)" }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-flame-orange/45 via-flame-red/30 to-flame-yellow/45 blur-md group-hover:blur-lg transition-all duration-500 heat-pulse" />
                <img
                  src={creatorImage}
                  alt="AL-AMIN JISAN"
                  className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-3xl object-cover border-2 border-flame-orange/30"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <Badge className="bg-flame-orange/10 text-flame-orange border-flame-orange/20 px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    AI Innovator
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                    Bangladesh 🇧🇩
                  </Badge>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  AL-AMIN <span className="fire-gradient-text">JISAN</span>
                </h2>
                <p className="text-base sm:text-lg font-semibold text-flame-orange mb-2">
                  Founder of an AI Tech Company
                </p>
                <p className="text-sm text-muted-foreground mb-4" style={{ textWrap: "pretty" }}>
                  Building AI tools for the future from Bangladesh 🇧🇩
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl" style={{ textWrap: "pretty" }}>
                  My vision is to create high-impact AI tools, SaaS platforms, and automation systems that help businesses scale faster.
                  My mission is to represent Bangladesh as a trusted force in global AI innovation while delivering premium products that solve real problems.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <a
            href="mailto:cartorymain@gmail.com"
            className="glass-surface glass-surface-hover group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-flame-orange/20"
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
            className="glass-surface glass-surface-hover group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-green-500/20"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">WhatsApp</p>
              <p className="text-sm font-medium text-green-400">+880 1843253599</p>
            </div>
          </a>

          <a
            href="mailto:cartorymain@gmail.com?subject=Work%20with%20me%20-%20Roastify%20AI"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-surface glass-surface-hover group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-flame-orange/30"
            style={{ boxShadow: "inset 0 0 0 1px var(--stroke-subtle)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-orange/10 text-flame-orange group-hover:bg-flame-orange/20 transition-colors">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Let's Collaborate</p>
              <p className="text-sm font-semibold text-flame-orange">Work with me</p>
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
          className="glass-surface rounded-2xl p-8 text-center"
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
