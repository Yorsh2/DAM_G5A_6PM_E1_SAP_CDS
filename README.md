# SAP-CDS-Projecto

El siguiente projecto es un trabajo complementario de la materia de Desarrollo de Aplicaciones Multiplataforma.

## Agregar el .env para conectar la base de datos.
Hacer un archivo .env en raiz del proyecto.

```
/
├── src/               
│   ├── config/        
├── .env               # Archivo de variables de entorno
├── server.js          
├── package.json
├── package-lock.json
├── README.md
```

```.env
    PORT=3333     
    HOST='localhost'                                                        
    API_URL=/api/v1                                                                        
    CONNECTION_STRING=mongodb+srv://*usuario*:*password*@security.d2iho.mongodb.net/
    DB_USER='*usuario*'                                                                 
    DB_PASSWORD='*password*'                                                              
    DATABASE='*Database Cluster*'
```

Como tambien utilizar actualizar las dependencias para

```
npm i
```

## Usuarios

### 1. Obtener todos los usuarios

```
GET /api/security/getAllUsers
```

### 2. Obtener un usuario en concreto
```
GET /api/security/getUserById?userid=*usuario*
```

### 3. Crear un usuario
```
POST /api/security/createUser
```

Body de ejemplo:
```json
{
    "user": {
        "USERID": "MARIPOSA22",
        "PASSWORD": "Butterfly$2024",
        "USERNAME": "MARIA ISABEL PEREZ OSORIO",
        "ALIAS": "Mari",
        "FIRSTNAME": "MARIA ISABEL",
        "LASTNAME": "PEREZ OSORIO",
        "BIRTHDAYDATE": "22.04.1995",
        "AVATAR": "https://example.com/avatars/maria.jpg",
        "COMPANYID": 1002,
        "COMPANYNAME": "TECNOLOGICO NACIONAL DE MEXICO",
        "COMPANYALIAS": "TECNM",
        "CEDIID": "CDMX001",
        "EMPLOYEEID": "TNM2024",
        "EMAIL": "mperez@tecnm.mx",
        "PHONENUMBER": "5512345678",
        "EXTENSION": "123",
        "DEPARTMENT": "Recursos Humanos",
        "FUNCTION": "Jefa de Capacitación",
        "STREET": "Av. Universidad 1234",
        "POSTALCODE": 3100,
        "CITY": "Ciudad de México",
        "REGION": "Centro",
        "STATE": "Ciudad de México",
        "COUNTRY": "México",
        "ROLES": [
            {
                "ROLEID": "IdAdministrador"
            },
            {
                "ROLEID": "IdRHManager",
                "ROLEIDSAP": "RH-001"
            }
        ]
    }
}
```

### 4. Actualizar datos de un usuario
```
POST /api/security/updateone?USERID=*usuario*
```

Body de ejemplo:
```json
{
    "user": {
        "EMAIL": "nue3434o@email.com",
        "DEPARTMENT": "Nuevo Departamento"
    }
}
```
### 5. Eliminar usuario (lógico)
```
POST/api/security/deleteusers?USERID=*usuario*
```

### 6. Eliminar usuario (fisico)
```
POST /api/security/physicalDeleteUser?userid=*usuario*
```
