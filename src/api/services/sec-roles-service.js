const ZTRoles = require("../models/mongodb/security/ztroles");
const boom = require('@hapi/boom');

// Get All Roles
async function GetAllRoles(req) {
  try {
    let roles = await ZTRoles.find().lean();
    console.log(roles);
    return roles;
  } catch (error) {
    throw boom.internal('Error al obtener los roles', error);
  }
}

// Get Role by ID
async function GetRoleById(id) {
  try {
    const result = await ZTRoles.findOne({ ROLEID: id }).lean();
    if (!result) {
      throw boom.notFound(`No se encontró el rol con ROLEID=${id}`);
    }
    return result;
  } catch (error) {
    throw boom.internal(error);
  }
}

// POST (ADD) Role Record
const addOne = async (req) => {
  try {
    console.log('📥 Datos recibidos:', req);
  
    // Acceder correctamente al objeto roles
    const rolesData = req.data?.roles;
  
    // Verificar si los datos existen
    if (!rolesData) {
      throw new Error('❌ Los datos de roles están mal formateados (faltan "roles")');
    }
  
    // Desestructurar
    const { ROLEID, ROLENAME, DESCRIPTION, DETAIL_ROW, PRIVILEGES } = rolesData;
  
    console.log('🧩 Datos desestructurados:', { ROLEID, ROLENAME, DESCRIPTION, DETAIL_ROW, PRIVILEGES });
  
    // Validar campos obligatorios
    if (
      typeof ROLEID !== 'string' || ROLEID.trim() === '' ||
      typeof ROLENAME !== 'string' || ROLENAME.trim() === '' ||
      typeof DESCRIPTION !== 'string' || DESCRIPTION.trim() === '' ||
      !Array.isArray(PRIVILEGES) || PRIVILEGES.length === 0
    ) {
      const error = new Error('❌ Faltan campos obligatorios o están mal formateados');
      error.status = 400;
      throw error;
    }
  
    // Validar estructura de PRIVILEGES
    for (const privilege of PRIVILEGES) {
      if (
        typeof privilege.PROCESSID !== 'string' || privilege.PROCESSID.trim() === '' ||
        typeof privilege.PRIVILEGEID !== 'string' || privilege.PRIVILEGEID.trim() === ''
      ) {
        throw new Error('❌ Cada PRIVILEGE debe tener PROCESSID y PRIVILEGEID como string no vacíos');
      }
    }
  
    // Verificar si el rol ya existe en la base de datos
    const existingRole = await ZTRoles.findOne({ ROLEID }).lean();
    if (existingRole) {
      throw new Error(`❌ El rol con ROLEID=${ROLEID} ya existe.`);
    }
  
    // Preparar el rol a crear
    const roleToCreate = new ZTRoles({
      ROLEID,
      ROLENAME,
      DESCRIPTION,
      DETAIL_ROW,
      PRIVILEGES
    });
  
    // Guardar el rol en la base de datos
    const result = await roleToCreate.save();
    console.log('✅ Rol creado:', result);
  
    return result;
  
  } catch (error) {
    console.error('❌ Error en addOne:', error.message || error);
    throw error;
  }
};

  

// DELETE Role Record
async function DeleteRoleById(req) {
  try {
    const { ROLEID } = req.data;
    if (!ROLEID) throw boom.badRequest("Falta el parámetro ROLEID");

    const deleted = await ZTRoles.findOneAndDelete({ ROLEID }).lean();
    if (!deleted) throw boom.notFound(`No se encontró el registro con ROLEID=${ROLEID}`);

    return {
      message: "Registro eliminado correctamente",
      deleted
    };
  } catch (error) {
    throw boom.internal('Error al eliminar el rol', error);
  }
}

// PUT (Update) Role Record
async function UpdateRoleById(req) {
  try {
    const { ROLEID, ROLENAME, DESCRIPTION, DETAIL_ROW } = req.data.role;
    if (!ROLEID) throw boom.badRequest("Falta el parámetro ROLEID");

    // Validaciones de longitud
    if (ROLEID.length > 50) throw boom.badRequest("ROLEID no puede exceder los 50 caracteres");
    if (ROLENAME.length > 100) throw boom.badRequest("ROLENAME no puede exceder los 100 caracteres");
    if (DESCRIPTION.length > 200) throw boom.badRequest("DESCRIPTION no puede exceder los 200 caracteres");

    const updated = await ZTRoles.findOneAndUpdate(
      { ROLEID },
      { ROLENAME, DESCRIPTION, DETAIL_ROW },
      { new: true } // devuelve el documento actualizado
    ).lean();

    if (!updated) throw boom.notFound(`No se encontró el registro con ROLEID=${ROLEID}`);

    return {
      message: "Registro actualizado correctamente",
      updated
    };

  } catch (error) {
    throw boom.internal('Error al actualizar el rol', error);
  }
}

module.exports = {
  GetAllRoles,
  GetRoleById,
  addOne,
  DeleteRoleById,
  UpdateRoleById
};
