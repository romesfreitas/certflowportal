// Configuração do GitHub para validação de tokens
const GITHUB_CONFIG = {
    // Substitua pelos seus dados
    username: 'romesfreitas',
    gistId: '', // Será criado automaticamente
    accessToken: '', // GitHub Personal Access Token
    gistFilename: 'certflow_tokens.json'
};

// Classe para gerenciar tokens via GitHub Gist
class GitHubTokenManager {
    constructor(config) {
        this.config = config;
        this.tokens = [];
        this.clients = [];
    }

    // Criar Gist inicial se não existir
    async initializeGist() {
        if (this.config.gistId) {
            await this.loadFromGist();
            return;
        }

        // Criar novo Gist
        const initialData = {
            version: "1.0",
            lastUpdated: new Date().toISOString(),
            clients: [],
            tokens: [],
            usage: []
        };

        try {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.config.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'CertFlow API - Token Management Database',
                    public: false,
                    files: {
                        [this.config.gistFilename]: {
                            content: JSON.stringify(initialData, null, 2)
                        }
                    }
                })
            });

            if (response.ok) {
                const gist = await response.json();
                this.config.gistId = gist.id;
                console.log('Gist criado com sucesso:', gist.id);
                
                // Salvar ID do Gist no localStorage
                localStorage.setItem('certflow_gist_id', gist.id);
                
                return gist.id;
            } else {
                throw new Error('Erro ao criar Gist');
            }
        } catch (error) {
            console.error('Erro ao inicializar Gist:', error);
            throw error;
        }
    }

    // Carregar dados do Gist
    async loadFromGist() {
        if (!this.config.gistId) {
            throw new Error('Gist ID não configurado');
        }

        try {
            const response = await fetch(`https://api.github.com/gists/${this.config.gistId}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gist = await response.json();
                const fileContent = gist.files[this.config.gistFilename]?.content;
                
                if (fileContent) {
                    const data = JSON.parse(fileContent);
                    this.clients = data.clients || [];
                    this.tokens = data.tokens || [];
                    this.usage = data.usage || [];
                    return data;
                }
            } else {
                throw new Error('Erro ao carregar dados do Gist');
            }
        } catch (error) {
            console.error('Erro ao carregar do Gist:', error);
            throw error;
        }
    }

    // Salvar dados no Gist
    async saveToGist() {
        if (!this.config.gistId || !this.config.accessToken) {
            throw new Error('Configuração do GitHub incompleta');
        }

        const data = {
            version: "1.0",
            lastUpdated: new Date().toISOString(),
            clients: this.clients,
            tokens: this.tokens,
            usage: this.usage
        };

        try {
            const response = await fetch(`https://api.github.com/gists/${this.config.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.config.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [this.config.gistFilename]: {
                            content: JSON.stringify(data, null, 2)
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar no Gist');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao salvar no Gist:', error);
            throw error;
        }
    }

    // Validar token (função pública para API)
    async validateToken(token) {
        try {
            await this.loadFromGist();
            
            const tokenObj = this.tokens.find(t => t.token === token && t.isActive);
            if (!tokenObj) {
                return {
                    isValid: false,
                    errorMessage: 'Token não encontrado ou inativo'
                };
            }

            const isExpired = new Date(tokenObj.expiresAt) < new Date();
            if (isExpired) {
                return {
                    isValid: false,
                    errorMessage: 'Token expirado'
                };
            }

            const client = this.clients.find(c => c.id === tokenObj.clientId);
            if (!client || !client.isActive) {
                return {
                    isValid: false,
                    errorMessage: 'Cliente inativo'
                };
            }

            // Atualizar último uso
            tokenObj.lastUsed = new Date().toISOString();
            await this.saveToGist();

            return {
                isValid: true,
                clientId: client.id,
                companyName: client.companyName,
                expiresAt: tokenObj.expiresAt,
                tokenId: tokenObj.id
            };
        } catch (error) {
            return {
                isValid: false,
                errorMessage: 'Erro interno na validação: ' + error.message
            };
        }
    }

    // Registrar uso do token
    async logUsage(token, endpoint, success = true, errorMessage = null) {
        try {
            const tokenObj = this.tokens.find(t => t.token === token);
            if (!tokenObj) return;

            this.usage.push({
                id: Math.max(...this.usage.map(u => u.id), 0) + 1,
                tokenId: tokenObj.id,
                endpoint,
                requestTime: new Date().toISOString(),
                success,
                errorMessage
            });

            // Manter apenas os últimos 1000 registros
            if (this.usage.length > 1000) {
                this.usage = this.usage.slice(-1000);
            }

            await this.saveToGist();
        } catch (error) {
            console.error('Erro ao registrar uso:', error);
        }
    }

    // Adicionar cliente
    async addClient(companyName, email, tokenExpiryDays = 90) {
        await this.loadFromGist();

        const newClient = {
            id: Math.max(...this.clients.map(c => c.id), 0) + 1,
            companyName,
            email,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        this.clients.push(newClient);

        // Gerar token inicial
        const token = this.generateToken(newClient.id, tokenExpiryDays);

        await this.saveToGist();

        return {
            client: newClient,
            token: token.token
        };
    }

    // Gerar token
    generateToken(clientId, expiryDays) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

        const token = {
            id: Math.max(...this.tokens.map(t => t.id), 0) + 1,
            clientId,
            token: "certflow_" + this.generateRandomString(48),
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            isActive: true,
            lastUsed: null
        };

        this.tokens.push(token);
        return token;
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// API pública para validação de tokens
window.GitHubTokenAPI = {
    manager: null,

    // Inicializar com configuração
    async initialize(githubUsername, accessToken, gistId = null) {
        const config = {
            username: githubUsername,
            gistId: gistId || localStorage.getItem('certflow_gist_id'),
            accessToken: accessToken,
            gistFilename: 'certflow_tokens.json'
        };

        this.manager = new GitHubTokenManager(config);

        try {
            if (!config.gistId) {
                await this.manager.initializeGist();
            } else {
                await this.manager.loadFromGist();
            }
            return true;
        } catch (error) {
            console.error('Erro ao inicializar GitHub Token API:', error);
            return false;
        }
    },

    // Validar token (para usar na API CertFlow)
    async validateToken(token) {
        if (!this.manager) {
            throw new Error('GitHub Token API não inicializada');
        }
        return await this.manager.validateToken(token);
    },

    // Registrar uso
    async logUsage(token, endpoint, success, errorMessage = null) {
        if (!this.manager) return;
        return await this.manager.logUsage(token, endpoint, success, errorMessage);
    }
};

// Função para integrar com o portal existente
window.integrateWithGitHub = async function() {
    // Solicitar configuração do GitHub
    const githubUsername = prompt('Seu usuário do GitHub:', 'romesfreitas');
    if (!githubUsername) return;

    const accessToken = prompt('GitHub Personal Access Token:\n(Necessário para criar/editar Gists)');
    if (!accessToken) return;

    const gistId = prompt('ID do Gist existente (deixe vazio para criar novo):');

    try {
        const success = await window.GitHubTokenAPI.initialize(githubUsername, accessToken, gistId);
        
        if (success) {
            alert('✅ Integração com GitHub configurada com sucesso!');
            
            // Salvar configuração no localStorage
            localStorage.setItem('github_username', githubUsername);
            localStorage.setItem('github_token', accessToken); // Em produção, use um método mais seguro
            
            // Atualizar interface para mostrar status
            showGitHubIntegrationStatus(true);
            
            return true;
        } else {
            alert('❌ Erro ao configurar integração com GitHub');
            return false;
        }
    } catch (error) {
        alert('❌ Erro: ' + error.message);
        return false;
    }
};

// Mostrar status da integração
function showGitHubIntegrationStatus(isConnected) {
    const header = document.querySelector('.header');
    const statusDiv = document.getElementById('github-status') || document.createElement('div');
    statusDiv.id = 'github-status';
    statusDiv.className = 'github-status';
    
    if (isConnected) {
        statusDiv.innerHTML = `
            <i class="fab fa-github"></i>
            <span>Conectado ao GitHub</span>
            <button onclick="disconnectGitHub()" class="btn-disconnect">Desconectar</button>
        `;
        statusDiv.style.background = '#28a745';
    } else {
        statusDiv.innerHTML = `
            <i class="fab fa-github"></i>
            <span>Não conectado</span>
            <button onclick="integrateWithGitHub()" class="btn-connect">Conectar GitHub</button>
        `;
        statusDiv.style.background = '#6c757d';
    }
    
    if (!document.getElementById('github-status')) {
        header.appendChild(statusDiv);
    }
}

// Desconectar GitHub
window.disconnectGitHub = function() {
    if (confirm('Desconectar do GitHub? Os dados locais serão mantidos.')) {
        localStorage.removeItem('github_username');
        localStorage.removeItem('github_token');
        localStorage.removeItem('certflow_gist_id');
        window.GitHubTokenAPI.manager = null;
        showGitHubIntegrationStatus(false);
    }
};

// Verificar conexão existente ao carregar
document.addEventListener('DOMContentLoaded', async function() {
    const savedUsername = localStorage.getItem('github_username');
    const savedToken = localStorage.getItem('github_token');
    const savedGistId = localStorage.getItem('certflow_gist_id');
    
    if (savedUsername && savedToken) {
        try {
            const success = await window.GitHubTokenAPI.initialize(savedUsername, savedToken, savedGistId);
            showGitHubIntegrationStatus(success);
        } catch (error) {
            showGitHubIntegrationStatus(false);
        }
    } else {
        showGitHubIntegrationStatus(false);
    }
});
