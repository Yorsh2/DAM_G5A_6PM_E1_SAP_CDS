const cds = require("@sap/cds");
//sec-roles-controller.js
const { GetAllRoles, GetRoleById, addOne, DeleteRoleById, UpdateRoleById } = 
require("../services/sec-roles-service");
class RolesClass extends cds.ApplicationService {
  async init() {
    // GET ALL
    this.on("getall", async (req) => {
      return GetAllRoles(req);
    });

    // GET by query param (id=...)
    this.on("getitem", async (req) => {
      const id = req.data?.ID;
      console.log("ID recibido:", id);
      if (!id) throw new Error("Falta el parámetro ID");

      return await GetRoleById(id);
    });

    // POST roles
    this.on("addOne", async (req) => {
      try {
        // Llamar al servicio para crear el rol
        const result = await addOne(req);  // Aquí se llama al servicio

        // Retornar el resultado con éxito
        return {
          status: 'success',
          message: 'Rol creado correctamente',
          data: result  // Devuelve el rol creado
        };
      } catch (error) {
        // Manejo de errores
        return {
          status: 'error',
          message: error.message
        };
      }
    });
    // DELETE
    this.on("deleteItem", async (req) => {
      return DeleteRoleById(req);
    });

    // PUT
    this.on("updateItem", async (req) => {
      return await UpdateRoleById({ data: req.data.role });
    });

    return await super.init();
  }
}

module.exports = RolesClass;