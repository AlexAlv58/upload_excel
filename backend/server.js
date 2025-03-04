const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Asegúrate de cargar el archivo .env

const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors({
    origin: 'http://localhost:8080', // Aquí especificas el origen de tu frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
  }));
// Middleware para manejar solicitudes JSON
app.use(express.json());




// Ruta para refrescar el access token y hacer una solicitud a Zoho CRM
app.get('/get-zoho-data', async (req, res) => {
    console.log('entro a la ruta')
  try {
    // Obtener un nuevo access token usando el refresh token
    // const accessToken = await refreshAccessToken();
    const accessToken = "1000.cca16ce1d1fe027d0ae95c766a03c11e.29cb9d66b6122199c1fed08729097e96";
    console.log('access token', accessToken)
    
    // Usamos el access token para hacer una solicitud a Zoho CRM
    const response = await axios.get('https://www.zohoapis.com/crm/v2/Leads/4909080000009762142', {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      }
    });
    console.log("Alexis response", response.data);
    // Responder con los datos obtenidos
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de Zoho');
  }
});

app.post('/search-zoho-emails', async (req, res) => {
  try {
    const { emails } = req.body; // Recibe los correos desde el frontend

    if (!emails || !emails.length) {
      return res.status(400).json({ error: "No se proporcionaron correos." });
    }

    const accessToken = await refreshAccessToken(); // Obtener access token

    let results = [];

    for (const email of emails) {
      const response = await axios.get(`https://www.zohoapis.com/crm/v2/Leads/search`, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        params: { email } // Buscar en Zoho por email
      });

      if (response.data && response.data.data) {
        results.push(...response.data.data);
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error al buscar en Zoho:", error);
    res.status(500).json({ error: "Error al buscar en Zoho" });
  }
});

const getAllZohoContacts = async () => {
  try {
    const response = await axios.get('https://www.zohoapis.com/crm/v2/Contacts', {
      headers: {
        Authorization:  `Zoho-oauthtoken ${accessToken}` ,
      }
    });
    return response.data.data;  // Retorna la lista de contactos
  } catch (error) {
    console.error('Error al obtener los contactos de Zoho:', error);
    throw error;
  }
};

// Función para refrescar el access token
// async function refreshAccessToken() {
//   const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
//     params: {
//       refresh_token: process.env.ZOHO_REFRESH_TOKEN,
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//       grant_type: 'refresh_token',
//     }
//   });

//   // Retornamos el nuevo access token
//   return response.data.access_token;
// }


async function refreshAccessToken() {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;
  
    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'refresh_token',
        }
      });
  
      // Log para ver la respuesta completa de Zoho
      console.log('Respuesta completa de Zoho:', response.data);
  
      // Verificar que la respuesta contenga un access token
      if (response.data && response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new Error('No se obtuvo un access token de Zoho');
      }
    } catch (error) {
      console.error('Error al obtener el access token:', error.message);
      console.error('Detalles del error:', error.response ? error.response.data : error.message);
      throw new Error('Error al obtener el access token de Zoho');
    }
  }
  

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});