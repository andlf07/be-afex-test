# Proyecto AFEX Test - Backend

## Descripción

Este es un proyecto backend desarrollado con NestJS que implementa 2 endpoints de usuarios con funcionalidades de búsqueda y paginación.

## Tecnologías Utilizadas

- **NestJS**
- **TypeScript**
- **Arquitectura Hexagonal**

## Estructura del Proyecto

```
src/
├── app/
│   ├── controllers/
│   │   └── users/
│   │       └── users.controller.ts
│   └── routes/
│       └── routes.module.ts
└── context/
    └── users/
        ├── application/
        │   └── use_cases/
        ├── domain/
        │   ├── class/
        │   └── interfaces/
        └── infrastructure/
            ├── modules/
            ├── repositories/
            └── services/
```

## API de Usuarios

### Endpoints Disponibles

#### 1. Obtener Todos los Usuarios

```
GET /users
```

**Parámetros de consulta opcionales:**

- `status` - Estado del usuario (ACTIVE, INACTIVE, PENDING, SUSPENDED)
- `agentType` - Tipo de agente (INDIVIDUAL, COMPANY, GOVERNMENT, ORGANIZATION)
- `country` - País del usuario
- `amount` - Monto específico
- `name` - Nombre del usuario (búsqueda parcial)
- `dateFrom` - Fecha inicial (formato: YYYY-MM-DD)
- `dateTo` - Fecha final (formato: YYYY-MM-DD)
- `page` - Número de página (por defecto: 1)
- `limit` - Elementos por página (por defecto: 10)

**Ejemplos de uso:**

```
GET /users
GET /users?status=ACTIVE
GET /users?page=2&limit=5
GET /users?name=juan&country=colombia&page=1&limit=20
GET /users?dateFrom=2023-01-01&dateTo=2023-12-31
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "1",
      "name": "Juan Pérez",
      "country": "Colombia",
      "amount": 1500,
      "status": "ACTIVE",
      "agentType": "INDIVIDUAL",
      "data": "2023-01-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### 2. Obtener Usuario por ID

```
GET /users/:id
```

**Respuesta:**

```json
{
  "id": "1",
  "name": "Juan Pérez",
  "country": "Colombia",
  "amount": 1500,
  "status": "ACTIVE",
  "agentType": "INDIVIDUAL",
  "data": "2023-01-15T00:00:00.000Z"
}
```

## Instalación y Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run start:dev
```

3. El servidor estará disponible en: `http://localhost:3000`

## Funcionalidades Implementadas

- ✅ Búsqueda de usuarios por múltiples criterios
- ✅ Paginación de resultados
- ✅ Filtrado por estado, tipo de agente, país, monto, nombre y fechas
- ✅ Arquitectura hexagonal con separación de responsabilidades
- ✅ Casos de uso específicos (FindAll y FindById)
- ✅ Repositorio en memoria con datos de prueba

## Arquitectura

El proyecto implementa una arquitectura hexagonal con las siguientes capas:

- **Dominio**: Entidades, interfaces y reglas de negocio
- **Aplicación**: Casos de uso y lógica de aplicación
- **Infraestructura**: Implementaciones concretas, repositorios y servicios
- **Controladores**: Punto de entrada HTTP para la API
