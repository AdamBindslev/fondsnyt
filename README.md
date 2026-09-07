# FONDSNYT — Automatiseret Fondsovervågningsdashboard (Danmark & EU)

Et moderne, remote-hostbart overvågningsdashboard og fundraising-arbejdsredskab bygget på den 3-lagede hybridmodel over danske og europæiske fonde, tilskudspuljer og tidsfrister.

Designet med et **lyst, funktionelt nordisk udtryk** og **tydelige signalfarver**, optimeret specifikt til strategisk og operationelt fundraisingarbejde.

---

## 🎨 Lyst Nordisk Design & Signalfarver

Dashboardet anvender en skarp, minimalistisk skandinavisk æstetik med tydelig prioritering:
* 🔴 **Akutte frister (< 14 dage):** Signalrød (`badge-urgent`) – kræver øjeblikkelig færdiggørelse og indsendelse.
* 🟡 **Næste frister (14–30 dage):** Ravfarvet/gylden (`badge-warning`) – aktiv fase for udarbejdelse af bilag og budget.
* 🟢 **God tid (> 30 dage):** Salviegrøn (`badge-calm`) – research- og strategiplanlægning.
* 🔵 **Løbende behandling:** Nordisk fjordblå (`badge-ongoing`) – først-til-mølle eller ugentlige/månedlige bevillinger.
* 🟣 **EU & Internationale programmer:** Dæmpet violet (`badge-eu`) – Creative Europe, Erasmus+, Horizon.

---

## 🚀 Hovedfunktioner

1. **📊 Oversigt & Signalkalender:**
   * Nøgletal over akutte deadlines, løbende puljer og samlet søgt beløb.
   * Tidslinje sorteret direkte efter færrest resterende dage til deadline.
2. **📑 Fonds- & Puljekatalog:**
   * Multi-filtrering på tværs af kategorier (Kultur, Scenekunst, Billedkunst, Musik, Social, Fællesskab, Byrum, Forskning m.fl.).
   * Geografisk afgrænsning (Danmark vs. EU) og beløbsintervaller.
   * Direkte links til officielle ansøgningsportaler og hurtig-tilføjelse til egen pipeline.
3. **🎯 Match mit Projekt (Intelligent AI Assistent):**
   * Indtast projekttitel, formål, målgruppe og budget.
   * Systemet beregner match-score (0-100%), fremhæver match-styrker og giver **konkrete råd til hvad du skal betone i ansøgningen**.
   * Indbyggede test-cases for hurtig afprøvning.
4. **📌 Min Fundraising Pipeline (Arbejdsbord):**
   * Kanban-oversigt over dine sager (Idéfase 💡 ➔ Under udarbejdelse ✍️ ➔ Indsendt 🚀 ➔ Bevilget 🎉 ➔ Afslået ❌).
   * Automatisk opsummering af samlet søgt beløb og hjemtaget finansiering.
5. **🛰️ Kildeovervågning (Den 3-lagede Hybridmodel):**
   * **Lag 1:** Åbne API'er & JSON endpoints (Statens-tilskudspuljer, Slots- og Kulturstyrelsen, EU Tenders).
   * **Lag 2:** Scraping & SHA-256 diff-detection (Nordea-fonden, Bikubenfonden, Tuborgfondet, Realdania m.fl.).
   * **Lag 3:** CVR-register overvågning for nye fondsstiftelser.
   * Interaktiv knap til øjeblikkelig kørsel af synkronisering og hash-kontrol.

---

## 🛠️ Teknisk Arkitektur

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
* **Database & ORM:** Drizzle ORM med SQLite lokalt (plug-and-play uden opsætning) og forberedt til Supabase / PostgreSQL.
* **Scraping & Diff:** SHA-256 hashing af renset indhold for at eliminere redundante LLM-kald.

---

## 💻 Kom i gang lokalt

```bash
# 1. Klon eller naviger til mappen
cd Fondsnyt

# 2. Installer afhængigheder (allerede udført)
npm install

# 3. Seed databasen med fonde og puljer (allerede udført)
npm run db:seed

# 4. Start udviklingsserveren
npm run dev
```

Dashboardet er nu tilgængeligt på `http://localhost:3000`.

---

## 🌐 Remote Hosting Vejledning

Løsningen kan deployes remote på flere måder:

### Mulighed 1: Vercel + Supabase (Anbefalet)
1. Opret et tomt projekt på [Supabase](https://supabase.com) (gratis tier giver hosted PostgreSQL).
2. Forbind dit GitHub-repo til [Vercel](https://vercel.com).
3. Tilføj dine miljøvariabler i Vercel:
   * `DATABASE_URL`: Din Supabase connection string.
   * `GEMINI_API_KEY` eller `OPENAI_API_KEY` (valgfrit).
4. Tryk **Deploy** – Vercel bygger og optimerer applikationen automatisk.

### Mulighed 2: Docker / Railway / Render
Projektet indeholder en produktionsklar `Dockerfile`:
```bash
# Byg container
docker build -t fondsnyt-dashboard .

# Kør container
docker run -p 3000:3000 -v $(pwd)/data:/app/data fondsnyt-dashboard
```
Eller benyt `docker-compose up -d`. Databasen gemmes sikkert i det mountede `data/` volumen.
