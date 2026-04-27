# Plano de Implementação do Marketplace - Breshop

## Objetivo
Implementar um sistema completo de marketplace com reserva de peças, moeda interna (coin), estados dinâmicos e fluxo de aprovação para o brechó, garantindo transações atômicas no backend e uma experiência fluida no frontend.

## Plano de Trabalho

### Fase 1: Fundação do Backend (Prisma & Services)
- [ ] **Task 1: Atualizar Schema Prisma** → Definir enums (`ItemStatus`, `OrderStatus`, `CoinTransactionType`) e modelos (`Item`, `Order`, `CoinWallet`, `CoinTransaction`) conforme especificação.
  - *Verificação:* Executar `npx prisma generate` sem erros.
- [ ] **Task 2: Implementar Transação de Reserva** → Criar service `reserveItem` com `$transaction` para travar saldo, criar pedido e atualizar status do item.
  - *Verificação:* Teste unitário ou script de mock validando que saldo insuficiente impede a reserva.
- [ ] **Task 3: Fluxos de Rejeição e Entrega** → Implementar `rejectOrder` (com lógica de devolução de coins) e `confirmDelivery` (liberação de coins para o brechó).
  - *Verificação:* Validar que `rejectionAction === "RETURN_TO_STORE"` volta o item para `AVAILABLE`.

### Fase 2: API & Tipagem Global
- [ ] **Task 4: Endpoints REST** → Criar rotas Next.js (API Routes) para `/api/orders/reserve`, `/api/orders/[id]/reject`, `/api/orders/[id]/approve` e `/api/wallet/topup`.
  - *Verificação:* Testar endpoints via `curl` ou Postman.
- [ ] **Task 5: Sincronização de Types Frontend** → Atualizar `src/shared/types/Produto.ts` (ou criar `Piece.ts`) e adicionar os novos types de status e reserva.
  - *Verificação:* Compilação do TS sem erros de referência.

### Fase 3: Estado Global & Lógica Frontend
- [ ] **Task 6: Criar Marketplace Store (Zustand)** → Implementar `useMarketplaceStore` com ações de reserva e cancelamento, gerenciando o estado local de `pieces` e `reservations`.
  - *Verificação:* Verificar no React DevTools se o estado atualiza imediatamente após a chamada da API.
- [ ] **Task 7: Hook de Countdown** → Criar `useCountdown(expiresAt)` para gerenciar o tempo restante das reservas pendentes.
  - *Verificação:* Timer exibindo minutos/segundos decrescentes corretamente na UI.

### Fase 4: UI & Feedback Visual
- [ ] **Task 8: Vitrine Dinâmica** → Atualizar listagens para filtrar `p.status === "AVAILABLE"` e adicionar badges de status ("Reservado", "Vendido").
  - *Verificação:* Peças reservadas devem desaparecer da Home imediatamente.
- [ ] **Task 10: Página "Minhas Reservas"** → Criar a rota `/minhas-reservas` exibindo card da peça, status atual e botão de cancelar (se aplicável).
  - *Verificação:* Acessar `/minhas-reservas` e ver as reservas do usuário logado.
- [ ] **Task 11: Integração de Saldo (Wallet)** → Exibir o saldo de coins no header/perfil e validar UI de botão desabilitado se saldo < preço.
  - *Verificação:* Interface refletir o balance atualizado após transações.

## Critérios de Sucesso
- [ ] Usuário consegue reservar uma peça se tiver saldo.
- [ ] A peça fica com status `RESERVED` e some das vitrines públicas.
- [ ] O brechó consegue aprovar/rejeitar e o fluxo de coins segue a regra definida.
- [ ] UI reflete todos os estados dinamicamente sem necessidade de refresh manual.

## Notas Técnicas
- **MVP Mock:** Sistema de moedas será mockado inicialmente (sem integração real de pagamento).
- **Tempo de Reserva:** Reservas expiram em 2 dias úteis. Implementação via cron job.
- **Autenticação:** Sem JWT no MVP. Lógica de permissão baseada em IDs (apenas dono do brechó aprova/rejeita).
- **Discrepância Detectada:** O projeto atual usa Next.js App Router, mas o prompt mencionou Vite. Seguiremos com Next.js para manter a consistência do repositório.
- **Performance:** As vitrines devem usar cache do Next.js, mas o status da peça deve ser revalidado (ou usar `revalidatePath` no Server Action).
