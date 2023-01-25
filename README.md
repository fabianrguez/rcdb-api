# 🎢 RCDB REST API

REST API built by scrape [RCDB](https://rcdb.com) website.

## Endpoints

| HTTP VERB | PATH                   | DESCRIPTION                                                                                                                                                   | EXTRA                                                                                                                                    |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`     | `/`, `/api`            | Endpoints information                                                                                                                                         |                                                                                                                                          |
| `GET`     | `/api/coasters`        | Returns coasters information scraped from RCDB                                                                                                                | Pagination is available by using query params offset and limit. If no query params is passed, default values are offset=0 and limit=4000 |
| `GET`     | `/api/coasters/:id`    | Returns coaster data with matched id. If no coaster is found return `404` status code, with response `{message: 'Coaster with :id not found'}`                |                                                                                                                                          |
| `GET`     | `/api/coasters/random` | Returns a random coaster. If no coaster is found return `400` status code, with response `{message: 'Error getting a random coaster}', cause: 'error cause'}` |                                                                                                                                          |
| `GET`     | `/api/coasters/search` | Returns coasters that match with the `q` parameter passed by query params. If no coaster matched a `400` status code, with response `[]`                      |                                                                                                                                          |
