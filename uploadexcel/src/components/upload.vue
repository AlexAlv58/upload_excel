<template>
    <v-container>
      <v-card class="pa-1">
        <v-card-title>Cargar Archivo Excel</v-card-title>
        <v-card-text>
          <v-file-input
            label="Selecciona un archivo Excel"
            accept=".xls,.xlsx"
            @change="handleFileUpload"
            outlined
          ></v-file-input>
  
          <!-- Mostrar la tabla solo si hay datos de Excel -->
          <v-data-table
            v-if="excelData.length"
            :headers="headers"
            :items="excelData"
            class="mt-4"
          ></v-data-table>
  
          <!-- Mostrar los datos de Zoho cuando los haya -->
          <v-card v-if="zohoData.length">
            <v-card-title>Datos de Zoho</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="zohoHeaders"
                :items="zohoData"
                class="mt-4"
              ></v-data-table>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="loadingBtn" @click="fetchDataSDK" color="primary">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import * as XLSX from "xlsx";
  import axios from "axios";
  
  export default {
    data() {
      return {
        excelData: [],
        headers: [],
        zohoData: [],
        zohoHeaders: [
          { text: "ID", value: "id" },
          { text: "Nombre", value: "name" },
          { text: "Correo", value: "email" },
        ],
        loadingBtn: false
      };
    },
    mounted() {
      ZOHO.embeddedApp.on("PageLoad",function(data)
        {
            console.log(data);
        })
          ZOHO.embeddedApp.init();
    },
    methods: {
      handleFileUpload(event) {
        const file = event;
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
  
          if (jsonData.length) {
            this.headers = Object.keys(jsonData[0]).map((key) => ({
              text: key,
              value: key
            }));
          }
  
          this.excelData = jsonData;

        };
        reader.readAsArrayBuffer(file);
      },
      
      async  fetchDataSDK() {
    console.log(this.excelData);
    if (!this.excelData.length) {
        alert("Carga un archivo Excel primero.");
        return;
    }
    
    for (const row of this.excelData) {
        const email = row["Homeowners Email"];
        const firstName = row["Name"].split(" ")[0] || "Nombre";
        const lastName = row["Name"].split(" ").slice(1).join(" ") || "Apellido";
        const accountName = row["Name"];
        
        if (!email) continue;
        
        try {
            const searchResponse = await ZOHO.CRM.API.searchRecord({Entity:"Contacts", Type:"email", Query:email, delay:false});
            let contactId = null;
            let accountId = null;
            
            if (searchResponse.status === 204 || !searchResponse.data || !searchResponse.data.length) {
                console.log("No se encontró el correo, creando contacto y cuenta...");
                
                // Crear Account
                let accountData = { "Account_Name": accountName };
                let accountResponse = await ZOHO.CRM.API.insertRecord({ Entity: "Accounts", APIData: [accountData] });
                if (accountResponse.data && accountResponse.data.length) {
                    accountId = accountResponse.data[0].details.id;
                }
                
                // Crear Contact
                let contactData = { "Email": email, "First_Name": firstName, "Last_Name": lastName, "Account_Name": accountId };
                let contactResponse = await ZOHO.CRM.API.insertRecord({ Entity: "Contacts", APIData: [contactData] });
                if (contactResponse.data && contactResponse.data.length) {
                    contactId = contactResponse.data[0].details.id;
                }
            } else {
                console.log("Se encontró el correo");
                contactId = searchResponse.data[0].id;
                accountId = searchResponse.data[0].Account_Name || null;
                
                if (!accountId) {
                    console.log("No se encontró la cuenta, creando una...");
                    let accountData = { "Account_Name": accountName };
                    let accountResponse = await ZOHO.CRM.API.insertRecord({ Entity: "Accounts", APIData: [accountData] });
                    if (accountResponse.data && accountResponse.data.length) {
                        accountId = accountResponse.data[0].details.id;
                    }
                }
            }
            
            // Crear Deal
            let dealData = {
                "Deal_Name": "Nuevo Proyecto - " + email,
                "Contact_Name": contactId,
                "Account_Name": accountId,
                "Stage": "New"
            };
            await ZOHO.CRM.API.insertRecord({ Entity: "Deals", APIData: [dealData] });
            
            console.log("Deal creado correctamente para: ", email);
        } catch (error) {
            console.error("Error procesando email: ", email, error);
        }
    },


      fetchZohoData() {
        axios
          .get("http://localhost:3000/get-zoho-data") // URL de tu backend
          .then((response) => {
            this.zohoData = response.data; // Almacena los datos de Zoho en zohoData
          })
          .catch((error) => {
            console.error("Error al obtener los datos de Zoho:", error);
          });
      },
      fetchZohoDataTest() {
        if (!this.excelData.length) {
          alert("Carga un archivo Excel primero.");
          return;
        }
        console.log("Datos de Excel:", this.excelData);
        const emails = this.excelData.map(row => row["Homeowners Email"]).filter(email => email);
        console.log("Correos encontrados:", emails);
        if (!emails.length) {
          alert("No se encontraron correos en el archivo.");
          return;
        }

        // Hacer la petición al backend con los correos
        // axios
        //   .post("http://localhost:3000/search-zoho-emails", { emails })
        //   .then(response => {
        //     this.zohoData = response.data; // Almacena los datos en zohoData
        //   })
        //   .catch(error => {
        //     console.error("Error al buscar en Zoho:", error);
        //   });
      }
    }
  };
  </script>
  
  <style scoped>
  .v-container {
    max-width: 800px;  /* Aumenta el ancho máximo para mejorar la apariencia */
    margin: auto;      /* Centrado en la página */
  }
  </style>
  