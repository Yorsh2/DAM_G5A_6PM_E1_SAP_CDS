const mongoose = require('mongoose');

/**
 * ESQUEMA PARA COLECCIÓN ZTRoles
 * 
 * Archivos CDS relacionados:
 * - sec-roles.cds: Contiene la definición principal de Roles
 * - common.cds: Proporciona la estructura DETAIL_ROW (auditoría)
 *
 */

const roleSchema = new mongoose.Schema({
    // ESTRUCTURA PRINCIPAL (sec-roles.cds)
    ROLEID: { type: String, required: true, unique: true }, // <- sec-roles.cds (campo clave)
    ROLENAME: { type: String, required: true },             // <- sec-roles.cds
    DESCRIPTION: { type: String, required: true },          // <- sec-roles.cds
    PRIVILEGES: [{
        PROCESSID: { type: String, required: true },        // <- sec-roles.cds (RolePrivileges)
        PRIVILEGEID: [{ type: String, required: true }]     // <- sec-roles.cds (relación con Privileges)
    }],                                                     // <- sec-roles.cds (array de Privileges)

    // ESTRUCTURA DE AUDITORÍA (common.cds)
    DETAIL_ROW: {                                           // <- common.cds (AuditDetail)
        ACTIVED: { type: Boolean, default: true },          // <- common.cds
        DELETED: { type: Boolean, default: false },         // <- common.cds
        DETAIL_ROW_REG: [{                                  // <- common.cds (AuditDetailReg)
            CURRENT: { type: Boolean, required: true },     // <- common.cds
            REGDATE: { type: Date, default: Date.now },     // <- common.cds
            REGTIME: { type: Date, default: Date.now },     // <- common.cds
            REGUSER: { type: String, required: true }   // <- common.cds
        }]
    }
},{
    collection: 'ZTRoles',
    timestamps: false // Usamos nuestro propio sistema de auditoría
});

// Índices para optimización
roleSchema.index({ ROLEID: 1 }, { unique: true }); // Índice único para ROLEID
roleSchema.index({ ROLENAME: 1 }); // Índice para búsqueda por nombre de rol

module.exports = mongoose.model(
    'ZTRoles',     // Nombre del modelo
    roleSchema,    // Esquema definido
    'ZTRoles'      // Nombre de la colección en MongoDB
);