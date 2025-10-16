✅ Paso 1: Abrir la terminal

Dependiendo de tu sistema operativo:

Windows: Podés usar CMD, PowerShell o la terminal de VS Code.

Linux/macOS: Usá tu terminal normal.

📁 Muy importante: Antes de correr los comandos, asegurate de estar en la carpeta donde está tu proyecto, por ejemplo:

cd C:\Users\TuUsuario\Desktop\mi-proyecto-asistencia


O en Linux/macOS:

cd ~/Escritorio/mi-proyecto-asistencia

✅ Paso 2: Inicializar el proyecto Node.js

Esto crea el archivo package.json que permite instalar paquetes.

npm init -y


💡 Esto genera un package.json con valores por defecto.

✅ Paso 3: Instalar dependencias necesarias

Ahora instalás los paquetes que usa tu proyecto:

npm install express mysql2


📦 Esto instala:

express → para crear el servidor web.

mysql2 → para conectarte a tu base de datos MySQL.

✅ Paso 4: Verificar que los archivos estén

Asegurate de tener estos archivos en tu carpeta:

mi-proyecto-asistencia/
├── public/
│   ├── index.html
│   ├── main.js
│   └── style.css   ← (opcional)
├── server.js
└── db.js


El archivo db.js debe tener la conexión a MySQL (te dejo el ejemplo abajo).

El archivo server.js es el servidor Express.

Todo lo visual va en la carpeta public/.

✅ Paso 5: Crear archivo db.js (si no existe)

Si no lo hiciste aún, creá un archivo llamado db.js (en la misma carpeta que server.js) con este contenido:

// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // ← Cambiá si usás otro usuario
  password: '',         // ← Tu contraseña de MySQL
  database: 'tp',       // ← Tu base de datos (ya la creaste)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

✅ Paso 6: Ejecutar el servidor

Finalmente, ejecutá el servidor con este comando:

node server.js


📢 Si todo está correcto, deberías ver:

Servidor corriendo en http://localhost:3000


Abrí tu navegador y entrá en:
👉 http://localhost:3000

🧪 Comprobación rápida

¿No ves nada? Asegurate de tener index.html dentro de la carpeta public/.

¿Sigue diciendo Cannot find module 'mysql2/promise'? Repetí npm install mysql2.

✅ Lista completa de comandos
# 1. Entrás a tu carpeta del proyecto
cd ruta/a/mi-proyecto-asistencia

# 2. Inicializás el proyecto
npm init -y

# 3. Instalás Express y MySQL2
npm install express mysql2

# 4. Ejecutás el servidor
node server.js


¿Querés que te arme un script start para correrlo con npm start? ¿O te gustaría que agreguemos reinicio automático con nodemon?