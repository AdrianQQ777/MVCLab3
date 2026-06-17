#Architecture



### Backend

Backend został przygotowany w Django oraz Django REST Framework. Jego głównym zadaniem jest udostępnianie REST API, z którego korzysta frontend. API umożliwia obsługę użytkowników, aukcji oraz składanie ofert w licytacjach.

Backend przyjmuje żądania HTTP, waliduje dane wejściowe, wykonuje logikę biznesową i zwraca odpowiedzi w formacie JSON. Przykładowo, podczas składania oferty backend sprawdza, czy aukcja istnieje, czy nie została zakończona oraz czy nowa oferta jest wyższa od aktualnej ceny.

Kod backendu jest podzielony na aplikacje Django. Aplikacja `users` odpowiada za operacje związane z użytkownikami, takie jak dodawanie, pobieranie, edycja i usuwanie użytkowników. Aplikacja `auctions` odpowiada za zarządzanie aukcjami oraz obsługę licytacji.

Dane są zapisywane w bazie SQLite. Komunikacja z bazą odbywa się przez Django ORM, dzięki czemu modele Django reprezentują tabele w bazie danych.

Typowy przepływ żądania w backendzie wygląda następująco:

Frontend → URL routing → widok API → serializer → model/baza danych → odpowiedź JSON



## Frontend

Frontend odpowiada za interfejs użytkownika oraz prezentację danych pobieranych z backendu. Został przygotowany jako osobna część aplikacji i komunikuje się z backendem przez REST API.

Użytkownik wykonuje akcje w interfejsie, takie jak przeglądanie aukcji, dodawanie danych lub składanie ofert. Frontend wysyła odpowiednie żądania HTTP do backendu, a następnie wyświetla odpowiedzi otrzymane w formacie JSON.

Frontend nie komunikuje się bezpośrednio z bazą danych. Wszystkie operacje na danych przechodzą przez backend, który odpowiada za walidację, logikę biznesową i zapis danych.



## Database

Dane aplikacji są przechowywane w bazie SQLite wykorzystywanej podczas lokalnego uruchamiania projektu. Struktura bazy danych jest definiowana przez modele Django.

Główne modele systemu to `User`, `Auction` oraz `Bid`. Model `User` przechowuje dane użytkowników, model `Auction` przechowuje informacje o aukcjach, a model `Bid` przechowuje historię ofert składanych w aukcjach.

Relacja między aukcją a ofertami jest zrealizowana w taki sposób, że jedna aukcja może posiadać wiele ofert. Każda oferta należy do jednej konkretnej aukcji.



## Comunication

Komunikacja między frontendem a backendem odbywa się przez REST API. Frontend wysyła żądania HTTP do endpointów udostępnionych przez backend, a backend zwraca odpowiedzi w formacie JSON.

Typowy przepływ żądania wygląda następująco:

Frontend → REST API → widok Django REST Framework → serializer → model/baza danych → odpowiedź JSON

Serializery odpowiadają za walidację danych wejściowych oraz zamianę obiektów Django na dane JSON zwracane w odpowiedziach API.



## API Documentation

Dokumentacja API jest generowana automatycznie przy użyciu narzędzia `drf-spectacular`. Dzięki temu endpointy backendu są dostępne w formie interaktywnej dokumentacji Swagger UI oraz w widoku ReDoc.

Swagger UI pozwala przeglądać dostępne endpointy, sprawdzać wymagane parametry oraz testować zapytania bezpośrednio z poziomu przeglądarki. ReDoc zapewnia alternatywny, czytelny widok dokumentacji API.

Dokumentacja jest dostępna pod adresami:

- `/api/docs/` — Swagger UI
- `/api/schema/` — schemat OpenAPI
- `/api/redoc/` — ReDoc



## Deployment

Projekt wykorzystuje GitHub Actions do automatyzacji wybranych zadań związanych z budowaniem i wdrażaniem aplikacji. Konfiguracja workflow znajduje się w katalogu `.github/workflows/`.

Frontend może być publikowany przez GitHub Pages. Workflow GitHub Actions buduje aplikację frontendową i publikuje wygenerowane pliki statyczne jako stronę projektu.

Backend może być wdrażany na zewnętrznej platformie chmurowej, np. Render. Wersja chmurowa backendu udostępnia te same endpointy API co środowisko lokalne, ale pod publicznym adresem URL.

Lokalnie frontend i backend uruchamiane są osobno. Frontend komunikuje się z backendem przez REST API.