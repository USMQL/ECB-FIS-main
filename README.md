## Configuración del Proyecto
### 1. Clonar el Repositorio
Primero, clona el repositorio en tu máquina local:

`git clone https://github.com/USMQL/ECB-FIS-main.git`

### 2. Instalar Dependencias
Una vez dentro del directorio del proyecto, instala las dependencias necesarias:

`npm install`

### 3. Configurar Firebase
Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase en una sola linea:

`EXPO_PUBLIC_FIREBASE_CONFIG={"apiKey":"tu_api_key","authDomain":"tu_auth_domain","projectId":"tu_project_id","storageBucket":"tu_storage_bucket","messagingSenderId":"tu_messaging_sender_id","appId":"tu_app_id"}`

### 4. Iniciar el proyecto
Finalmente, inicia el proyecto:

`npx expo start`
