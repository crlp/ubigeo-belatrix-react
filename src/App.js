import './App.css';
import React, { Component } from 'react';

class App extends Component {

  types = {
    departamento: 'dep',
    provincia: 'pro',
    distrito: 'dis'
  }

  constructor() {
    super();
    this.state = {
      departamentos: [],
      provincias: [],
      distritos: [],
      dataInitial: []
    }
  }

  handleUploadFile = (event) => {
    let file = event.target.files[0];
    var reader = new FileReader();

    let self = this;
    reader.onload = function (event) {
      var content = event.target.result;
      let lines = content.split('\n');
      lines.forEach(element => {
        let arrayContent = element.split("/");
        let arrayContentClear = []
        arrayContent.forEach(element => {
          if (element.trim() !== '') {
            arrayContentClear.push(element)
          }
        });
        self.state.dataInitial.push(arrayContentClear);
      });

      self.llenarData();
      self.renderTables()
    }

    reader.readAsText(file);

  }

 

  setDataArray(value, type) {
    if (type && value) {
      let arrHijo = []
      let arrPadre = []
      let arrNivel0 = []
      let objItem

      if (type === this.types.departamento) {
        arrHijo = this.detectFirstSpace(value[0].trim())
        objItem = { codigo: arrHijo[0], descripcion: arrHijo[1] };
        if (!this.existInArray(this.state.departamentos, objItem.codigo)) {
          this.state.departamentos.push(objItem);
        }
      } else if (type === this.types.provincia) {
        arrHijo = this.detectFirstSpace(value[1].trim())
        arrPadre = this.detectFirstSpace(value[0].trim())
        objItem = { codigo: arrHijo[0], descripcion: arrHijo[1], codigoDepartamento: arrPadre[0], descripcionDepartamento: arrPadre[1] };
        if (!this.existInArray(this.state.provincias, objItem.codigo)) {
          this.state.provincias.push(objItem);
        }
      } else if (type === this.types.distrito) {
        arrHijo = this.detectFirstSpace(value[2].trim())
        arrNivel0 = this.detectFirstSpace(value[1].trim())
        arrPadre = this.detectFirstSpace(value[0].trim())
        objItem = { codigo: arrHijo[0], descripcion: arrHijo[1], codigoDepartamento: arrPadre[0], descripcionDepartamento: arrPadre[1], codigoProvincia: arrNivel0[0], descripcionProvincia: arrNivel0[1] };
        if (!this.existInArray(this.state.distritos, objItem.codigo)) {
          this.state.distritos.push(objItem);
        }
      }
    }
  }

  llenarData() {
    let indicador = 0;
    this.state.dataInitial.forEach((item) => {
      this.setDataArray(item, this.types.departamento);
      indicador = item.length;
      switch (indicador) {
        case 2:
          this.setDataArray(item, this.types.provincia);
          break;
        case 3:
          this.setDataArray(item, this.types.distrito);
          break;
        default:
          break;
      };
    })
  }

  existInArray(array, codDepartamento) {
    let c = 0;
    array.forEach( function iterator( item ) {
      if (item.codigo === codDepartamento) {
        c++;
      }
    })
    return (c > 0)
  }

  detectFirstSpace(text) {
    let arrayClean = []
    for (let i = -1; (i = text.indexOf(' ', i + 1)) !== -1; i++) {
      arrayClean.push(text.substring(0, i));
      arrayClean.push(text.substring(i + 1, text.length));
    }
    return arrayClean;
  }

  renderTables() {
    this.renderTableDepartamento();
    this.renderTableProvincia();
    this.renderTableDistrito();
  }

  renderTableDepartamento() {
    var preview = document.getElementById('departamento');
    for (var i=0; i < this.state.departamentos.length; i++) {
      var item = this.state.departamentos[i]
      preview.innerHTML +="<tr>" +
                            "<td>" + item.codigo + "</td>" +
                            "<td>" + item.descripcion + "</td>" +
                            "<td> -- </td>" +
                            "<td> -- </td>" +
                          "</tr>";
    }
  }

  renderTableProvincia() {
    var preview = document.getElementById('provincia');
    for (var i=0; i < this.state.provincias.length; i++) {
      var item = this.state.provincias[i]
      preview.innerHTML +="<tr>" +
                            "<td>" + item.codigo + "</td>" +
                            "<td>" + item.descripcion + "</td>" +
                            "<td>" + item.codigoDepartamento + "</td>" +
                            "<td>" + item.descripcionDepartamento + "</td>" +
                          "</tr>";
    }
  }

  renderTableDistrito() {
    var preview = document.getElementById('distrito');
    for (var i=0; i < this.state.distritos.length; i++) {
      var item = this.state.distritos[i]
      preview.innerHTML +="<tr>" +
                            "<td>" + item.codigo + "</td>" +
                            "<td>" + item.descripcion + "</td>" +
                            "<td>" + item.codigoProvincia + "</td>" +
                            "<td>" + item.descripcionProvincia + "</td>" +
                          "</tr>";
    }
  }

  render() {

    return (
      <div>
        <h3>Seleccione un archivo</h3>
        <input type="file" onChange={this.handleUploadFile} />

        <div>
          <h2>------------------------</h2>
          <h2>Resultado</h2>
          <h2>------------------------</h2>
          <h3>Departamentos</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Codigo padre</th>
                <th>Descripcion padre</th>
              </tr>
            </thead>
            <tbody id="departamento">
            </tbody>
          </table>

          <h3>Provincias</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Codigo padre</th>
                <th>Descripcion padre</th>
              </tr>
            </thead>
            <tbody id="provincia">
            </tbody>
          </table>

          <h3>Distritos</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Codigo padre</th>
                <th>Descripcion padre</th>
              </tr>
            </thead>
            <tbody id="distrito">
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}


export default App;
