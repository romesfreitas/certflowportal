# 🔐 CertFlow - Sistema de Token Único por Máquina

## ✨ Como Funciona

### 🎯 **Conceito Principal:**
- **Portal gera token** → Cliente recebe
- **Primeira execução** → Token se registra na máquina
- **Próximas execuções** → Token só funciona nesta máquina
- **Outra máquina** → Mesmo token é rejeitado
- **Reinstalação** → Precisa de novo token

### 🚀 **Fluxo Completo:**

#### **1. Administrator (Você):**
1. Acessa: https://romesfreitas.github.io/certflowportal/
2. Cria novo cliente
3. Portal gera token único
4. Envia token para cliente

#### **2. Cliente (Primeira Instalação):**
1. Instala CertFlow
2. Inicia API pela primeira vez
3. Sistema solicita token
4. Cliente informa token recebido
5. Token se registra na máquina

#### **3. Uso Normal:**
1. API valida token automaticamente
2. Cliente acessa funcionalidades
3. Sistema funciona normalmente

#### **4. Segurança:**
- ❌ Token não funciona em outra máquina
- ❌ Mesmo token para múltiplas instalações
- ✅ Um token = Uma máquina específica

## 🔧 **Endpoints de Setup:**

### **Registrar Token Inicial:**
```bash
POST /api/setup/register-token
{
  "token": "certflow_portal_generated_token_001"
}
```

### **Testar Token:**
```bash
POST /api/setup/test-token
{
  "token": "certflow_portal_generated_token_001"
}
```

### **Informações da Máquina:**
```bash
GET /api/setup/machine-info
```

## 🧪 **Testando Agora:**

### **Tokens Disponíveis para Teste:**
- `certflow_demo_token_for_tech_solutions_12345`
- `certflow_demo_token_for_digital_corp_67890`
- `certflow_portal_generated_token_001`
- `certflow_portal_generated_token_002`

### **Cenário 1: Primeira Vez**
1. Use Swagger: `POST /api/setup/register-token`
2. Body: `{"token": "certflow_portal_generated_token_001"}`
3. Resposta: Token registrado para esta máquina

### **Cenário 2: Usar API**
1. Use Swagger: Clique "Authorize"
2. Digite: `Bearer certflow_portal_generated_token_001`
3. Teste: `POST /api/pdf/merge-and-sign`
4. Funciona: Token válido para esta máquina

### **Cenário 3: Simulação Outra Máquina**
1. Delete arquivo: `%APPDATA%\CertFlow\machine_tokens.json`
2. Mude ID da máquina (simulação)
3. Mesmo token será rejeitado

## 📁 **Arquivos Gerados:**

### **Localização:**
```
%APPDATA%\CertFlow\machine_tokens.json
```

### **Estrutura:**
```json
{
  "certflow_portal_generated_token_001": {
    "MachineId": "ABC123DEF456...",
    "RegisteredAt": "2025-09-01T10:30:00Z",
    "MachineName": "DESKTOP-XYZ",
    "UserName": "usuario"
  }
}
```

## 🔒 **Identificação da Máquina:**

### **Componentes Usados:**
- **CPU ID** (Processador)
- **Motherboard Serial** (Placa-mãe)
- **Machine Name** (Nome da máquina)
- **User SID** (ID do usuário Windows)

### **Hash Único:**
- SHA256 dos componentes
- Impossível de replicar
- Específico para cada máquina

## 💼 **Cenários de Uso:**

### **Cliente Licenciado:**
- Compra licença → Recebe token
- Instala em 1 máquina → Funciona
- Tenta em 2ª máquina → Bloqueado
- Precisa nova licença → Novo token

### **Reinstalação:**
- Formatou PC → Precisa novo token
- Mudou hardware → Precisa novo token
- Backup/Restore → Pode funcionar

### **Suporte Técnico:**
- Cliente perdeu acesso → Gerar novo token
- Troca de equipamento → Novo token
- Verificar uso → Logs na API

## 🎛 **Portal de Administração:**

### **Funcionalidades:**
- ✅ Criar clientes
- ✅ Gerar tokens únicos
- ✅ Visualizar status
- ✅ Revogar tokens
- ✅ Histórico de uso

### **Integração:**
- Portal cria token
- Cliente registra na máquina
- API valida automaticamente
- Sistema funciona integrado

---

**Agora você tem controle total sobre onde e como seus tokens são usados!** 🚀
