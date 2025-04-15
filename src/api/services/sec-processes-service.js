const Processes = require('../models/mongodb/security/ztvalues');

async function GetAllProcesses(req) {
    try {
        const { processid, active, category } = req.req.query;
        const filter = { 'DETAIL_ROW.DELETED': false };

        if (processid) filter.PROCESSID = processid;
        if (active !== undefined) filter['DETAIL_ROW.ACTIVED'] = active === 'true';
        if (category) filter.CATEGORY = category;

        return await Processes.find(filter)
            .select('-DETAIL_ROW.DETAIL_ROW_REG')
            .lean();
    } catch (error) {
        throw new Error(`Error al obtener procesos: ${error.message}`);
    }
}

async function GetProcessById(req) {
    try {
        const processid = req.req.params.processid || req.req.query.processid;
        const process = await Processes.findOne({
            PROCESSID: processid,
            'DETAIL_ROW.DELETED': false
        }).lean();

        if (!process) throw new Error('Proceso no encontrado');
        return process;
    } catch (error) {
        throw new Error(`Error al buscar proceso: ${error.message}`);
    }
}

async function createProcesses(req) {
try {
        const newValue = req.req.body.value;

        if (!newValue || !newValue.VALUEID) {
            throw new Error('Datos de valor incompletos');
        }

        const exists = await Values.findOne({ VALUEID: newValue.VALUEID });
        if (exists) {
            throw new Error('El VALUEID ya está registrado');
        }

        const auditEntry = {
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: newValue.VALUEID || 'system'
        };

        const valueToCreate = {
            ...newValue,
            DETAIL_ROW: {
                ACTIVED: true,
                DELETED: false,
                DETAIL_ROW_REG: [auditEntry]
            }
        };

        const result = await Values.insertMany([valueToCreate], { ordered: true });
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'El VALUEID ya existe';
        }
        throw error;
    }
}

async function UpdateProcess(req) {
    const { processid, process } = req.data;

    if (!processid) {
        throw new Error('Parámetro "processid" es requerido');
    }

    const existing = await SELECT.one.from(db.Processes).where({ PROCESSID: processid });

    if (!existing) {
        throw new Error(`El proceso con ID "${processid}" no existe. No se puede actualizar.`);
    }

    await UPDATE(db.Processes).set(process).where({ PROCESSID: processid });

    return await SELECT.one.from(db.Processes).where({ PROCESSID: processid });
}

async function DeactivateProcess(req) {
    try {
        const processid = req.req.params.processid || req.req.query.processid;
        const reguser = req.req.body.REGUSER || 'system';

        const auditEntry = {
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: reguser
        };

        const updatedProcess = await Processes.findOneAndUpdate(
            { PROCESSID: processid },
            {
                'DETAIL_ROW.ACTIVED': false,
                $push: { 'DETAIL_ROW.DETAIL_ROW_REG': auditEntry }
            },
            { new: true }
        ).lean();

        if (!updatedProcess) {
            throw new Error('Proceso no encontrado');
        }

        return updatedProcess;
    } catch (error) {
        throw new Error(`Error al desactivar proceso: ${error.message}`);
    }
}

async function deleteProcess(req) {
    try {
        const processid = req.req.params.processid || req.req.query.processid;
        const deletedProcess = await Processes.findOneAndDelete({ PROCESSID: processid });

        if (!deletedProcess) {
            throw new Error('Proceso no encontrado');
        }

        return { message: 'Proceso eliminado permanentemente' };
    } catch (error) {
        throw new Error(`Error al eliminar proceso: ${error.message}`);
    }
}

module.exports = {
    GetAllProcesses,
    GetProcessById,
    createProcesses,
    UpdateProcess,
    DeactivateProcess,
    deleteProcess
};
