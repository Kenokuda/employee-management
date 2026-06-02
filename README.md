# Employee Management Application

A full-stack employee management application featuring a Ruby on Rails backend API and a React frontend. Designed with secure architecture and multilingual support.

## 🚀 Features

- **Employee Management**: CRUD operations, custom status toggles (Active/Retired), and role assignments.
- **Project Tracking**: Multi-project assignment using a secure many-to-many relationship (`EmployeeProject`).
- **Interactive UI**: Dark mode toggle, dynamic table sorting (ID, Name, Department, etc.), and multi-language support (English/Japanese).
- **Secure API**: Protected by Rails Strong Parameters to prevent Mass Assignment vulnerabilities.

## 🛠️ Tech Stack

### Backend

- **Framework**: Ruby on Rails 7+ (API mode)
- **Database**: PostgreSQL
- **Key Architecture**: Strong Parameters, `includes` queries for avoiding N+1 problems.

### Frontend

- **Library**: React 18+ (Vite)
- **Styling**: Tailwind CSS
- **Key Concepts**: Component Props delegation, State management, Fetch API with structured JSON payloads.

---

## 📦 Getting Started (Docker)

The easiest way to run this application locally is using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed.

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/Kenokuda/employee-management.git](https://github.com/Kenokuda/employee-management.git)
   cd employee-management

   ```

2. **Build and start the containers:**

   ```bash
   docker-compose up --build

   ```

3. **Setup the database and seed data:**

   Open a new terminal and run:

   ```bash
   docker-compose exec backend bin/rails db:migrate
   docker-compose exec backend bin/rails db:seed

   ```

4. **Access the application:**
   - Frontend: http://localhost:5173

   - Backend API: http://localhost:3000

## 🛡️ Key Implementation Highlights

1. **Robust Security with Strong Parameters**

   The backend safely extracts data by enforcing nested structures. Even if malicious payloads attempt to inject unauthorized fields (e.g., is_admin), the Rails backend strict-filters them at the controller level:

```ruby
　def employee_params
　　params.require(:employee).permit(:employee_id, :name, :role, :department_id, project_ids: [])
　end
```

2. **Client-Side Data Manipulation**

   Implemented efficient client-side sorting and state preservation in React, optimizing network requests by filtering and rendering rows dynamically.
