const players = [
  { id: "1",  name: "Arlind Veliu",          position: "Mbrojtës i Majtë",    number: 2,  photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2001-06-14", height: "", weight: "" },
  { id: "2",  name: "Omer Bajraktari",        position: "Mbrojtës i Majtë",    number: 3,  photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2007-06-09", height: "", weight: "" },
  { id: "3",  name: "Dreni Kryeziu",          position: "Qendërmbrojtës",      number: 5,  photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "1996-04-15", height: "", weight: "" },
  { id: "4",  name: "Besnik Ferati",          position: "Mesfushor Mbrojtës",  number: 6,  photo: "/assets/player_placeholder.jpg", nationality: "Maqedonas V.",  birthDate: "2000-04-19", height: "", weight: "" },
  { id: "5",  name: "Altin Aliu",             position: "Krahësor i Majtë",    number: 7,  photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "1999-11-11", height: "", weight: "" },
  { id: "6",  name: "Krenar Dulaj",           position: "Sulmues Qendror",     number: 9,  photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2006-04-24", height: "", weight: "" },
  { id: "7",  name: "Etnik Brruti",           position: "Mesfushor Qendror",   number: 10, photo: "/assets/player_placeholder.jpg", nationality: "Shqiptar",       birthDate: "2004-03-04", height: "", weight: "" },
  { id: "8",  name: "Rilind Hetemi",          position: "Mesfushor Qendror",   number: 11, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2002-02-11", height: "", weight: "" },
  { id: "9",  name: "Flamur Gashi",           position: "Portier",             number: 12, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2000-06-06", height: "", weight: "" },
  { id: "10", name: "Laurent Xhylani",        position: "Krahësor i Majtë",    number: 14, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2004-09-23", height: "", weight: "" },
  { id: "11", name: "Valmir Nafiu",           position: "Krahësor i Djathtë",  number: 18, photo: "/assets/player_placeholder.jpg", nationality: "Maqedonas V.",  birthDate: "1994-04-23", height: "", weight: "" },
  { id: "12", name: "Emir Zogaj",             position: "Mesfushor Qendror",   number: 19, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2004-09-02", height: "", weight: "" },
  { id: "13", name: "Arbër Pira",             position: "Mbrojtës i Djathtë",  number: 20, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "1995-02-09", height: "", weight: "" },
  { id: "14", name: "Arber Shala",            position: "Mbrojtës i Djathtë",  number: 21, photo: "/assets/player_placeholder.jpg", nationality: "Amerikan",       birthDate: "2004-06-13", height: "", weight: "" },
  { id: "15", name: "Mevlan Zeka",            position: "Sulmues Qendror",     number: 23, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "1994-05-28", height: "", weight: "" },
  { id: "16", name: "Assane Diatta",          position: "Krahësor i Djathtë",  number: 24, photo: "/assets/player_placeholder.jpg", nationality: "Senegalez",     birthDate: "2000-04-05", height: "", weight: "" },
  { id: "17", name: "Riad Jashari",           position: "Mbrojtës i Djathtë",  number: 25, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2004-01-29", height: "", weight: "" },
  { id: "18", name: "Andreas Skovgaard",      position: "Qendërmbrojtës",      number: 27, photo: "/assets/player_placeholder.jpg", nationality: "Danez",          birthDate: "1997-03-27", height: "", weight: "" },
  { id: "19", name: "Robert Mathieu Ndjigi",  position: "Mesfushor Qendror",   number: 28, photo: "/assets/player_placeholder.jpg", nationality: "Kamerunez",      birthDate: "2001-04-12", height: "", weight: "" },
  { id: "20", name: "Donart Vitija",          position: "Mesfushor Mbrojtës",  number: 30, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2000-04-25", height: "", weight: "" },
  { id: "21", name: "Tiago Gomes",            position: "Portier",             number: 31, photo: "/assets/player_placeholder.jpg", nationality: "Brazilian",      birthDate: "2003-01-20", height: "", weight: "" },
  { id: "22", name: "Agon Xhaka",             position: "Qendërmbrojtës",      number: 34, photo: "/assets/player_placeholder.jpg", nationality: "Shqiptar",       birthDate: "1997-06-09", height: "", weight: "" },
  { id: "23", name: "Samuel Opeh",            position: "Qendërmbrojtës",      number: 44, photo: "/assets/player_placeholder.jpg", nationality: "Nigerian",       birthDate: "1998-12-25", height: "", weight: "" },
  { id: "24", name: "Ilir Avdyli",            position: "Portier",             number: 91, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "1990-05-20", height: "", weight: "" },
  { id: "25", name: "Dzemal Ibishi",          position: "Sulmues Qendror",     number: 99, photo: "/assets/player_placeholder.jpg", nationality: "Kosovar",        birthDate: "2001-01-18", height: "", weight: "" },
];

const staff = [
  {
    id: "1",
    name: "Bylbyl Sokoli",
    role: "Trajner Kryesor",
    email: "bylbyl.sokoli@fcmalisheva.com",
    photo: "/assets/Profa.jpg",
  },
  {
    id: "2",
    name: "Latif Bytyçi",
    role: "Asistent Trajneri",
    email: "latif.bytyci@fcmalisheva.com",
    photo: "/assets/LatifBytyqi.jpg",
  },
];

const gallery = [
  "/assets/Malisheva1.jpg",
  "/assets/Malisheva2.jpg",
  "/assets/Malisheva3.jpg",
  "/assets/Malisheva4.jpg",
  "/assets/Malisheva5.jpg",
  "/assets/Malisheva6.jpg",
];

const results = [
  { date: "2026-05-31", matchday: "Java 36", opponent: "Drita",     score: "3-2", competition: "Albi Mall Superliga", isHome: true  },
  { date: "2026-05-24", matchday: "Java 35", opponent: "Llapi",     score: "2-3", competition: "Albi Mall Superliga", isHome: false },
  { date: "2026-05-17", matchday: "Java 34", opponent: "Drenica",   score: "4-1", competition: "Albi Mall Superliga", isHome: true  },
  { date: "2026-05-10", matchday: "Java 33", opponent: "Ferizaj",   score: "1-1", competition: "Albi Mall Superliga", isHome: false },
  { date: "2026-05-02", matchday: "Java 32", opponent: "Prishtina", score: "1-0", competition: "Albi Mall Superliga", isHome: false },
];

const table = [
  { position: 1,  team: "Drita",          played: 36, gd:  15, points: 66 },
  { position: 2,  team: "FC Malisheva",   played: 36, gd:   8, points: 59 },
  { position: 3,  team: "Ballkani",       played: 36, gd:  20, points: 58 },
  { position: 4,  team: "Dukagjini",      played: 36, gd:   6, points: 51 },
  { position: 5,  team: "Gjilani",        played: 36, gd:  -1, points: 51 },
  { position: 6,  team: "Drenica",        played: 36, gd:  -8, points: 50 },
  { position: 7,  team: "Prishtina",      played: 36, gd:   1, points: 49 },
  { position: 8,  team: "Llapi",          played: 36, gd:  -4, points: 49 },
  { position: 9,  team: "Ferizaj",        played: 36, gd: -15, points: 36 },
  { position: 10, team: "Prishtina e Re", played: 36, gd: -21, points: 31 },
];

const announcements = [
  { title: "Fitorja e madhe ndaj Prishtinës", title_en: "Big win against Prishtina", content: "FC Malisheva fitoi me rezultatin 3-1 ndaj Prishtinës në ndeshjen e fundit.", content_en: "FC Malisheva won 3-1 against Prishtina in their latest match.", category: "Ndeshje", category_en: "Match", date_display: "1 qershor 2026" },
  { title: "Lojtari i javës: Albin Rama", title_en: "Player of the week: Albin Rama", content: "Albin Rama u emërua lojtari i javës pas performancës së tij të jashtëzakonshme.", content_en: "Albin Rama was named player of the week after his outstanding performance.", category: "Tima", category_en: "Team", date_display: "31 maj 2026" },
  { title: "Përgatitje për Conference League", title_en: "Conference League preparation", content: "Ekipi përgatitet për ndeshjen e rëndësishme të Conference League këtë javë.", content_en: "The team is preparing for the important Conference League match this week.", category: "Kampionat", category_en: "Championship", date_display: "30 maj 2026" },
];

const upcomingMatch = {
  competition: "Superliga",
  matchday: "Dita 8",
  stadium: "Stadiumi Liman Gegaj",
  home_team: "FC Malisheva",
  home_logo: "/assets/MalishevaLogo.png",
  away_team: "Drita Gjilanë",
  away_logo: "/assets/MalishevaLogo.png",
  match_date: "5 qershor 2026",
  match_time: "19:00",
  ticket_url: "#",
};

const sponsors = [
  { name: "Banka Ekonomike", logo_path: "/assets/Banka_Ekonomike-logo.png", website_url: "#", sort_order: 1 },
  { name: "Dijamant",        logo_path: "/assets/Dijamant.jpg",              website_url: "#", sort_order: 2 },
  { name: "Lanti-B",         logo_path: "/assets/Lanti-B.jpg",               website_url: "#", sort_order: 3 },
  { name: "MuriVinkell",     logo_path: "/assets/MuriVinkell.jpg",           website_url: "#", sort_order: 4 },
  { name: "VPD",             logo_path: "/assets/vpd.png",                   website_url: "#", sort_order: 5 },
  { name: "VSH",             logo_path: "/assets/VSH.png",                   website_url: "#", sort_order: 6 },
];

module.exports = { players, staff, gallery, results, table, announcements, upcomingMatch, sponsors };
