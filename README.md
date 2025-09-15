# Feature Flags & Movie Search System

A microservices system demonstrating feature flag management with real-time updates and a movie search service that respects feature flag states.

## Architecture
<img width="394" height="437" alt="image" src="https://github.com/user-attachments/assets/5ec25d95-1cfb-4c9d-bdbc-d7efdb649dc6" />

**Data Flow:**
1. Feature flags stored in PostgreSQL
2. Flag changes published to Redis pub/sub  
3. Movie service subscribes to flag updates via Redis
4. Movie service calls OMDB API for movie data
5. Frontends make rest api call to their respective backends.

## Tech Stack

**Backend:** Java 17, Spring Boot, PostgreSQL, Redis  
**Frontend:** React, TypeScript, Styled Components  
**Infrastructure:** Docker, Docker Compose

## Quick Start

### Prerequisites
- Docker & Docker Compose
- OMDB API Key ([Get free key](http://www.omdbapi.com/apikey.aspx))

### Setup & Run
```bash
# 1. Clone and configure
git clone https://github.com/anantsangtani/feature-flags-movie-search.git
cd feature-flags-movie-search

# 2. Set your OMDB API key
echo "OMDB_API_KEY=your_api_key_here" >> .env

# 3. Start all services
docker-compose up --build
```

### Access Applications
- **Feature Flags UI**: http://localhost:3000
- **Movie Search UI**: http://localhost:3001  
- **Feature Flag API**: http://localhost:8080/api
- **Movie Search API**: http://localhost:8081/api

## Testing

### Create Feature Flags
```bash
# Create dark_mode flag
curl -X POST http://localhost:8080/api/flags \
  -H "Content-Type: application/json" \
  -d '{"name": "dark_mode", "enabled": true, "description": "Dark theme"}'

# Create maintenance_mode flag  
curl -X POST http://localhost:8080/api/flags \
  -H "Content-Type: application/json" \
  -d '{"name": "maintenance_mode", "enabled": false, "description": "Maintenance mode"}'
```

### Test Real-time Updates
```bash
# Toggle dark mode
curl -X POST http://localhost:8080/api/flags/1/toggle

# Enable maintenance mode (blocks movie search)
curl -X POST http://localhost:8080/api/flags/2/toggle

# Check movie service received updates
curl http://localhost:8081/api/flags/status
```

## Development

### Run Individual Services
```bash
# Start infrastructure
docker-compose up -d postgres redis

# Feature Flag Service
cd feature-flag-service
./mvnw spring-boot:run

# Movie Search Service  
cd movie-search-service
export OMDB_API_KEY=your_key
./mvnw spring-boot:run

# Frontend Applications
cd feature-flag-frontend && npm start    # Port 3000
cd movie-search-frontend && npm start    # Port 3001
```

### Run Tests
```bash
# Backend tests
cd feature-flag-service && ./mvnw test
cd movie-search-service && ./mvnw test

```

## API Endpoints

### Feature Flag Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flags` | List all flags |
| POST | `/api/flags` | Create flag |
| PUT | `/api/flags/{id}` | Update flag |
| DELETE | `/api/flags/{id}` | Delete flag |
| POST | `/api/flags/{id}/toggle` | Toggle flag |

### Movie Search Service  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/search?title={title}` | Search movies |
| GET | `/api/flags/status` | Current flag status |
| POST | `/api/flags/refresh` | Manual flag sync |

## Troubleshooting

### Debug Commands
```bash
# Check service health
curl http://localhost:8080/actuator/health
curl http://localhost:8081/api/health

# View logs
docker-compose logs -f movie-search-service
docker-compose logs -f feature-flag-service

# Test Redis connectivity
docker exec -it feature-flags-redis redis-cli ping
```



---



