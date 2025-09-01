# 🚀 **Auto-Deploy para GitHub Pages - CertFlow Portal**

## **📋 Sistema Criado**

Agora você tem um sistema completo para **automaticamente enviar atualizações do portal para GitHub** sempre que EU modificar os arquivos locais!

---

## **📁 Arquivos Criados**

### **Scripts PowerShell:**
- `setup-git.ps1` - Configuração inicial do Git
- `deploy-portal.ps1` - Deploy manual para GitHub
- `auto-watcher.ps1` - Monitoramento automático em tempo real

### **VS Code Tasks:**
- **Deploy Portal to GitHub** - Deploy manual via Command Palette
- **Start Portal Auto-Watcher** - Monitoramento automático
- **Setup Git for Portal** - Configuração inicial

---

## **🚀 Como Usar**

### **1. Configuração Inicial (Uma vez apenas)**

#### **Via PowerShell:**
```powershell
cd "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
.\setup-git.ps1
```

#### **Via VS Code:**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Setup Git for Portal"

### **2. Deploy Manual (Quando quiser)**

#### **Via PowerShell:**
```powershell
cd "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
.\deploy-portal.ps1
```

#### **Via VS Code:**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Deploy Portal to GitHub"

### **3. Monitoramento Automático (Recomendado)**

#### **Via PowerShell:**
```powershell
cd "c:\Users\rms\Documents\Projetos Python\PDF\V2\CertFlow.Portal"
.\auto-watcher.ps1
```

#### **Via VS Code:**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Portal Auto-Watcher"

---

## **⚡ Fluxo Automático**

### **Com Auto-Watcher Ativo:**
```
1. EU modifico: index.html, script.js, styles.css, etc.
2. Watcher detecta mudança automaticamente
3. Script executa git add, commit, push
4. GitHub Pages atualiza o site em 1-2 minutos
5. Site fica atualizado: https://romesfreitas.github.io/certflowportal/
```

### **Arquivos Monitorados:**
- ✅ `*.html` (index.html, etc.)
- ✅ `*.css` (styles.css)
- ✅ `*.js` (script.js, github-integration.js)
- ✅ `*.md` (README.md, documentações)

### **Arquivos Ignorados:**
- ❌ Arquivos temporários (`*.tmp`, `*~`)
- ❌ Arquivos de sistema (`.DS_Store`, `Thumbs.db`)
- ❌ Logs (`*.log`)

---

## **🔧 Configurações**

### **Debounce (Evitar Deploy Excessivo):**
- **Interval:** 30 segundos entre deploys
- **Motivo:** Evitar múltiplos deploys se você salvar várias vezes

### **Mensagens de Commit:**
- **Automático:** "Auto-update: arquivo.js modificado - 2025-09-01 15:30:00"
- **Manual:** Personalizável via parâmetro

### **Branch:**
- **Padrão:** `main`
- **Configurável:** No script se necessário

---

## **📊 Monitoramento**

### **Logs do Auto-Watcher:**
```
👀 Monitorando mudanças nos arquivos do portal...
📝 Changed: script.js
🔄 MUDANÇA DETECTADA: script.js
🚀 Iniciando deploy automático...
✅ Deploy automático concluído!
👀 Continuando monitoramento...
```

### **Verificar Status:**
```powershell
# Ver último commit
git log --oneline -1

# Ver status do repositório
git status

# Ver remote configurado
git remote -v
```

---

## **🎯 Casos de Uso**

### **Desenvolvimento Ativo:**
1. **Ligue o Auto-Watcher:** `.\auto-watcher.ps1`
2. **Trabalhe normalmente:** Modifique arquivos como sempre
3. **Deploy automático:** Acontece quando você salva
4. **Site atualizado:** Em 1-2 minutos no GitHub Pages

### **Deploy Pontual:**
1. **Execute:** `.\deploy-portal.ps1`
2. **Ou via VS Code:** Command Palette → Deploy Portal

### **Configuração Nova Máquina:**
1. **Execute:** `.\setup-git.ps1`
2. **Configure credenciais Git**
3. **Pronto para usar!**

---

## **🛡️ Segurança e Credenciais**

### **Autenticação GitHub:**
- **Opção 1:** GitHub CLI (`gh auth login`)
- **Opção 2:** Personal Access Token
- **Opção 3:** SSH Keys

### **Configurar Token (se necessário):**
```bash
# Configurar credencial via Git
git config credential.helper store

# No primeiro push, será solicitado token
# GitHub Username: romesfreitas
# Password: [GitHub Personal Access Token]
```

---

## **💡 Vantagens**

### **✅ Para Você:**
- **Zero configuração manual**
- **Deploy automático em tempo real**
- **Histórico completo no Git**
- **Rollback fácil se necessário**

### **✅ Para Mim (IA):**
- **Posso modificar arquivos normalmente**
- **Site é atualizado automaticamente**
- **Não preciso lembrar de fazer deploy**
- **Mudanças ficam versionadas**

---

## **🔄 Próximos Passos**

### **Imediato:**
1. **Execute:** `.\setup-git.ps1` (configuração inicial)
2. **Teste:** `.\deploy-portal.ps1` (deploy manual)
3. **Ative:** `.\auto-watcher.ps1` (monitoramento automático)

### **Uso Contínuo:**
- **Deixe auto-watcher rodando** durante desenvolvimento
- **Site sempre atualizado** automaticamente
- **Zero intervenção manual** necessária

---

**🎉 Agora sempre que EU modificar qualquer arquivo do portal, ele será automaticamente enviado para GitHub e o site será atualizado!**
