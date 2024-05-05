import "./App.css"; // Importa el archivo de estilos CSS
import { useState } from "react"; // Importa la función useState de React, que permite manejar el estado del componente
import Axios from "axios"; // Importa Axios para realizar solicitudes HTTP

import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2";

function App() {
  // Define el estado del componente con useState
  const [nombre, setNombre] = useState(""); // Estado para el nombre del empleado
  const [edad, setEdad] = useState(); // Estado para la edad del empleado
  const [pais, setPais] = useState(""); // Estado para el país del empleado
  const [cargo, setCargo] = useState(""); // Estado para el cargo del empleado
  const [anios, setAnios] = useState(); // Estado para los años de experiencia del empleado
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);

  const [empleadosList, setEmpleados] = useState([]);

  // Función para agregar un nuevo empleado
  const add = () => {
    // Realiza una solicitud POST al servidor local con los datos del empleado
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    })
      .then(() => {
        getEmpleados();
        // Después de que la solicitud se complete, muestra una alerta indicando que el empleado ha sido registrado
        limpiarCampos();
        Swal.fire({
          title: "<strong>Empleado registrado!!!</strong>",
          html:
            "<i>El empleado <strong>" +
            nombre +
            "</strong> ha sido registrado correctamente</i>",
          icon: "success",
          timer: 3000,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "No se pudo agregar el empleado.",
          footer:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Intente mas tarde"
              : JSON.parse(JSON.stringify(error)).message,
        });
      });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: "<strong>Empleado actualizado!!!</strong>",
          html:
            "<i>El empleado <strong>" +
            nombre +
            "</strong> fue actualizado con éxito</i>",
          icon: "success",
          timer: 3000,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "No se pudo actualizar el empleado.",
          footer:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Intente mas tarde"
              : JSON.parse(JSON.stringify(error)).message,
        });
      });
  };

  const deleteEmpleado = (val) => {
    Swal.fire({
      title: "Confirmar eliminado?",
      html:
        "<i>Realmente desea eliminar a <strong>" +
        val.nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados();
            limpiarCampos();
            Swal.fire({
              title: "Eliminado!",
              text: val.nombre + " fue eliminado.",
              icon: "success",
              timer: 3000,
            });
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "No se pudo eliminar el empleado.",
              footer:
                JSON.parse(JSON.stringify(error)).message === "Network Error"
                  ? "Intente mas tarde"
                  : JSON.parse(JSON.stringify(error)).message,
            });
          });
      }
    });
  };

  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setId("");
    setEditar(false);
  };

  const editarEmpleado = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);

    setId(val.id);
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los empleados:", error);
        if (error.response) {
          // La petición fue hecha y el servidor respondió con un estado de error
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          console.error(error.request);
        } else {
          // Algo más causó un error
          console.error("Error", error.message);
        }
      });
  };

  getEmpleados();

  // Renderiza el componente
  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">GESTION DE EMPLEADOS</div>
        <div className="card-body">
          {/* Etiquetas para ingresar los datos del empleado */}

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre:
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value); // Actualiza el estado del nombre cuando cambia el valor del input
              }}
              className="form-control"
              placeholder="Ingrese un nombre"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Edad:
            </span>
            <input
              type="number"
              value={edad}
              onChange={(event) => {
                setEdad(event.target.value); // Actualiza el estado de la edad cuando cambia el valor del input
              }}
              className="form-control"
              placeholder="Ingrese una edad"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              País:
            </span>
            <input
              type="text"
              value={pais}
              onChange={(event) => {
                setPais(event.target.value); // Actualiza el estado del país cuando cambia el valor del input
              }}
              className="form-control"
              placeholder="Ingrese un país"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Cargo:
            </span>
            <input
              type="text"
              value={cargo}
              onChange={(event) => {
                setCargo(event.target.value); // Actualiza el estado del cargo cuando cambia el valor del input
              }}
              className="form-control"
              placeholder="Ingrese un cargo"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Años:
            </span>
            <input
              type="number"
              value={anios}
              onChange={(event) => {
                setAnios(event.target.value); // Actualiza el estado de los años de experiencia cuando cambia el valor del input
              }}
              className="form-control"
              placeholder="Ingrese años de experiencia"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>

              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">País</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/*<button onClick={getEmpleados}>Listar</button>*/}

          {empleadosList.map((val, key) => {
            return (
              <tr key={val.id}>
                <th>{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        editarEmpleado(val);
                      }}
                      className="btn btn-info"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteEmpleado(val);
                      }}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App; // Exporta el componente App para que pueda ser utilizado en otros archivos