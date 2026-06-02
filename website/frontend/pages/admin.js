export default function Admin() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h2>Paneli i Administratorit</h2>
        <p className="section-subtitle">
          Një hap i ardhshëm për të menaxhuar lojtarët, stafin dhe rezultatet e
          klubit në mënyrë dinamike.
        </p>
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <h3>Menaxhoni Ekipin</h3>
          <p>Shtoni, redaktoni dhe fshini lojtarë, statistika dhe profila.</p>
        </div>
        <div className="admin-card">
          <h3>Menaxhoni Stafin</h3>
          <p>Rregulloni rolet, kontaktet dhe fotografitë e stafit teknik.</p>
        </div>
        <div className="admin-card">
          <h3>Rezultatet & Tabela</h3>
          <p>
            Vendosni ndeshjet, rezultatet dhe tabelën zyrtare në kohë reale.
          </p>
        </div>
      </section>

      <p className="small-note">
        Për të funksionuar plotësisht, shtoni më vonë një backend admin me
        autentikim dhe menaxhim të të dhënave.
      </p>
    </>
  );
}
