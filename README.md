**Algoritmo de Uso de la Aplicación**

1. **Inicialización del SDK de Zoho (mounted)**
   - Cuando el componente se monta (`mounted`), se inicializa el SDK de Zoho mediante `ZOHO.embeddedApp.init()`.
   - Se escucha el evento `PageLoad` para recibir datos de la página embebida y mostrarlos en la consola.

2. **Carga de Archivo Excel (handleFileUpload)**
   - El usuario selecciona un archivo Excel usando el `v-file-input`.
   - Se lee el archivo con `FileReader` y se convierte a un array de datos usando `XLSX`.
   - Se extrae la primera hoja del archivo y se transforma en un array JSON.
   - Se almacenan los datos del Excel en `excelData`.
   - Se generan los encabezados para la tabla `v-data-table` usando las claves del primer objeto del JSON.

3. **Ejecución de la Creación de Registros (fetchDataSDK)**
   - Cuando el usuario hace clic en el botón "Crear", se ejecuta la función `fetchDataSDK`.
   - Si no hay datos en `excelData`, se muestra una alerta para que el usuario suba un archivo primero.

4. **Recorrido del Archivo Excel y Creación de Registros**
   - Se recorre cada fila del archivo cargado.
   - Se extraen los datos necesarios: `email`, `firstName`, `lastName` y `accountName`.
   - Se realiza una búsqueda en Zoho CRM por el email:
     - Si el correo no existe en Zoho, se crean:
       - Un registro en "Accounts" con `accountName`.
       - Un registro en "Contacts" con `email`, `firstName`, `lastName` y la cuenta asociada.
     - Si el correo ya existe, se obtiene su `contactId` y `accountId`.
     - Si el `accountId` no existe, se crea una nueva cuenta.
   - Se crea un "Deal" (negociación) relacionado con el contacto y la cuenta.

5. **Mostrar Datos de Zoho en la Tabla (fetchZohoData)**
   - Se obtiene la información de Zoho desde una API (`http://localhost:3000/get-zoho-data`).
   - Se almacenan los datos en `zohoData` y se muestran en una tabla.

6. **Validación de Correos antes de Consultar en Zoho (fetchZohoDataTest)**
   - Se extraen los correos desde el archivo Excel.
   - Si no hay correos, se muestra una alerta.
   - Se hace una petición para buscar esos correos en Zoho (comentado en el código).
   - Se almacenan los datos encontrados en `zohoData`.

**Resumen del Flujo:**
1. Se inicializa el SDK de Zoho.
2. Se sube un archivo Excel y se leen los datos.
3. Al hacer clic en "Crear", se procesan los datos del Excel.
4. Se verifican y crean registros en Zoho CRM.
5. Se muestran los datos obtenidos de Zoho en una tabla.

