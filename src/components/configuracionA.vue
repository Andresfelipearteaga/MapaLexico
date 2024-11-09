<template>
  <v-container>
    <!-- Selector de vistas -->
    <v-row class="view-selector">
      <div>
        <v-btn @click="mostrarVista('agregar')" :color="vistaActual === 'agregar' ? 'primary' : ''">
          Agregar Palabras
        </v-btn>
      </div>
      <div>
        <v-btn @click="mostrarVista('administrar')" :color="vistaActual === 'administrar' ? 'primary' : ''">
          Administrar Palabras
        </v-btn>
      </div>
    </v-row>
    <br>
    <v-card>
      <!-- Vista de Agregar Palabras -->
      <v-card v-if="vistaActual === 'agregar'">
        <v-card-title>AGREGAR TÉRMINOS</v-card-title>
        <v-card-text>
          <span style="font-weight: bold; font-size: large;">Agregue los términos a sus comunas correspondientes, puede agregar un término a varias comunas</span>
          <v-text-field v-model="nuevoTermino" label="Término"></v-text-field>
          <v-select
            v-model="comunasSeleccionadas"
            :items="comunas"
            multiple
            label="Selecciona Comunas"
          ></v-select>
          <v-btn @click="agregarPalabra" color="primary">Agregar</v-btn>
          <div v-if="messagefield" class="mensaje4">{{ messagefield }}</div>  
        </v-card-text>
      </v-card>   


      <!-- Vista de Administrar Palabras -->
      <v-card v-if="vistaActual === 'administrar'" class="admin">
  <v-card-title class="title">Administrar Palabras</v-card-title>
  <v-card-text>
    <v-list>
      <v-list-item-group v-if="Object.keys(palabras).length > 0">
        <v-list-item v-for="(comunas, palabra) in palabras" :key="palabra">
          <v-list-item-content>
            <v-list-item-title class="word">
              {{ palabra }} - <v-btn text @click="editarPalabra(palabra)" class="edit-btn"
              color="primary">Editar</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else>
        <v-list-item-content>No hay palabras agregadas</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card-text>
