# Explicación del Código - Integración con Zoho CRM

## Descripción
Esta aplicación permite cargar un archivo Excel, procesar los datos y crear registros en Zoho CRM. Utiliza Vue.js con Vuetify y la API de Zoho para gestionar contactos, cuentas y negocios (deals).

## Algoritmo de Uso

### 1. Inicialización del SDK de Zoho
- En el `mounted()` del componente, se inicializa el SDK de Zoho con `ZOHO.embeddedApp.init()`, lo que permite interactuar con Zoho CRM desde la aplicación embebida.

### 2. Carga de un Archivo Excel
- El usuario selecciona un archivo Excel a través de un `v-file-input`.
- Se procesa el archivo usando `XLSX`, extrayendo la primera hoja y convirtiéndola en JSON.
- Se actualiza el estado `excelData` con los datos del archivo y se generan dinámicamente los encabezados para la tabla.

### 3. Procesamiento de Datos al Presionar "Crear"
- Al presionar el botón, se ejecuta `fetchDataSDK()`.
- Se recorre el arreglo `excelData` y se extraen valores clave como el correo, nombre y apellido.
- Se busca si el correo ya existe en Zoho CRM usando `ZOHO.CRM.API.searchRecord()`.
- Si el correo no existe:
  - Se crea una cuenta (`Account`).
  - Se crea un contacto (`Contact`) asociado a la cuenta.
- Si el correo existe:
  - Se obtiene el `contactId` y la cuenta asociada, creando una si es necesario.
- Se crea un negocio (`Deal`) vinculado al contacto y la cuenta.

### 4. Obtención de Datos desde Zoho CRM
- La función `fetchZohoData()` permite obtener información desde Zoho mediante una petición a un backend.
- La función `fetchZohoDataTest()` muestra cómo extraer correos desde el archivo Excel y realizar una consulta masiva en Zoho CRM.

### 5. Registro del Archivo y Errores en Zoho CRM
- Al finalizar la creación de todos los deals, el archivo Excel subido se registrará en el módulo personalizado **Excel Uploads** de Zoho CRM.
- En este registro se almacenarán los errores encontrados durante el proceso, si los hubiera.

## Tecnologías Utilizadas
- **Vue.js** con **Vuetify** para la interfaz.
- **XLSX** para la manipulación de archivos Excel.
- **Axios** para la comunicación con el backend.
- **Zoho CRM API** para la integración con la plataforma.

## Ubicación del Widget
- Este widget está alojado en una **WebTab de Zoho CRM** llamada **Upload Excel**.

## Mejoras Posibles
- Agregar validaciones adicionales al procesar el archivo.
- Manejo avanzado de errores y notificaciones al usuario.
- Implementar una barra de progreso para la carga de datos en Zoho CRM.

