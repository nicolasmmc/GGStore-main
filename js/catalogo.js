// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs/promises'); // Para leer el archivo HTML
const path = require('path');
const app = express();
const port = 3000;

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const dbConfig = {
    host: 'localhost',
    user: 'USUARIO_MYSQL',       // !!! REEMPLAZAR !!!
    password: 'CONTRASEÑA_MYSQL', // !!! REEMPLAZAR !!!
    database: 'NOMBRE_DE_LA_DB'  // !!! REEMPLAZAR !!!
};

// --- CONSULTA SQL PARA OBTENER EL CATÁLOGO (JOIN de 3 tablas) ---
const SQL_CATALOGO = `
    SELECT
        j.titulo,
        j.precio,
        j.clasificacion_edad,
        j.imagen_portada_url,
        g.nombre_genero,
        d.nombre_desarrollador
    FROM
        juegos j
    INNER JOIN
        genero g ON j.id_genero = g.id_genero
    INNER JOIN
        desarrollador d ON j.id_desarrollador = d.id_desarrollador
    ORDER BY
        j.titulo ASC;
`;

// Middleware para servir archivos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTA PRINCIPAL DEL CATÁLOGO ---
app.get('/', async (req, res) => {
    let connection;
    try {
        // 1. Conexión y Consulta
        connection = await mysql.createConnection(dbConfig);
        const [juegos] = await connection.execute(SQL_CATALOGO);

        // 2. Generar el HTML de las tarjetas
        const juegosHTML = juegos.map(juego => `
            <article class="tarjeta-juego">
                <div class="portada">
                    <img src="${juego.imagen_portada_url}" alt="Portada de ${juego.titulo}">
                </div>
                <div class="info-juego">
                    <h2>${juego.titulo}</h2> 
                    <p class="meta">
                        Clasificación: **${juego.clasificacion_edad}** | 
                        Desarrollador: **${juego.nombre_desarrollador}**
                    </p>
                    <p class="genero">Género: **${juego.nombre_genero}**</p>
                    <p class="precio">$${juego.precio.toFixed(2)}</p>
                    <a href="#" class="btn-comprar">Ver Detalles</a>
                </div>
            </article>
        `).join('\n'); // Une todas las tarjetas en una sola cadena de texto

        // 3. Leer la plantilla base HTML
        let htmlTemplate = await fs.readFile(path.join(__dirname, 'catalogo.html'), 'utf-8');

        // 4. Inyectar el HTML de los juegos en la plantilla
        const finalHTML = htmlTemplate.replace(
            '',
            juegosHTML
        );

        // 5. Enviar la respuesta al cliente
        res.send(finalHTML);

    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        res.status(500).send("<h1>Error Interno del Servidor</h1><p>No se pudo conectar a la base de datos o generar el catálogo.</p>");
    } finally {
        // Asegurarse de que la conexión se cierre
        if (connection) {
            await connection.end();
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor de catálogo corriendo en http://localhost:${port}`);
});