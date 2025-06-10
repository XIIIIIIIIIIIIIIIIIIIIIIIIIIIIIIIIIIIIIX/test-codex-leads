const leads = [];
let currentEditId = null;

function createLeadElement(lead) {
  const div = document.createElement('div');
  div.className = 'lead';
  div.draggable = true;
  div.dataset.id = lead.id;
  div.textContent = `${lead.name} (${lead.company})`;

  div.addEventListener('click', () => openEditModal(lead.id));
  div.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', lead.id);
  });
  return div;
}

function render() {
  ['new', 'contacted', 'client'].forEach(status => {
    const container = document.getElementById(status);
    container.innerHTML = '';
    leads.filter(l => l.status === status).forEach(lead => {
      container.appendChild(createLeadElement(lead));
    });
  });
}

function addLead() {
  const name = document.getElementById('leadName').value.trim();
  const email = document.getElementById('leadEmail').value.trim();
  const company = document.getElementById('leadCompany').value.trim();
  const status = document.getElementById('leadColumn').value;
  if (!name) return;
  leads.push({ id: Date.now().toString(), name, email, company, status });
  document.getElementById('leadName').value = '';
  document.getElementById('leadEmail').value = '';
  document.getElementById('leadCompany').value = '';
  render();
}

function openEditModal(id) {
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  currentEditId = id;
  document.getElementById('editName').value = lead.name;
  document.getElementById('editEmail').value = lead.email;
  document.getElementById('editCompany').value = lead.company;
  document.getElementById('editColumn').value = lead.status;
  document.getElementById('modal').classList.remove('hidden');
}

function saveLead() {
  const lead = leads.find(l => l.id === currentEditId);
  if (!lead) return;
  lead.name = document.getElementById('editName').value.trim();
  lead.email = document.getElementById('editEmail').value.trim();
  lead.company = document.getElementById('editCompany').value.trim();
  lead.status = document.getElementById('editColumn').value;
  document.getElementById('modal').classList.add('hidden');
  render();
}

function setupDragAndDrop() {
  document.querySelectorAll('.leadContainer').forEach(container => {
    container.addEventListener('dragover', e => e.preventDefault());
    container.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const lead = leads.find(l => l.id === id);
      if (lead) {
        lead.status = container.id;
        render();
      }
    });
  });
}

function init() {
  document.getElementById('addLead').addEventListener('click', addLead);
  document.getElementById('saveLead').addEventListener('click', saveLead);
  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
  });
  setupDragAndDrop();
  render();
}

document.addEventListener('DOMContentLoaded', init);
