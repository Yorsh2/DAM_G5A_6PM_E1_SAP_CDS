const cds = require('@sap/cds');

const {
    GetAllProcesses,
    GetProcessById,
    createProcesses,
    UpdateProcess,
    DeactivateProcess,
    deleteProcess
} = require('../services/sec-processes-service');

class ProcessesController extends cds.ApplicationService {

    async init() {

        this.on('getAllProcesses', async (req) => {
            try {
                return await GetAllProcesses(req);
            } catch (error) {
                req.error(500, error.message);
            }
        });

        this.on('getProcessById', async (req) => {
            try {
                return await GetProcessById(req);
            } catch (error) {
                req.error(error.message.includes('no encontrado') ? 404 : 500, error.message);
            }
        });

        this.on('createProcesses', async (req) => {
            try {
                return await createProcesses(req);
            } catch (error) {
                req.error(error.message.includes('ya está en uso') ? 400 : 500, error.message);
            }
        });

        this.on('UPDATE', 'processes', async (req) => {
            const { PROCESSID } = req.data;

            const existing = await SELECT.one.from('mysec.Processes').where({ PROCESSID });
            if (!existing) {
                return req.error(404, `Proceso con ID ${PROCESSID} no encontrado`);
            }

            await UPDATE('mysec.Processes').set(req.data).where({ PROCESSID });
            return await SELECT.one.from('mysec.Processes').where({ PROCESSID });
        });

        this.on('updateProcess', async (req) => {
            try {
                return await UpdateProcess(req);
            } catch (error) {
                req.error(400, error.message);
            }
        });

        this.on('deactivateProcess', async (req) => {
            try {
                return await DeactivateProcess(req);
            } catch (error) {
                req.error(error.message.includes('no encontrado') ? 404 : 500, error.message);
            }
        });

        this.on('deleteProcess', async (req) => {
            try {
                return await deleteProcess(req);
            } catch (error) {
                req.error(error.message.includes('no encontrado') ? 404 : 500, error.message);
            }
        });

        return await super.init();
    }
}

module.exports = ProcessesController;
