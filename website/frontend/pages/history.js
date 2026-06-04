import { useTranslation } from "../hooks/useTranslation";

export default function History() {
  const { t } = useTranslation();

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{t("history.eyebrow")}</p>
        <h2>{t("history.title")}</h2>
        <p className="section-subtitle">{t("history.subtitle")}</p>
      </section>

      <section className="history-grid">
        <div className="content-block">
          <h3>{t("history.clubTitle")}</h3>
          <p>{t("history.clubText1")}</p>
          <p>{t("history.clubText2")}</p>
        </div>
        <div className="content-block">
          <h3>{t("history.fansTitle")}</h3>
          <p>{t("history.fansText1")}</p>
          <p>{t("history.fansText2")}</p>
        </div>
      </section>
    </>
  );
}
