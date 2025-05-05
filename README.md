# Studentu Uzdevumu Pārvaldnieks

## Priekšnosacījumi
```bash
- Node.js (>=14.x)
- npm
- SQLite
```
## Instalēšana

1. Klonējiet repozitoriju:
   ```bash
   git clone <repo_url>
   cd <repo_folder>
2. Instalējiet librariesd:

   ```bash
   npm install
   ```

## Datubāzes inicializācija

Datubāze tiks automātiski izveidota un inicializēta pie palaišanas, izmantojot `db.js`.

## Datu bāzes fails

Datubāze tiks izveidota failā `student_task_manager.db` saknes direktorijā.

## Palaišana

Lai palaistu serveri:

```bash
npm start
```

Pēc tam apmeklējiet `http://localhost:3000` pārlūkā.

## Izstrādes režīms

Ja vēlaties izstrādāt:

```bash
npm install -g nodemon
nodemon app.js
```

## Tēmas un pielāgošana

Projekts izmanto Bootswatch Darkly tēmu. CSS ielāde atrodas `<head>` sadaļā HTML failos.

## Struktūra

```
/
├── app.js
├── db.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── public/
│   ├── index.html
│   ├── login.html
│   └── dashboard.html
├── package.json
└── student_task_manager.db
```

## Autors
```bash
Martins Viļumsons
