Training Log backend

Käivitamine:
- cd server
- npm install
- npm start

Server töötab aadressil http://localhost:3000

Endpointid:
- GET /api/items - kõik oma kirjed
- GET /api/items?search=midagi - otsing harjutuse nime järgi
- POST /api/items - uus kirje, keha { "exercise": "midagi", "reps": 20 }
- DELETE /api/items/:id - kustutab oma kirje


Reeglid:
- exercise 1-60 märki
- reps täisarv 1-500

Vastused:
- 200 ok
- 201 loodud
- 204 kustutatud
- 400 vale sisend
- 401 token puudub või vale
- 404 kirjet ei leitud
- 500 serveri viga
