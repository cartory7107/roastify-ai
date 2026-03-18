const FooterSection = () => {
  return (
    <footer className="border-t border-border/50 px-4 py-10 text-center">
      <p className="mb-3 text-sm font-medium text-foreground/60">
        Cartory Roastify AI — Smart Website Analysis Tool
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        <span className="text-border">·</span>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
      </div>
    </footer>
  );
};

export default FooterSection;
