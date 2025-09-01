// Simulação de dados (em produção, isso viria de uma API real)
let clients = [];
let tokens = [];
let usage = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDashboard();
    renderClients();
    renderTokens();
    
    // Setup do formulário
    document.getElementById('newClientForm').addEventListener('submit', handleNewClient);
});

// Carrega dados do localStorage (simulando um banco de dados)
function loadData() {
    clients = JSON.parse(localStorage.getItem('certflow_clients')) || [];
    tokens = JSON.parse(localStorage.getItem('certflow_tokens')) || [];
    usage = JSON.parse(localStorage.getItem('certflow_usage')) || [];
    
    // Dados de exemplo se estiver vazio
    if (clients.length === 0) {
        const exampleData = generateExampleData();
        clients = exampleData.clients;
        tokens = exampleData.tokens;
        usage = exampleData.usage;
        saveData();
    }
}

// Salva dados no localStorage
function saveData() {
    localStorage.setItem('certflow_clients', JSON.stringify(clients));
    localStorage.setItem('certflow_tokens', JSON.stringify(tokens));
    localStorage.setItem('certflow_usage', JSON.stringify(usage));
}

// Gera dados de exemplo
function generateExampleData() {
    const now = new Date();
    const exampleClients = [
        {
            id: 1,
            companyName: "Tech Solutions LTDA",
            email: "admin@techsolutions.com",
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
        },
        {
            id: 2,
            companyName: "Digital Corp",
            email: "contato@digitalcorp.com.br",
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
        }
    ];
    
    const exampleTokens = [
        {
            id: 1,
            clientId: 1,
            token: "certflow_" + generateRandomString(32),
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            lastUsed: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            clientId: 2,
            token: "certflow_" + generateRandomString(32),
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            lastUsed: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    const exampleUsage = [];
    for (let i = 0; i < 50; i++) {
        exampleUsage.push({
            id: i + 1,
            tokenId: Math.random() > 0.5 ? 1 : 2,
            endpoint: '/api/pdf/merge-and-sign',
            requestTime: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            success: Math.random() > 0.1
        });
    }
    
    return {
        clients: exampleClients,
        tokens: exampleTokens,
        usage: exampleUsage
    };
}

// Atualiza o dashboard com estatísticas
function updateDashboard() {
    document.getElementById('totalClients').textContent = clients.filter(c => c.isActive).length;
    document.getElementById('activeTokens').textContent = tokens.filter(t => t.isActive && new Date(t.expiresAt) > new Date()).length;
    
    const today = new Date().toDateString();
    const todayUsage = usage.filter(u => new Date(u.requestTime).toDateString() === today).length;
    document.getElementById('todayUsage').textContent = todayUsage;
}

// Renderiza a tabela de clientes
function renderClients() {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '';
    
    clients.forEach(client => {
        const activeToken = tokens.find(t => t.clientId === client.id && t.isActive);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${client.id}</td>
            <td><strong>${client.companyName}</strong></td>
            <td>${client.email}</td>
            <td>
                ${activeToken ? 
                    `<code>${activeToken.token.substring(0, 12)}...${activeToken.token.slice(-8)}</code>` : 
                    '<span class="text-muted">Nenhum</span>'
                }
            </td>
            <td>
                ${activeToken ? 
                    formatDate(activeToken.expiresAt) : 
                    '<span class="text-muted">-</span>'
                }
            </td>
            <td>
                <span class="status-badge ${client.isActive ? 'status-active' : 'status-expired'}">
                    ${client.isActive ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-success" onclick="generateNewToken(${client.id})" title="Gerar Novo Token">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn btn-warning" onclick="editClient(${client.id})" title="Editar Cliente">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deactivateClient(${client.id})" title="Desativar Cliente">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Renderiza a tabela de tokens
function renderTokens() {
    const tbody = document.getElementById('tokensTableBody');
    tbody.innerHTML = '';
    
    tokens.slice().reverse().forEach(token => {
        const client = clients.find(c => c.id === token.clientId);
        const row = document.createElement('tr');
        
        const isExpired = new Date(token.expiresAt) < new Date();
        const status = !token.isActive ? 'revoked' : (isExpired ? 'expired' : 'active');
        
        row.innerHTML = `
            <td><code>${token.token.substring(0, 12)}...${token.token.slice(-8)}</code></td>
            <td>${client ? client.companyName : 'Cliente removido'}</td>
            <td>${formatDate(token.createdAt)}</td>
            <td>${formatDate(token.expiresAt)}</td>
            <td>${token.lastUsed ? formatDate(token.lastUsed) : '<span class="text-muted">Nunca</span>'}</td>
            <td>
                <span class="status-badge status-${status}">
                    ${status === 'active' ? 'Ativo' : status === 'expired' ? 'Expirado' : 'Revogado'}
                </span>
            </td>
            <td>
                ${token.isActive && !isExpired ? 
                    `<button class="btn btn-danger" onclick="revokeToken(${token.id})" title="Revogar Token">
                        <i class="fas fa-times"></i>
                    </button>` : 
                    '<span class="text-muted">-</span>'
                }
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Manipula o formulário de novo cliente
function handleNewClient(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const companyName = formData.get('companyName');
    const email = formData.get('email');
    const tokenExpiry = parseInt(formData.get('tokenExpiry'));
    
    // Cria novo cliente
    const newClient = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        companyName,
        email,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    clients.push(newClient);
    
    // Gera token inicial
    const token = generateToken(newClient.id, tokenExpiry);
    
    // Salva dados
    saveData();
    
    // Atualiza interface
    updateDashboard();
    renderClients();
    renderTokens();
    
    // Mostra o token gerado
    showGeneratedToken(token.token);
    
    // Fecha modal e limpa formulário
    closeModal('newClientModal');
    event.target.reset();
}

// Gera um novo token para um cliente
function generateNewToken(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Desativa tokens anteriores do cliente
    tokens.forEach(t => {
        if (t.clientId === clientId) {
            t.isActive = false;
        }
    });
    
    // Gera novo token (90 dias por padrão)
    const token = generateToken(clientId, 90);
    
    saveData();
    updateDashboard();
    renderClients();
    renderTokens();
    
    showGeneratedToken(token.token);
}

// Gera um token
function generateToken(clientId, expiryDays) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    
    const token = {
        id: Math.max(...tokens.map(t => t.id), 0) + 1,
        clientId,
        token: "certflow_" + generateRandomString(48),
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        lastUsed: null
    };
    
    tokens.push(token);
    return token;
}

// Revoga um token
function revokeToken(tokenId) {
    if (confirm('Tem certeza que deseja revogar este token? Esta ação não pode ser desfeita.')) {
        const token = tokens.find(t => t.id === tokenId);
        if (token) {
            token.isActive = false;
            saveData();
            updateDashboard();
            renderClients();
            renderTokens();
        }
    }
}

// Desativa um cliente
function deactivateClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    if (confirm(`Tem certeza que deseja desativar o cliente "${client.companyName}"? Todos os tokens serão revogados.`)) {
        client.isActive = false;
        
        // Revoga todos os tokens do cliente
        tokens.forEach(t => {
            if (t.clientId === clientId) {
                t.isActive = false;
            }
        });
        
        saveData();
        updateDashboard();
        renderClients();
        renderTokens();
    }
}

// Edita um cliente
function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const newCompanyName = prompt('Nome da empresa:', client.companyName);
    if (newCompanyName && newCompanyName !== client.companyName) {
        client.companyName = newCompanyName;
        saveData();
        renderClients();
        renderTokens();
    }
}

// Atualiza tokens
function refreshTokens() {
    renderTokens();
}

// Funções de modal
function showNewClientModal() {
    document.getElementById('newClientModal').style.display = 'block';
}

function showGeneratedToken(token) {
    document.getElementById('generatedToken').textContent = token;
    document.getElementById('tokenModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Copia token para área de transferência
function copyToken() {
    const tokenText = document.getElementById('generatedToken').textContent;
    navigator.clipboard.writeText(tokenText).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '#667eea';
        }, 2000);
    });
}

// Utilitários
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Fechar modal clicando fora
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// API para validação de tokens (simulada)
window.CertFlowAPI = {
    validateToken: function(token) {
        const tokenObj = tokens.find(t => t.token === token && t.isActive);
        if (!tokenObj) return false;
        
        const isExpired = new Date(tokenObj.expiresAt) < new Date();
        if (isExpired) return false;
        
        // Atualiza último uso
        tokenObj.lastUsed = new Date().toISOString();
        saveData();
        
        return true;
    },
    
    logUsage: function(token, endpoint, success = true) {
        const tokenObj = tokens.find(t => t.token === token);
        if (!tokenObj) return;
        
        usage.push({
            id: Math.max(...usage.map(u => u.id), 0) + 1,
            tokenId: tokenObj.id,
            endpoint,
            requestTime: new Date().toISOString(),
            success
        });
        
        saveData();
    }
};
