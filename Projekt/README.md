# REST_Project


Celem projektu jest implementacja rozproszonego systemu aukcyjnego opartego o architekturę REST, umożliwiającego komunikację między frontendem i backendem poprzez API.


## Technologie

- Backend: Django REST Framework  
- Frontend: React  
- Baza danych: SQLite
- Dokumentacja API: (będzie dodano)
- Docker: używany do uruchamiania backendu  
- Wdrożenie w chmurze:
  - backend: Render
  - frontend: GitHub Pages  

 

## Uruchomienie lokalne

### 1. Backend

```bash
cd backend/auction_system
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Przykład backendu po uruchomieniu:

* Otwórz stronę http://127.0.0.1:8000/api/users/
* Do pola **Content** dodaj:

```json
{
  "email": "test@example.com",
  "name": "John Doe",
  "password": "12345678"
}
```
* Naciśnij "Post"


### 2. Frontend

Przed uruchomieniem frontendu lokalnie należy utworzyć plik `.env` w folderze `frontend` na podstawie pliku `.env.example`.

```
cd frontend
npm install
npm run dev
```

Przykład frontendu po uruchomieniu:
* Otwórz stronę http://localhost:5173/REST_Project/
* Sprawdź, czy frontend działa poprawnie


### 3. Uruchomienie backendu przez Docker

Uruchomienie backendu przez Docker nie jest wymagane do działania projektu.  
Jest to jedynie dodatkowa możliwość uruchomienia aplikacji w kontenerze.

```bash
cd backend/auction_system
docker build -t auction-backend .
docker run -p 8000:8000 auction-backend
```

Przykład backendu po uruchomieniu przez Docker:

* Otwórz stronę:
  http://127.0.0.1:8000/api/users/

* Do pola **Content** dodaj:

```json
{
  "email": "test@example.com",
  "name": "John Doe",
  "password": "12345678"
}
```
* Naciśnij "Post"

## Linki do chmurzy

GitHub Actions realizuje automatyczne wdrożenie: każdy commit do `main` aktualizuje backend i frontend w chmurze po następnych linkach:

- 🔗 Backend (API): https://rest-project-backend.onrender.com/api/
- 🔗 Frontend: https://anahoreth1.github.io/REST_Project/
