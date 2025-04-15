using { sec as mysec } from '../models/security/sec-values.cds';

@impl: 'src/api/controllers/sec-processes-controller.js'

service ProcessesRoute @(path:'/api/security') {

    entity processes as projection on mysec.Values;

    // -----------------------------------------------Processes-----------------------------------------------
    @Core.Description: 'Obtener todos los procesos'
    @path: 'getAllProcesses'
    function getAllProcesses()
    returns array of processes;

    @Core.Description: 'Obtener proceso por valueid'
    @path: 'getProcessById/:processid'
    function getProcessById(valueid: String)
    returns processes;

    @Core.Description: 'Crear nuevo proceso'
    @path: 'createProcesses'
    action createProcesses(valueid: processes)
    returns processes;

    @Core.Description: 'Actualizar proceso'
    @path: 'updateProcess'
    action updateProcess(valueid: String)
    returns processes;

    @Core.Description: 'Desactivar proceso (borrado lógico)'
    @path: 'processes/:valueid/deactivate'
    action deactivateProcess()
    returns processes;

    @Core.Description: 'Eliminar proceso (borrado físico)'
    @path: 'processes/:valueid'
    action deleteProcess(valueid: String)
    returns String;
}
