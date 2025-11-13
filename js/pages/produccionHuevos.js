import { produccionHuevosService } from '../api/produccionHuevos.service.js';

let modalInstance = null; // Guardará la instancia del modal
let originalFecha = null;

// --- FUNCIONES AUXILIARES ---

function createProduccionRow(produccion) {
  return `
    <tr>
      <td>${produccion.id_produccion}</td>
      <td>${produccion.nombre_galpon }</td>
      <td>${produccion.cantidad || 'Sin Cantidad'}</td>
      <td>${produccion.fecha}</td>
      <td>${produccion.tamaño}</td>

      <td class="text-end">
        <button class="btn btn-sm btn-info btn-edit-produccion" data-produccion-id="${produccion.id_produccion}">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `;
}

// --- MODAL DE EDICIÓN ---

async function openEditModal(produccionId) {
  const modalElement = document.getElementById('edit-produccion-modal');
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalElement);
  }

  try {
    const produccion = await produccionHuevosService.GetProduccionHuevosById(produccionId);

    originalFecha = produccion.fecha;
    document.getElementById('edit-produccion-id').value = produccion.id_produccion;
    document.getElementById('edit-fecha').value = produccion.id_galpon;
    document.getElementById('edit-cantidad').value = produccion.cantidad;
    document.getElementById('edit-id-tipo-huevo').value = produccion.fecha || '';

    modalInstance.show();
  } catch (error) {
    console.error(`Error al obtener datos de la producción ${produccionId}:`, error);
    alert('No se pudieron cargar los datos de la producción.');
  }
}

// --- ENVÍO DEL FORMULARIO DE ACTUALIZACIÓN ---

async function handleUpdateSubmit(event) {
  event.preventDefault();

  const produccionId = document.getElementById('edit-produccion-id').value;
  const updatedData = {
    fecha: document.getElementById('edit-fecha').value,
    cantidad: parseInt(document.getElementById('edit-cantidad').value),
    id_tipo: document.getElementById('edit-id-tipo-huevo').value
  };

  try {
    await produccionHuevosService.UpdateProduccionHuevos(produccionId, updatedData);
    modalInstance.hide();
    init(); // recarga la tabla
  } catch (error) {
    console.error(`Error al actualizar la producción ${produccionId}:`, error);
    alert('No se pudo actualizar la producción.');
  }
}

// --- CREAR NUEVA PRODUCCIÓN ---
async function handleCreateSubmit(event) {
  event.preventDefault();

  const newData = {
    id_galpon: parseInt(document.getElementById('create-id-galpon').value),
    cantidad: parseInt(document.getElementById('create-cantidad').value),
    fecha: document.getElementById('create-fecha').value,
    id_tipo_huevo: parseInt(document.getElementById('create-id-tipo-huevo').value)
  };

  try {
    await produccionHuevosService.CreateProduccionHuevos(newData);
    alert('Producción registrada correctamente.');
    event.target.reset(); // limpia el formulario
    init(); // recarga tabla
  } catch (error) {
    console.error('Error al crear la producción:', error);
    alert('No se pudo registrar la producción.');
  }
}

// --- CLICK EN LA TABLA (para editar) ---

async function handleTableClick(event) {
  const editButton = event.target.closest('.btn-edit-produccion');
  if (editButton) {
    const produccionId = editButton.dataset.produccionId;
    openEditModal(produccionId);
  }
}

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---

async function init() {
  const tableBody = document.getElementById('produccion-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando producciones...</td></tr>';

  try {
    const producciones = await produccionHuevosService.GetProduccionHuevosAll();

    if (producciones && producciones.length > 0) {
      tableBody.innerHTML = producciones.map(createProduccionRow).join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron registros.</td></tr>';
    }
  } catch (error) {
    console.error('Error al obtener producciones:', error);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar datos.</td></tr>`;
  }

  // Listener del formulario
  const editForm = document.getElementById('edit-produccion-form');
  tableBody.removeEventListener('click', handleTableClick);
  tableBody.addEventListener('click', handleTableClick);
  editForm.removeEventListener('submit', handleUpdateSubmit);
  editForm.addEventListener('submit', handleUpdateSubmit);
  const createForm = document.getElementById('create-produccion-form');
  createForm.removeEventListener('submit', handleCreateSubmit);
  createForm.addEventListener('submit', handleCreateSubmit);
}

export { init };
