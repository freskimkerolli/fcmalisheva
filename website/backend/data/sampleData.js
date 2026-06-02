const players = [
  {
    id: "1",
    name: "Arbër Rexhepi",
    position: "Sulmues",
    number: 9,
    photo: "/assets/Malisheva1.jpg",
    nationality: "Kosovare",
    birthDate: "1998-03-12",
    height: "182 cm",
    weight: "76 kg",
  },
  {
    id: "2",
    name: "Besim Krasniqi",
    position: "Mbrojtës",
    number: 4,
    photo: "/assets/Malisheva2.jpg",
    nationality: "Kosovare",
    birthDate: "1996-07-05",
    height: "185 cm",
    weight: "80 kg",
  },
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
    name: "Krenar Gashi",
    role: "Asistent Trajneri",
    email: "krenar.gashi@fcmalisheva.com",
    photo: "/assets/Malisheva3.jpg",
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
  {
    date: "2026-05-18",
    opponent: "Drita",
    score: "1-0",
    competition: "Superliga",
    venue: "Fushë e Joshtme",
  },
  {
    date: "2026-05-11",
    opponent: "Arbëria",
    score: "2-2",
    competition: "Superliga",
    venue: "Fushë e Jashtme",
  },
];

const table = [
  { position: 1, team: "Gjilani", points: 63, played: 32 },
  { position: 2, team: "Ballkani", points: 60, played: 32 },
  { position: 3, team: "FC Malisheva", points: 55, played: 32 },
];

module.exports = { players, staff, gallery, results, table };
