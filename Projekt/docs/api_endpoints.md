# API Endpoints



## Overview

Backend udostępnia REST API służące do obsługi użytkowników, aukcji oraz licytacji. Endpointy zwracają dane w formacie JSON i korzystają z metod HTTP takich jak `GET`, `POST`, `PUT`, `PATCH` oraz `DELETE`.

Główna ścieżka API zaczyna się od prefiksu:

```text
/api/
```



## Users

Endpointy użytkowników służą do tworzenia, pobierania, edycji oraz usuwania użytkowników.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/` | Pobiera listę użytkowników. |
| `POST` | `/api/users/` | Tworzy nowego użytkownika. |
| `GET` | `/api/users/{user_id}/` | Pobiera dane jednego użytkownika na podstawie jego ID. |
| `PUT` | `/api/users/{user_id}/` | Aktualizuje dane użytkownika. |
| `DELETE` | `/api/users/{user_id}/` | Usuwa użytkownika. |



### User request example

Przykładowe dane wysyłane podczas tworzenia użytkownika:

```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "password": "password123"
}
```



### User response example

Przykładowa odpowiedź API:

```json
{
  "id": 1,
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "created_at": "2026-05-16T12:00:00Z"
}
```



## Auctions

Endpointy aukcji służą do zarządzania aukcjami. Umożliwiają tworzenie aukcji, pobieranie ich listy, edycję oraz usuwanie.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auctions/` | Pobiera listę aukcji. |
| `POST` | `/api/auctions/` | Tworzy nową aukcję. |
| `GET` | `/api/auctions/{id}/` | Pobiera szczegóły jednej aukcji. |
| `PUT` | `/api/auctions/{id}/` | Aktualizuje dane aukcji. |
| `DELETE` | `/api/auctions/{id}/` | Usuwa aukcję. |



### Auction filtering

Lista aukcji może być filtrowana za pomocą parametrów w adresie URL.

| Parameter | Example | Description |
|---|---|---|
| `category` | `/api/auctions/?category=electronics` | Zwraca aukcje z wybranej kategorii. |
| `status` | `/api/auctions/?status=active` | Zwraca aukcje o wybranym statusie. |

Parametry można łączyć:

```text
/api/auctions/?category=electronics&status=active
```



### Auction request example

Przykładowe dane wysyłane podczas tworzenia aukcji:

```json
{
  "name": "Laptop",
  "description": "Laptop w dobrym stanie",
  "category": "electronics",
  "starting_price": "1000.00",
  "start_date": "2026-05-16T12:00:00Z",
  "end_date": "2026-05-20T12:00:00Z",
  "owner_id": 1,
  "status": "active"
}
```

Pole `current_price` jest ustawiane na podstawie ceny wywoławczej podczas tworzenia aukcji.



### Auction response example

Przykładowa odpowiedź API:

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Laptop w dobrym stanie",
  "category": "electronics",
  "starting_price": "1000.00",
  "current_price": "1000.00",
  "start_date": "2026-05-16T12:00:00Z",
  "end_date": "2026-05-20T12:00:00Z",
  "owner_id": 1,
  "status": "active"
}
```



## Bids

Endpoint licytacji służy do składania ofert w konkretnej aukcji.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auctions/{auction_id}/bids/` | Składa nową ofertę w wybranej aukcji. |



### Bid rules

Podczas składania oferty backend sprawdza następujące warunki:

- aukcja musi istnieć,
- aukcja nie może mieć statusu `ended`,
- kwota oferty musi być większa od aktualnej ceny aukcji,
- poprawna oferta zostaje zapisana jako nowy rekord `Bid`,
- po poprawnej ofercie pole `current_price` aukcji zostaje zaktualizowane.



### Bid request example

Przykładowe dane wysyłane podczas składania oferty:

```json
{
  "amount": "1200.00"
}
```

Identyfikator aukcji nie jest wysyłany w body requesta, ponieważ znajduje się w adresie endpointu:

```text
/api/auctions/{auction_id}/bids/
```



### Bid response example

Przykładowa odpowiedź po poprawnym złożeniu oferty:

```json
{
  "id": 1,
  "auction": 1,
  "amount": "1200.00",
  "created_at": "2026-05-16T12:30:00Z"
}
```



## API Documentation

Projekt posiada automatycznie generowaną dokumentację API przy użyciu Swagger/OpenAPI.

| View | Endpoint | Description |
|---|---|---|
| Swagger UI | `/api/docs/` | Interaktywna dokumentacja API. |
| OpenAPI Schema | `/api/schema/` | Surowy schemat OpenAPI. |
| ReDoc | `/api/redoc/` | Alternatywny widok dokumentacji API. |

Swagger UI pozwala przeglądać endpointy, sprawdzać wymagane pola oraz testować zapytania bezpośrednio z poziomu przeglądarki.



## Common HTTP Status Codes

API zwraca standardowe kody odpowiedzi HTTP.

| Status Code | Meaning |
|---|---|
| `200 OK` | Żądanie zakończyło się sukcesem. |
| `201 Created` | Utworzono nowy zasób, np. użytkownika, aukcję lub ofertę. |
| `204 No Content` | Zasób został usunięty i odpowiedź nie zawiera treści. |
| `400 Bad Request` | Dane wejściowe są niepoprawne. |
| `404 Not Found` | Zasób o podanym ID nie istnieje. |
| `500 Internal Server Error` | Wystąpił błąd po stronie serwera. |