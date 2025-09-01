# CertFlow Portal - Sistema de Gerenciamento de Tokens

## 🚀 Portal Web Simples para Administração

Este portal permite gerenciar clientes e tokens de acesso para a API CertFlow de forma simples e intuitiva.

### ✨ Funcionalidades

- **Dashboard com estatísticas** em tempo real
- **Gerenciamento de clientes** (criar, editar, desativar)
- **Geração de tokens** com validade configurável
- **Histórico completo** de tokens e uso
- **Interface responsiva** e moderna
- **Dados persistentes** via localStorage

### 🛠 Como Usar

#### 1. Execução Local
```bash
# Simplesmente abra o arquivo index.html no navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

#### 2. Hospedar Online (GitHub Pages)
```bash
# 1. Crie um repositório no GitHub
# 2. Faça upload dos arquivos
# 3. Ative GitHub Pages nas configurações
# 4. Acesse via: https://seuusuario.github.io/certflow-portal
```

#### 3. Integração com a API

Para integrar com a API CertFlow, adicione este middleware de validação:

```csharp
// No Program.cs da API
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;
    
    // Pular validação para health check e swagger
    if (path.Contains("/health") || path.Contains("/swagger"))
    {
        await next();
        return;
    }
    
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Token de autorização necessário");
        return;
    }
    
    var token = authHeader.Substring("Bearer ".Length).Trim();
    
    // Validar token (implementar conforme sua lógica)
    if (!IsValidToken(token))
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Token inválido ou expirado");
        return;
    }
    
    await next();
});
```

### 📋 Fluxo de Trabalho

1. **Administrador acessa o portal**
2. **Cria novo cliente** com dados da empresa
3. **Sistema gera token automaticamente**
4. **Token é enviado para o cliente**
5. **Cliente configura a API** com o token
6. **Administrador monitora uso** pelo dashboard

### 🔧 Configuração do Cliente

O cliente deve configurar o token na API usando uma dessas formas:

#### Opção 1: Variável de Ambiente
```bash
set CERTFLOW_API_TOKEN=certflow_abc123...
```

#### Opção 2: Arquivo de Configuração
```json
{
  "Authentication": {
    "ApiToken": "certflow_abc123..."
  }
}
```

#### Opção 3: Header da Requisição
```bash
curl -X POST "http://localhost:8080/api/pdf/merge-and-sign" \
  -H "Authorization: Bearer certflow_abc123..." \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 📊 Funcionalidades do Portal

#### Dashboard
- Total de clientes ativos
- Número de tokens válidos
- Estatísticas de uso diário

#### Gerenciamento de Clientes
- Criar novos clientes
- Editar informações
- Desativar clientes
- Gerar novos tokens

#### Controle de Tokens
- Visualizar todos os tokens
- Status (ativo/expirado/revogado)
- Revogar tokens manualmente
- Histórico de uso

### 🛡 Segurança

- Tokens são únicos e aleatórios
- Validação de expiração automática
- Revogação manual disponível
- Logs de acesso e uso
- Interface administrativa protegida

### 🎨 Personalização

O portal pode ser facilmente personalizado:

- **Cores e tema**: Edite `styles.css`
- **Funcionalidades**: Modifique `script.js`
- **Layout**: Ajuste `index.html`
- **Integração**: Adapte conforme sua API

### 📱 Responsivo

O portal funciona perfeitamente em:
- Desktop
- Tablets
- Smartphones
- Diferentes navegadores

---

**Desenvolvido para facilitar o gerenciamento da API CertFlow** 🚀
