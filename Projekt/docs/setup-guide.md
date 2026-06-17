# Setup Guide



## Overview

Projekt składa się z dwóch części: backendu oraz frontendu. Backend udostępnia REST API w Django REST Framework, a frontend komunikuje się z nim przez endpointy API.



## Requirements

Do uruchomienia projektu lokalnie potrzebne są:

- Python
- pip
- Node.js
- npm
- Git



## Backend

Przejdź do folderu backendu:

```bash
cd backend/auction_system
```

Utwórz i aktywuj środowisko wirtualne:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Zainstaluj zależności:

```bash
pip install -r requirements.txt
```

Wykonaj migracje:

```bash
python manage.py migrate
```

Uruchom backend:

```bash
python manage.py runserver
```

Backend będzie dostępny pod adresem:

```text
http://127.0.0.1:8000/
```

Dokumentacja API:

```text
http://127.0.0.1:8000/api/docs/
```



## Frontend

Przejdź do folderu frontendu:

```bash
cd frontend
```

Zainstaluj zależności:

```bash
npm install
```

Uruchom frontend:

```bash
npm run dev
```

Frontend będzie dostępny pod adresem pokazanym w terminalu, najczęściej:

```text
http://localhost:5173/
```



## Tests

Aby uruchomić testy backendu, przejdź do folderu `backend/auction_system` i użyj:

```bash
python manage.py test
```

Testy wybranej aplikacji:

```bash
python manage.py test users
python manage.py test auctions
```



## Cloud

Projekt może być uruchamiany także w chmurze. Frontend może być publikowany przez GitHub Pages, a backend przez Render. Lokalne adresy `127.0.0.1` oraz `localhost` należy wtedy zastąpić adresami usług wdrożonych w chmurze.