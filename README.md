# TecnoStore - Tienda de Tecnología

## 📋 Descripción

TecnoStore es una aplicación web desarrollada en Node.js que simula una tienda de tecnología en línea. La aplicación permite a los usuarios explorar productos tecnológicos, solicitar cotizaciones personalizadas y obtener soporte técnico.

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Template Engine**: EJS

## 📁 Estructura del Proyecto
```
Pagina Web/
├──conexion.js              # Configuraión del servidor y base de datos
├──index.html               # Página Principal
├──package.json             # Dependencias del proyecto
├──tecnostore_db.sql        # Script de base de datos
├──contenido/               # Páginas HTML adicionales
│   ├── contactenos.html
│   ├──cotizacion.html
│   ├──cuento.html
│   ├──servicios.html
├──CSS/                     #Archivos de estilos
│   ├──contacto.css
│   ├──cotizacion.css
│   ├──cuento.css
│   ├──inicio.css
│   ├──resultado.css
│   ├──servicios.css
├──JavaScript/              # Archivos JavaScript
│   ├──cotizacion.js
│   ├──conexion.js
├──imagenes/                # Recursos gráficos
│   ├──TecnoStore_banner.png
│   └── ...
├──Views/                   # Plantillas EJS
    └──resultado.ejs
```
## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- MySQL Server
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone [URL-del-repositorio]
   cd "Pagina Web"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Asegúrate de que MySQL esté ejecutándose
   - Importa el archivo `tecnostore_db.sql` en tu servidor MySQL:
   ```bash
   mysql -u root -p < tecnostore_db.sql
   ```

4. **Configurar la conexión a la base de datos**
   - Edita el archivo `conexion.js` y actualiza las credenciales de MySQL:
   ```javascript
   const connection = mysql.createConnection({
       host: '127.0.0.1',
       port: '3306',
       database: 'tecnostore_db',
       user: 'tu_usuario',
       password: 'tu_contraseña'
   });
   ```

5. **Ejecutar la aplicación**
   ```bash
   node conexion.js
   ```

6. **Acceder a la aplicación**
   - Abre tu navegador y ve a: `http://localhost:3000`

## 📌 Funcionalidades

- Formulario de cotización con cálculo automático
- Visualización de resultados
- Generador de cuentos personalizados
- Diseño responsivo y navegación intuitiva

## 🗄️ Base de Datos

Incluye tablas para cotizaciones y productos, con relaciones entre ellos. Ver archivo `tecnostore_db.sql` para detalles.

## 👨‍💻 Autor

**Cristian Camilo Quintana**  
UCN 
Ingenieria Informatica
Lenguaje de Programación para la Web - Proyecto académico