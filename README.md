# Yup MD be

## Project Overview

This project is a scalable and modular application designed to provide authentication and integration services with AthenaHealth APIs. It uses TypeScript and leverages modern frameworks and patterns to ensure maintainability, flexibility, and robust security. The application is built with a focus on modularity, where each feature is encapsulated in its own module, promoting separation of concerns.

---

## Application Structure

### **Folder Tree**

```
📦src
 ┣ 📂athenaHealth
 ┃ ┣ 📂types
 ┃ ┃ ┣ 📜patient-portal-access.ts
 ┃ ┃ ┗ 📜patient.ts
 ┃ ┣ 📜athenaHealth.service.ts
 ┃ ┗ 📜token.json
 ┣ 📂config
 ┃ ┗ 📜configuration.ts
 ┣ 📂entities
 ┃ ┣ 📜base.entity.ts
 ┃ ┗ 📜user.entity.ts
 ┣ 📂eventSubscriber
 ┃ ┗ 📜user.subscriber.ts
 ┣ 📂modules
 ┃ ┣ 📂database
 ┃ ┃ ┣ 📜database.module.ts
 ┃ ┃ ┗ 📜database.ts
 ┃ ┣ 📂iam
 ┃ ┃ ┣ 📂authentication
 ┃ ┃ ┃ ┣ 📂decorators
 ┃ ┃ ┃ ┃ ┗ 📜auth.decorator.ts
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜athena-user.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜enum.ts
 ┃ ┃ ┃ ┃ ┣ 📜login.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜refresh-token.input.ts
 ┃ ┃ ┃ ┃ ┣ 📜sign-in-oath2.input.ts
 ┃ ┃ ┃ ┃ ┣ 📜sign-in.input.ts
 ┃ ┃ ┃ ┃ ┣ 📜sign-up.dto.ts
 ┃ ┃ ┃ ┃ ┗ 📜sign-up.input.ts
 ┃ ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┃ ┗ 📜auth-type.enum.ts
 ┃ ┃ ┃ ┣ 📜authentication.resolver.ts
 ┃ ┃ ┃ ┣ 📜authentication.service.ts
 ┃ ┃ ┃ ┗ 📜type.ts
 ┃ ┃ ┣ 📂guards
 ┃ ┃ ┃ ┣ 📂access-token
 ┃ ┃ ┃ ┃ ┗ 📜access-token.guard.ts
 ┃ ┃ ┃ ┗ 📂authentication
 ┃ ┃ ┃ ┃ ┗ 📜authentication.guard.ts
 ┃ ┃ ┣ 📂hashing
 ┃ ┃ ┃ ┣ 📜bcrypt.service.ts
 ┃ ┃ ┃ ┗ 📜hashing.service.ts
 ┃ ┃ ┣ 📜iam.constants.ts
 ┃ ┃ ┣ 📜iam.module.ts
 ┃ ┃ ┗ 📜user.repository.ts
 ┃ ┣ 📂myConfigService
 ┃ ┃ ┣ 📜myConfig.module.ts
 ┃ ┃ ┗ 📜myConfig.service.ts
 ┃ ┣ 📂orm
 ┃ ┃ ┗ 📜orm.module.ts
 ┃ ┗ 📜schema.gql
 ┣ 📂types
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜kysely-codegen.ts
 ┣ 📂utils
 ┃ ┣ 📜axiosInstance.ts
 ┃ ┣ 📜proxyAthenaHealthApi.ts
 ┃ ┣ 📜request-context.ts
 ┃ ┣ 📜token.ts
 ┃ ┗ 📜typescriptEnhance.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```

### **Folder/Module Details**

#### **athenaHealth**

- **Purpose:** Provides services and types specific to AthenaHealth API integration.
- **Key Files:**
  - `athenaHealth.service.ts`: Handles API interactions.
  - `types/`: Contains TypeScript definitions for AthenaHealth data models.
  - `token.json`: Stores API tokens securely.

#### **config**

- **Purpose:** Contains configuration logic for the application.
- **Key File:**
  - `configuration.ts`: Centralized configuration settings.

#### **entities**

- **Purpose:** Defines database entities.
- **Key Files:**
  - `base.entity.ts`: Base class for entities.
  - `user.entity.ts`: User entity definition.

#### **eventSubscriber**

- **Purpose:** Implements event-driven logic.
- **Key File:**
  - `user.subscriber.ts`: Listens to user-related database events.

#### **modules**

- **Purpose:** Encapsulates key functionalities into separate modules.

1. **database**

   - Manages database connections and configuration.
   - Key Files: `database.module.ts`, `database.ts`.

2. **iam (Identity and Access Management)**

   - Handles authentication and user identity.
   - Subfolders:
     - `authentication/`: Authentication services, DTOs, and resolvers.
     - `guards/`: Security guards for access control.
     - `hashing/`: Password hashing services.
   - Key Files: `iam.module.ts`, `user.repository.ts`.

3. **myConfigService**

   - Provides custom configuration services.
   - Key Files: `myConfig.module.ts`, `myConfig.service.ts`.

4. **orm**
   - Provides Object-Relational Mapping (ORM) setup.
   - Key File: `orm.module.ts`.

#### **types**

- **Purpose:** Centralized location for TypeScript types and utilities.
- **Key Files:** `index.ts`, `kysely-codegen.ts`.

#### **utils**

- **Purpose:** Contains reusable utility functions and services.
- **Key Files:**
  - `axiosInstance.ts`: Configured Axios instance.
  - `proxyAthenaHealthApi.ts`: Proxy logic for AthenaHealth APIs.
  - `request-context.ts`: Handles context-aware request tracking.
  - `typescriptEnhance.ts`: TypeScript utility helpers.

#### Root Files

- **`app.module.ts`:** Root module for the application.
- **`app.service.ts`:** Core application logic.
- **`main.ts`:** Application entry point.

---

## Setup and Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables (refer to `configuration.ts` for required keys).
4. Start the application using `npm start`.

---

## Usage

- **Authentication:** IAM module provides resolvers and services for login, sign-up, and token management.
- **AthenaHealth Integration:** AthenaHealth module handles API interactions and token management.
- **Database Management:** Entities and database module ensure seamless database interactions.

---

## Contributing

- Follow the folder structure when adding new features.
- Ensure proper TypeScript typing for all modules.
- Write unit tests for new functionality.

---
