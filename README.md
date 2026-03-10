# Daily Meeting Timer - Chrome Extension

Uma extensão simples para Chrome otimizada para **dailies** com timer por pessoa, lista de participantes salva e alertas visuais/sonoros.

## ✨ Funcionalidades

- ✅ Lista de participantes editável (adicionar/remover com "X")  
- 💾 **Persistência automática** com `chrome.storage.sync` (nomes salvos entre dias)  
- ⏱️ Timer configurável em **minutos + segundos** (ex: 2:30)  
- 🔊 **Alerta sonoro opcional** + flash visual quando o tempo acaba  
- 📋 Fluxo otimizado para 5 pessoas (Dev1-Dev5 pré-carregados)  
- 🔄 "Nova daily" para limpar checks sem perder nomes  
- 🎯 Interface redimensionável (mínimo 400px × 500px)

## 🚀 Como usar

### 1. Instalar
```
1. Abra chrome://extensions/
2. Ative "Modo do desenvolvedor" 
3. Clique "Carregar sem compactação"
4. Selecione a pasta desta extensão
5. Fixe o ícone na barra de extensões (quebra-cabeça → alfinete)
```

### 2. Primeira configuração
```
1. Clique no ícone da extensão
2. Edite Dev1→Dev5 para nomes reais
3. Configure tempo padrão (ex: 2 min 30 seg)
4. (Opcional) Desmarque "Alerta sonoro" se preferir apenas alerta visual
5. Feche e reabra → configurações salvas!
```

### 3. Durante a daily
```
1. "Nova daily" → limpa checks ✓
2. Defina tempo → "Iniciar" 
3. "Próximo" → avança automaticamente
4. Flash + som (se habilitado) = tempo acabou!
5. Redimensione a janela conforme necessário (arraste o canto inferior direito)
```

## 📁 Estrutura do projeto

```
daily-timer/
├── manifest.json     # Configuração MV3 + storage
├── popup.html       # Interface com timer min+seg
├── popup.js         # Lógica completa (storage + beep + flash)
└── README.md        # Este arquivo
```

## 🎨 Personalizações comuns

### Redimensionar a janela
- Passe o mouse no **canto inferior direito** da popup
- Um cursor de redimensionamento aparecerá
- **Arraste** para ajustar o tamanho conforme preferir
- O tamanho é salvo localmente pelo navegador

### Controlar o alerta sonoro
- A opção **"Alerta sonoro"** aparece nas configurações
- Marque para habilitar (padrão) ou desmarque para apenas alerta visual
- A preferência é salva automaticamente com `chrome.storage.sync`

### Tempos típicos de daily
```
1:30 → 1 min 30 seg
2:00 → 2 min 0 seg  
2:30 → 2 min 30 seg
```

### Adicionar beep offline
1. Baixe um `beep.mp3` (~20KB)
2. Coloque na pasta da extensão
3. Mude no HTML: `<source src="beep.mp3" type="audio/mpeg">`

## 🔧 Como editar

1. **Mudou código?** → `chrome://extensions` → "Atualizar" na extensão
2. **Ver storage** → Popup aberta → Right-click → "Inspecionar" → Application → Extension Storage → sync
3. **Debug popup** → Mesma inspeção mostra Console com erros

## 📱 Screenshots do fluxo

*(Adicione prints aqui depois)*
```
[ ] Lista inicial com Dev1-Dev5
[ ] Durante timer contando
[ ] Beep + flash no fim do tempo  
[ ] "Nova daily" pronta para próxima rodada
```

## ⚙️ Configurações técnicas

- **Manifest V3** (padrão atual do Chrome)
- **chrome.storage.sync** (sincroniza entre dispositivos)
- **AudioContext** não usado (simples `<audio>` funciona na popup)
- **CSS animations** para flash visual

## Sobre

Esta extensão foi desenvolvida com o auxílio de Inteligência Artificial, utilizando ferramentas como Perplexity e GitHub Copilot para acelerar o processo de codificação, depuração e otimização do código. A IA ajudou na geração de ideias, na escrita de código JavaScript, CSS e na estruturação geral do projeto, garantindo uma implementação eficiente e funcional.
- **Nenhuma permissão externa** além de `storage`

## 🤔 Solução de problemas

| Problema | Solução |
|----------|---------|
| "manifest.json inválido" | Verifique vírgulas e aspas no JSON |
| Nomes não salvam | Confirme `"permissions": ["storage"]` no manifest |
| Beep não toca | Clique primeiro em "Iniciar" (libera áudio) |
| Popup muito estreita | Aumente `min-width: 300px` no CSS |
| Timer não para | F9 para pausar ou "Resetar timer" |

## 📈 Próximas melhorias (futuro)

- [ ] Presets de tempo (1:30, 2:00, 2:30)
- [ ] Timer em background (`chrome.alarms`)
- [ ] Notificação desktop quando tempo acaba
- [ ] Exportar relatório da daily
- [ ] Tema escuro/claro

## 📄 Licença

MIT License - Use, modifique e distribua livremente.

***

**Feito para facilitar dailies!**  
*Eduardo Gomes - Santa Bárbara d'Oeste, SP - Março 2026*
