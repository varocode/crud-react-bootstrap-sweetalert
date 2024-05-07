import "./App.css"; // Importa el archivo de estilos CSS
import { useState } from "react"; // Importa la función useState de React, que permite manejar el estado del componente
import Axios from "axios"; // Importa Axios para realizar solicitudes HTTP

import "bootstrap/dist/css/bootstrap.min.css"; // Importa los estilos de Bootstrap

import Swal from "sweetalert2"; // Importa SweetAlert2 para mostrar alertas personalizadas al usuario

function App() {
  // Define el estado del componente con useState
  const [nombre, setNombre] = useState(""); // Estado para el nombre del empleado
  const [edad, setEdad] = useState(); // Estado para la edad del empleado
  const [pais, setPais] = useState(""); // Estado para el país del empleado
  const [cargo, setCargo] = useState(""); // Estado para el cargo del empleado
  const [anios, setAnios] = useState(); // Estado para los años de experiencia del empleado
  const [id, setId] = useState(); // Estado para el ID del empleado

  const [editar, setEditar] = useState(false); // Estado para controlar si se está editando un empleado o no

  const [empleadosList, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados

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
        getEmpleados(); // Actualiza la lista de empleados después de agregar uno nuevo
        limpiarCampos(); // Limpia los campos del formulario
        // Muestra una alerta indicando que el empleado ha sido registrado exitosamente
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
        // En caso de error, muestra una alerta de error con un mensaje adecuado
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

  // Función para actualizar un empleado existente
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
        getEmpleados(); // Actualiza la lista de empleados después de la actualización
        limpiarCampos(); // Limpia los campos del formulario
        // Muestra una alerta indicando que el empleado ha sido actualizado exitosamente
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
        // En caso de error, muestra una alerta de error con un mensaje adecuado
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

  // Función para eliminar un empleado
  const deleteEmpleado = (val) => {
    // Muestra una confirmación al usuario antes de eliminar el empleado
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
        // Si el usuario confirma, se realiza una solicitud DELETE al servidor para eliminar el empleado
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados(); // Actualiza la lista de empleados después de la eliminación
            limpiarCampos(); // Limpia los campos del formulario
            // Muestra una alerta indicando que el empleado ha sido eliminado exitosamente
            Swal.fire({
              title: "Eliminado!",
              text: val.nombre + " fue eliminado.",
              icon: "success",
              timer: 3000,
            });
          })
          .catch(function (error) {
            // En caso de error, muestra una alerta de error con un mensaje adecuado
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

  // Función para limpiar los campos del formulario
  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setId("");
    setEditar(false);
  };

  // Función para cargar los datos de un empleado en el formulario para editar
  const editarEmpleado = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);

    setId(val.id);
  };

  // Función para obtener la lista de empleados del servidor
  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((response) => {
        setEmpleados(response.data); // Actualiza la lista de empleados en el estado del componente
      })
      .catch((error) => {
        console.error("Error al obtener los empleados:", error);
        if (error.response) {
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error("Error", error.message);
        }
      });
  };

  // Llama a la función para obtener la lista de empleados al cargar el componente
  getEmpleados();

  // Renderiza el componente
  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">GESTION DE EMPLEADOS</div>
        <div className="card-body">
          {/* Formulario para ingresar los datos del empleado */}
          {/* Input para el nombre */}
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

          {/* Input para la edad */}
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

          {/* Input para el país */}
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

          {/* Input para el cargo */}
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

          {/* Input para los años de experiencia */}
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
          {/* Botones para registrar o actualizar un empleado, dependiendo del estado de edición */}
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

      {/* Tabla para mostrar la lista de empleados */}
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
          {/* Mapea la lista de empleados y renderiza cada fila de la tabla */}
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
                  {/* Botones para editar o eliminar un empleado */}
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        editarEmpleado(val); // Carga los datos del empleado en el formulario para editar
                      }}
                      className="btn btn-info"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteEmpleado(val); // Elimina al empleado
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
