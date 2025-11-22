# CoilFlow - Steel Coil Tracking System

A modern web application for tracking steel coils through a factory's shipping workflow. Built with NestJS (backend) and React (frontend) with TypeScript.

## Features

- **Load Management**: Track loads scheduled for today, tomorrow, or any date
- **Coil Tracking**: Monitor coil status (WIP, RTS, scrap, on-hold, rework)
- **Location Mapping**: Visual factory map with 4 sections, 4 columns × 6 rows grid
- **Real-time Status**: Automatic load status calculation based on coil readiness
- **Smart Parsing**: Flexible location code parser (e.g., "30305" → Section 3, Column 3, Row 5)
- **Dashboard**: Quick overview with load cards showing ready/missing status
- **Statistics**: Historical reporting with customizable date ranges

## Business Rules

### Load Ready Status

A load is considered **READY** if:
- All assigned coils have status = `RTS` (Ready To Ship)
- All assigned coils are located in **Section 3** (dock area)

Otherwise, the load is marked as **MISSING**.

When a load is manually set to **SHIPPED**, it is marked as shipped and timestamps are recorded.

### Unassigned Scheduled Coils

Coils with `scheduled_for_date` set but `load_id = NULL` appear in the Tomorrow page as "pending/unassigned" coils ready to be assigned to a load.

### Location Parsing

The system supports flexible location codes:
- **5-digit format**: `30305` → Section 3, Column 03, Row 05
- **3-digit format**: `126` → Section 1, Column 2, Row 6
- **Special codes**: Single-line identifiers (e.g., packaging lines)

Parsed components (section, column, row) are automatically extracted and stored.

### Card Coloring (UI)

- **Green dot**: All coils are RTS and in Section 3 → Load is ready
- **Red dot**: Any coil is not RTS or not in Section 3 → Load is missing items
- **Grey background**: Load status = 'shipped'

## Project Structure

```
CoilFlow/
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── loads/       # Load management
│   │   │   ├── coils/       # Coil tracking
│   │   │   ├── locations/   # Factory map & sections
│   │   │   └── stats/       # Dashboard & statistics
│   │   ├── common/
│   │   │   ├── enums.ts     # Status enums
│   │   │   ├── db.module.ts # Database config
│   │   │   └── location-parser.ts # Location parsing logic
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── ormconfig.ts
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── LoadCard.tsx
│   │   │   ├── LoadGrid.tsx
│   │   │   ├── CoilList.tsx
│   │   │   └── LocationMap.tsx
│   │   ├── pages/           # Main pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TodayLoads.tsx
│   │   │   ├── TomorrowLoads.tsx
│   │   │   ├── Coils.tsx
│   │   │   ├── Locations.tsx
│   │   │   └── Stats.tsx
│   │   ├── api/
│   │   │   ├── axios.ts     # API client
│   │   │   └── queries.ts   # React Query hooks
│   │   ├── styles/
│   │   │   └── tailwind.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Database Schema

### Tables

**loads**
- `id` (UUID, PK)
- `load_number` (INT, unique per day)
- `customer_name` (VARCHAR)
- `scheduled_time` (TIME)
- `status` (ENUM: 'ready', 'missing', 'shipped')
- `created_for_date` (DATE)
- `created_at`, `updated_at`, `shipped_at`

**coils**
- `id` (UUID, PK)
- `coil_id` (VARCHAR, UNIQUE) - Factory ID
- `width` (INT) - inches
- `weight` (INT) - lbs
- `status` (ENUM: 'WIP', 'RTS', 'scrap', 'onhold', 'rework')
- `location` (VARCHAR) - Raw code (e.g., "30305")
- `section`, `column`, `row` (INT) - Parsed components
- `scheduled_for_date` (DATE)
- `load_id` (UUID, FK)
- `created_at`, `updated_at`

**locations**
- `id` (UUID, PK)
- `section`, `column`, `row` (INT)
- `type` (ENUM: 'storage', 'dock', 'line', 'packaging', 'slitter')
- `description` (TEXT)

**sections_meta**
- `id` (UUID, PK)
- `section_no` (INT) - 1 to 4
- `name` (VARCHAR)
- `position_x`, `position_y` (INT) - UI coordinates
- `notes` (TEXT)

### Relationships

- `loads` (1) → (N) `coils` via `coils.load_id`
- Coils reference locations via parsed `section`, `column`, `row`

## API Endpoints

### Loads

- `GET /api/loads?date=YYYY-MM-DD` - List loads for a date
- `GET /api/loads/today` - Today's loads
- `GET /api/loads/tomorrow` - Tomorrow's loads
- `GET /api/loads/:id` - Load details with coils
- `POST /api/loads` - Create load
- `PUT /api/loads/:id` - Update load
- `POST /api/loads/:id/assign-coil` - Assign coil to load
- `POST /api/loads/:id/unassign-coil` - Unassign coil
- `DELETE /api/loads/:id` - Delete load

### Coils

- `GET /api/coils?query=...` - Search coils
- `GET /api/coils/unassigned?date=YYYY-MM-DD` - Unassigned scheduled coils
- `GET /api/coils/:id` - Coil details
- `POST /api/coils` - Create coil
- `PUT /api/coils/:id` - Update coil
- `DELETE /api/coils/:id` - Delete coil

### Locations

- `GET /api/locations/sections` - Get sections metadata
- `GET /api/locations/:section/grid` - Get section grid occupancy

### Dashboard & Stats

- `GET /api/dashboard/today` - Dashboard data with load cards
- `GET /api/stats/summary?from=...&to=...&groupBy=week|month|year` - Statistics

## Setup & Installation

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- MySQL 8.0+ (or use Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CoilFlow
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MySQL database on port 3306
   - Backend API on port 3001
   - Frontend UI on port 3000

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

4. **Initialize sections metadata** (automatic on first startup)
   The backend automatically creates default section metadata on startup.

### Local Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

### Environment Variables

**Backend (.env)**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=coilflow
DB_PASSWORD=coilflow123
DB_NAME=coilflow
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
```

