import { useLanguage } from "@/lib/i18n";

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 px-4 py-10 text-center">
      <p className="mb-3 text-sm font-semibold fire-gradient-text">
        {t("footer.tagline")}
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="hover:text-flame-orange transition-colors">Privacy Policy</a>
        <span className="text-border">·</span>
        <a href="#" className="hover:text-flame-orange transition-colors">Terms</a>
      </div>
    </footer>
  );
};

export default FooterSection;
