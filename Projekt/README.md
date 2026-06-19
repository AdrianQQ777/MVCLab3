# System aukcyjny REST + MVC/MVT

## Spis treści

* [Technologie](#technologie)
* [Uruchomienie lokalne](#uruchomienie-lokalne)
* [Uruchomienie backendu przez Docker](#3-uruchomienie-backendu-przez-docker)
* [Linki do chmury](#linki-do-chmury)
* [Część MVC / MVT](#część-mvc--mvt)
* [Zaimplementowane funkcjonalności MVC/MVT](#zaimplementowane-funkcjonalności-mvcmvt)
* [Struktura MVC/MVT](#struktura-mvcmvt)
* [Adresy lokalne](#adresy-lokalne)



Celem projektu jest implementacja systemu aukcyjnego opartego o Django REST Framework oraz klasyczne widoki MVC/MVT w Django. Aplikacja umożliwia obsługę aukcji przez REST API oraz przez widoki HTML dostępne z poziomu przeglądarki.


## Technologie

- Backend: Django REST Framework  
- Frontend: React  
- Baza danych: SQLite
- Dokumentacja API: Swagger / Redoc
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
* Otwórz stronę http://localhost:5173/MVCLab3/
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

## Linki do chmury

GitHub Actions realizuje automatyczne wdrożenie: każdy commit do `main` aktualizuje backend i frontend w chmurze pod następującymi linkami:

- 🔗 Backend (API): https://mvclab3.onrender.com/api/users/
- 🔗 Frontend: https://adrianqq777.github.io/MVCLab3/
- 🔗 Backend MVC/MVT: https://mvclab3.onrender.com/auctions/


## Część MVC / MVT

Projekt został rozbudowany o klasyczne widoki HTML zgodne z podejściem MVC/MVT w Django.

Aplikacja posiada dwie części:

* REST API dostępne pod adresem `/api/`
* widoki HTML MVC/MVT dostępne pod adresem `/auctions/`

### Zaimplementowane funkcjonalności MVC/MVT

* wyświetlanie listy aukcji,
* dodawanie nowej aukcji przez formularz,
* wyświetlanie szczegółów aukcji,
* edycja aukcji,
* usuwanie aukcji,
* składanie ofert/licytowanie,
* automatyczna aktualizacja aktualnej ceny aukcji po złożeniu oferty,
* historia ofert dla aukcji,
* filtrowanie aukcji po kategorii i statusie,
* wyszukiwanie aukcji po nazwie lub opisie,
* sortowanie aukcji po cenie oraz dacie zakończenia,
* walidacja formularzy po stronie serwera,
* ostylowane widoki HTML z użyciem Bootstrap.

### Struktura MVC/MVT

* Model: `Auction`, `Bid`
* Widoki HTML: pliki w folderze `auctions/templates/auctions/`
* Kontrolery/logika widoków: funkcje w pliku `auctions/views.py`
* Formularze i walidacja: `auctions/forms.py`
* Routing stron HTML: `auctions/page_urls.py`

### Adresy lokalne

Po uruchomieniu backendu:

```bash
python manage.py runserver
```

część MVC/MVT jest dostępna pod adresem:

```text
http://127.0.0.1:8000/auctions/
```

REST API pozostaje dostępne pod adresem:

```text
http://127.0.0.1:8000/api/auctions/
```