</v-card>

      <!-- Botón para volver a Inicio -->
      <v-btn @click="volverAInicio" class="home-button">Ir a Inicio</v-btn>
    </v-card>

    <!-- Modal para editar palabra -->
    <v-dialog v-if="editarModal" v-model="editarModal" max-width="500px">
    <v-card>
      <v-card-title class="title">Editar Palabra</v-card-title>
      <v-card-text v-if="palabras[palabraEditada]">
        <span class="word">{{ palabraEditada }}</span>
        <v-select
          v-model="comunasSeleccionadasagregar"
          :items="comunas"
          multiple
          label="Agregar a Comunas"
        ></v-select>
        <v-btn text @click="agregarComunas" class="ma-2"
        :disabled="loading"
        :loading="loading"
        block
        size="x-large"
        variant="flat"  
        color="primary"      
        >Agregar a comunas</v-btn>
        <v-select
          v-model="comunasSeleccionadaseliminar"
          :items="comunasQuitar"
          multiple
          label="Quitar de Comunas"
        ></v-select>
        <v-btn text @click="quitarComuna" class="indigo-darken-3"
        block
        size="x-large"
        variant="flat"  
        color="red"   
        >Quitar comunas</v-btn>
      </v-card-text>
      <div v-if="messageadd" class="mensaje2">{{ messageadd }}</div> 
      <div v-if="messagequit" class="mensaje3">{{ messagequit }}</div> 
      <v-card-actions>
        <v-btn text @click="cancelarEdicion" class="cancel-btn">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="messagenew" class="mensaje1">{{ messagenew }}</div>  
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      nuevoTermino: '',
      palabraEditada: '',
      comunas: ['Comuna 1', 'Comuna 2', 'Comuna 3', 'Comuna 4', 'Comuna 5', 'Comuna 6', 'Comuna 7', 'Comuna 8', 'Comuna 9'],
      comunasDisponibles: [],
      comunasSeleccionadas: [],
      comunasSeleccionadasagregar: [],
      comunasSeleccionadaseliminar: [],
      palabras: {},
      vistaActual: 'agregar',
      editarModal: false,
      comunasQuitar: [],
      messageadd: "",
      messagenew: "",
      messagequit: "",
      messagefield: ""
      
    };
  },


  methods: {
    volverAInicio() {
      this.$router.push('/inicio');  
    },

    mostrarVista(vista) {
  this.vistaActual = vista;
  if (vista === 'administrar'){
    this.obtenerPalabras();
  }

},



    agregarPalabra() {

      if (!this.nuevoTermino || this.comunasSeleccionadas.length === 0) {
    this.messagefield = 'Debe llenar todos los campos';
    setTimeout(() => {
          this.messagefield = "";
        }, 2000)
    return;
    
  }
      const nuevoTermino = {
        nuevoTermino: this.nuevoTermino,
        comunasSeleccionadas: this.comunasSeleccionadas
      };

      //axios.post('http://localhost:5000/api/palabras', nuevoTermino)
      axios.post('https://edutlasdeveloper.pythonanywhere.com/apim/palabras', nuevoTermino)
        .then(response => {
          this.messagenew = response.data.message;
        setTimeout(() => {
          this.messagenew = "";
        }, 3000)
        })
        .catch(error => {
          console.error('Error al agregar palabra:', error);
        });

      // Reiniciar campos de entrada
      this.nuevoTermino = '';
      this.comunasSeleccionadas = [];
    },

    editarPalabra(palabra) {
  this.palabraEditada = palabra;
  this.comunasQuitar = this.palabras[palabra].slice();
  this.comunasSeleccionadas = []; // Reset the selected communities
  this.editarModal = true;
},

    obtenerPalabras() {
  //axios.get('http://localhost:5000/api/terminos')
  axios.get('https://edutlasdeveloper.pythonanywhere.com/apim/terminos')

    .then(response => {
      const palabrasObject = {};
      console.log( 'response', response.data)
      Object.entries(response.data).forEach(([palabra, comunas]) => {
        palabrasObject[palabra] = comunas;
      });

      this.palabras = palabrasObject;
      console.log( 'palabras', this.palabras)
      if (Object.keys(this.palabras).length === 0) {
        console.warn('No hay palabras agregadas');
      }
    })
    .catch(error => {
      console.error('Error al obtener palabras:', error);
    });
},

    cancelarEdicion() {
      this.editarModal = false;
    },
  
    agregarComunas() {

    const palabraEditada = {
      palabraEditada: this.palabraEditada,
      comunasSeleccionadas: this.comunasSeleccionadasagregar
    };

    //axios.post('http://localhost:5000/api/palabras/editar', palabraEditada)
    axios.post('https://edutlasdeveloper.pythonanywhere.com/apim/palabras/editar', palabraEditada)
      .then(response => {
        this.messageadd = response.data.message
        setTimeout(() => {
          this.messageadd = "";
        }, 2000)
        this.obtenerPalabras()
        setTimeout(() => {
        this.cancelarEdicion();
        }, 2000);
      })
      .catch(error => {
        console.error('Error al editar palabra:', error);
      });


  // Reiniciar campos de entrada
  this.comunasSeleccionadasagregar = [];
},

  quitarComuna() {
    const palabraEliminada = {
      palabraEditada: this.palabraEditada,
      comunasSeleccionadas: this.comunasSeleccionadaseliminar
    };
    //axios.post('http://localhost:5000/api/palabras/eliminar', palabraEliminada)
    axios.post('https://edutlasdeveloper.pythonanywhere.com/apim/palabras/eliminar', palabraEliminada)
    .then(response => {
      this.messagequit = response.data.message
      setTimeout(() => {
        this.messagequit = "";
      }, 2000);
      this.obtenerPalabras()
      setTimeout(() => {
        this.cancelarEdicion();
        }, 2000);
    })
    .catch(error => {
      console.error(error)
    });
    this.comunasSeleccionadaseliminar = [];
  },

 },
 mounted() {
    this.obtenerPalabras();
  }
 }



</script>

<style>
.view-selector {
  justify-content: center;
  margin-top: 20px;
}

.home-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

@media (max-width: 500px) {
  .home-button {
    position: relative;
    bottom: -1px;
    right: -1px;
    position: relative;
  }

}

.admin {
  max-height: 800px;
  overflow-y: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.word {
  font-size: 18px;
  font-weight: bold;
}

.edit-btn {
  color: #1976d2;
  font-weight: bold;
}

.select {
  width: 100%;
  margin-bottom: 16px;
}

.action-btn {
  margin-right: 16px;
}

.cancel-btn {
  color: #e91e63; /* Color rosa para el botón "Cancelar" */
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 8px;
  }

.mensaje1 {
  background-color: green;
  color: white;
  padding: 10px;
  border-radius: 20px;
}

.mensaje2 {
  background-color: rgb(0, 96, 206);
  color: white;
  padding: 10px;
  border-radius: 20px;
}

.mensaje3 {
  background-color: rgb(228, 0, 0);
  color: white;
  padding: 10px;
  border-radius: 20px;
}

.mensaje4 {
  margin-top: 10px;
  background-color: rgba(228, 0, 0, 0);
  color: red;
  font-weight: bold;

}

</style>