## Usage

### 1. Dashboard (Entry Page)

- View quick stats: Total loads, ready loads, missing loads
- Browse load cards showing last 4 digits, customer, time, status
- Click a card to see load details and coil list
- Color-coded status dots (green/red/grey)

### 2. Today Loads

- Full list of today's loads with expandable coil details
- Edit load times, assign/unassign coils

### 3. Tomorrow Loads

- View tomorrow's scheduled loads
- See unassigned coils that need to be assigned to loads
- Create new loads for tomorrow

### 4. Coils Page

- Search by coil ID
- Filter by status (WIP, RTS, scrap, etc.)
- View location and load assignments
- Edit coil properties

### 5. Locations Map

- Visual factory map with 4 sections
- Default focus on Section 3 (dock)
- 4 columns × 6 rows grid per section
- Color-coded cells showing coil occupancy
- Hover to see coil IDs

### 6. Statistics (On-Demand)

- Select date range and grouping (week/month/year)
- View total coils, trucks shipped, scrap counts
- Period breakdown tables

## Customization

### Changing Location Parsing Rules

Edit `backend/src/common/location-parser.ts` to modify how location codes are parsed.

### Changing Section Layout

The factory layout is defined in `sections_meta` table. Modify coordinates and names:

```sql
UPDATE sections_meta SET position_x = 0, position_y = 0 WHERE section_no = 1;
```

Or update via backend initialization in `locations.service.ts`.

### Adjusting Grid Size

Default is 4 columns × 6 rows. To change, update:
- `locations.service.ts` grid generation
- `LocationMap.tsx` grid display

## Development Notes

### TypeORM Auto-Sync

The backend uses `synchronize: true` in development. **Disable in production** and use migrations.

### Validation

All DTOs use `class-validator` for input validation:
- Coil width/weight must be > 0
- Coil IDs must be unique
- Scrap coils cannot be assigned to loads

### Status Calculation

Load status is calculated dynamically on each request based on assigned coils. The business logic is in `loads.service.ts` → `calculateLoadStatus()`.

## Troubleshooting

### Database Connection Issues

Ensure MySQL is running and credentials in `.env` are correct.

```bash
docker-compose logs mysql
```

### Backend Won't Start

Check backend logs:
```bash
docker-compose logs backend
```

Ensure database is healthy before backend starts (docker-compose handles this via healthcheck).

### Frontend API Errors

Verify backend is running and `VITE_API_URL` in frontend `.env` is correct.

### Port Conflicts

If ports 3000, 3001, or 3306 are in use, modify `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Frontend on port 8080 instead
```

## Production Deployment

1. **Disable TypeORM sync**
   ```typescript
   synchronize: false,  // in ormconfig.ts
   ```

2. **Use migrations**
   ```bash
   npm run typeorm migration:generate
   npm run typeorm migration:run
   ```

3. **Set production environment variables**
   - Strong database passwords
   - HTTPS URLs
   - Disable CORS for specific origins

4. **Build for production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Review business rules section above
- Check API documentation

---

**Built with ❤️ for efficient steel coil management**
