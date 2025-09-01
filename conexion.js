//Librerias necesarias
const express = require('express'); 
const mysql = require('mysql2'); 
const bodyParser = require('body-parser'); 
const path = require('path');

const app = express();

//Configuración de middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname));
app.use('/contenido', express.static(path.join(__dirname, 'contenido')));
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/JavaScript', express.static(path.join(__dirname, 'JavaScript')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));


//Conexión a mysql
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    database: 'tecnostore_db',
    user: 'root',
    password: '12564378'
});

//Verificar si la conexión fue exitosa
connection.connect((err) =>{
    if(err){
        console.error('❌ Error de conexion: ', err);
    }
    else{
        console.log('✅ Conectado a MySQL');
    }
});

//Recibir datos del formulario de cotización
app.post('/cotizar',(req, res) =>{
    //Extraer datos del cliente desde el formulario o JSON
    const{nombre, ciudad, direccion, telefono, productos} = req.body;

    //Insertar datos del cliente en la tabla cotizaciones
    const queryCotizacion = `
        INSERT INTO cotizaciones (nombre, ciudad, direccion, telefono)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(queryCotizacion, [nombre, ciudad, direccion, telefono], (err, result) => {
        if(err){
            console.error('❌ Error al guardar cotizacion: ',err);
            return res.send('Hubo un error al guardar la cotización');
        }

        const cotizacionId = result.insertId;

        // Manejar productos según el tipo de envío
        if (productos && Array.isArray(productos)) {
            // Envío desde JavaScript (JSON)
            productos.forEach(producto => {
                if (producto.name && producto.quantity > 0) {
                    // Consultar el precio unitario desde la tabla productos
                    connection.query(
                        'SELECT precio_unitario FROM productos WHERE nombre = ?',
                        [producto.name],
                        (err, rows) => {
                            if (err || rows.length === 0) {
                                console.error(`❌ Error al obtener precio de ${producto.name}`);
                                return;
                            }
                            const precio = rows[0].precio_unitario;
                            const total = precio * producto.quantity;

                            // Insertar en productos_cotizacion
                            const queryProducto = `
                                INSERT INTO productos_cotizacion (cotizacion_id, producto, cantidad, precio_unitario, precio_total)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            connection.query(queryProducto, [cotizacionId, producto.name, producto.quantity, precio, total]);
                        }
                    );
                }
            });
            
            // Respuesta JSON para JavaScript
            res.json({ success: true, cotizacionId: cotizacionId });
        } else {
            // Envío tradicional del formulario
            const productosForm = [
                { checkbox: 'prod1', cantidad: 'cantidad_smartphones' },
                { checkbox: 'prod2', cantidad: 'cantidad_laptops' },
                { checkbox: 'prod3', cantidad: 'cantidad_audifonos' },
                { checkbox: 'prod4', cantidad: 'cantidad_tablets' },
                { checkbox: 'prod5', cantidad: 'cantidad_consolas' },
                { checkbox: 'prod6', cantidad: 'cantidad_smartwatches' },
                { checkbox: 'prod7', cantidad: 'cantidad_perifericos' },
                { checkbox: 'prod8', cantidad: 'cantidad_impresora' },
                { checkbox: 'prod9', cantidad: 'cantidad_accesorios' }
            ];

            // Recorrer los productos seleccionados
            productosForm.forEach(p => {
                const productoNombre = req.body[p.checkbox];
                const cantidad = parseInt(req.body[p.cantidad]);

                if (productoNombre && cantidad > 0) {
                    // Consultar el precio unitario desde la tabla productos
                    connection.query(
                        'SELECT precio_unitario FROM productos WHERE nombre = ?',
                        [productoNombre],
                        (err, rows) => {
                            if (err || rows.length === 0) {
                                console.error(`❌ Error al obtener precio de ${productoNombre}`);
                                return;
                            }
                            const precio = rows[0].precio_unitario;
                            const total = precio * cantidad;

                            // Insertar en productos_cotizacion
                            const queryProducto = `
                                INSERT INTO productos_cotizacion (cotizacion_id, producto, cantidad, precio_unitario, precio_total)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            connection.query(queryProducto, [cotizacionId, productoNombre, cantidad, precio, total]);
                        }
                    );
                }
            });
            
            // Redirigir a la página de resultados
            res.redirect(`/resultado/${cotizacionId}`);
        }
    });
});

//Activación del servidor en el puerto 3000
app.listen(3000, () =>{
    console.log('🟢 Servidor escuchado en http://localhost:3000');
});

//Ruta para mostrar resultados de la cotizacion
app.get('/resultado/:id', (req, res) => {
        const cotizacionId = req.params.id;
    
        // Consulta de datos del cliente
        connection.query('SELECT * FROM cotizaciones WHERE id = ?', [cotizacionId], (err, cotizacionRows) => {
        if (err || cotizacionRows.length === 0) {
            return res.send('Cotización no encontrada');
        }
        
        // Consulta de productos cotizados
        connection.query('SELECT * FROM productos_cotizacion WHERE cotizacion_id = ?', [cotizacionId], (err, productosRows) => {
            if (err) {
                return res.send('Error al obtener productos cotizados');
            }

        // Renderizar la vista con los datos
        res.render('resultado', {
            cotizacion: cotizacionRows[0],
                productos: productosRows
        });
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});