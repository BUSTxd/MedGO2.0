# Cobros de Mercado Pago no reflejados: diseño y análisis de ataques

*2026-11-16. Origen: el 2026-11-15 una alumna pagó su cuota y su perfil siguió vencido.*

## Las cuatro vías que dan acceso tras un cobro

| Vía | Archivo | Cuándo |
|---|---|---|
| Webhook, aviso de cuota | `api/webhooks/mercadopago` | Mercado Pago avisa del cobro de una cuota |
| Webhook, aviso de pago suelto (`payment`) | ídem, `avisoDePago` | P. ej. la cuota fallida que el alumno paga a mano |
| Botón «Ya pagué, revisar» | `api/subscriptions/revisar`, `SubscriptionPanel` | El alumno lo pulsa en Mi cuenta con el plan vencido |
| Revisión al entrar | `getUserPlanState` → `reconciliarAlEntrar` | Un alumno entra con el plan vencido (máx. cada 10 min, 4 s) |
| Cron diario | `api/cron/suscripciones`, `vercel.json` | 6:00 de Lima |

Todas menos la primera acaban en `reconciliarSuscripcionesMp` (`src/lib/mp-reconciliar.ts`).

## La regla de diseño que sostiene todo

**Ningún dato de la petición decide el acceso.** Quien llama solo elige *a qué alumno revisar*. La revisión relee sus cuotas en Mercado Pago con nuestro token y **solo alarga** hasta lo que de verdad se cobró (última cuota `approved` + duración del plan). Nunca acorta.

Por eso un aviso falso, un aviso reenviado, un correo que apunta a otro alumno o un botón pulsado mil veces no pueden abrir contenido sin pago. Como mucho cuestan consultas.

## Ataques considerados

### 1. Conseguir acceso sin pagar
- **Botón:** no recibe parámetros; el alumno sale de la sesión. No hay id que manipular (IDOR). **Cerrado.**
- **Webhook falso:** exige firma HMAC (`MP_WEBHOOK_SECRET`); aun con la firma robada, la revisión relee Mercado Pago. **Cerrado.**
- **Escribir el propio perfil desde el navegador:** `profiles`, `subscriptions` y `revisiones_pago` solo admiten `SELECT` para `anon` y `authenticated` (comprobado el 2026-11-16). **Cerrado.**
- **Hueco anterior, cerrado hoy:** un aviso de *suscripción* alargaba el acceso si `charged_quantity > 0`, o sea con cualquier cuota cobrada alguna vez. Quien tuviera la tarjeta rechazada este mes y recibiera un aviso (p. ej. al cambiar de tarjeta) se llevaba el mes. Ahora ese aviso pasa por la revisión.

### 2. Saturar la web o gastar el cupo de Mercado Pago
- **Por alumno:** `reclamar_revision_pago` concede una revisión cada 30 s, de forma atómica en la base (vale para todas las instancias; dos peticiones simultáneas no pasan las dos). El alumno no puede borrar su marca (RLS sin políticas; la función solo la ejecuta el service role).
- **Por IP:** regla del firewall de Vercel «Límite: revisar pago», 10 peticiones por minuto; pasado eso, 429 sin llegar al código.
- **Coste por petición sin suscripción viva:** solo base de datos, nunca Mercado Pago.
- **Riesgo que queda (medio):** muchas cuentas desde muchas IP (una botnet). El registro con contraseña **no verifica el correo**, así que crear cuentas es barato. Cada cuenta sin suscripción solo cuesta consultas a la base, pero en volumen pesa. Si pasa: *Attack Mode* de Vercel y activar «Confirm email» en Supabase (pendiente desde la auditoría de 2026-09-24).

### 3. CSRF (que otra web haga pulsar el botón al alumno)
- Rechaza `Sec-Fetch-Site` distinto de `same-origin` y `Origin` ajeno (403); las cookies de sesión son `SameSite=Lax`. Aunque pasara, solo gastaría el cupo de 30 s del alumno. **Cerrado.**

### 4. Fuga de datos
- El botón responde solo un estado (`actualizado`, `sin_pago`, `espera`…), sin montos, tarjetas ni ids de Mercado Pago. Los errores de Mercado Pago van al log, no a la respuesta.
- `?ver=1` del cron sí lista ids de alumno y de suscripción, pero exige `CRON_SECRET`.

### 5. Reenvío (*replay*) de un aviso real
- La firma no comprueba la antigüedad del `ts`. Reenviar un aviso capturado solo dispara otra revisión, que es idempotente. **Riesgo bajo, aceptado.**

### 6. Secretos
- `CRON_SECRET`: Sensitive en Vercel, comparado en tiempo constante. Se rotó el 2026-11-16 porque el primero quedó escrito en una conversación.
- `MP_WEBHOOK_SECRET`: ojo, `save_webhook` del MCP de Mercado Pago lo regenera (ver CLAUDE.md §8).

### 7. Correo del pagador como respaldo
- El aviso `payment` busca al alumno por la suscripción y, si no la encuentra, por el correo del pagador **con igualdad exacta** (`ilike` habría dejado usar `*` o `%` como comodín). El correo se guarda en minúsculas al crear la suscripción. Un acierto con otro alumno solo revisaría la suscripción de ese alumno.

## Lo supuesto, sin verificar
- Que el aviso `payment` de una cuota de suscripción trae el id de la suscripción en `point_of_interaction.transaction_data.subscription_id` o `metadata.preapproval_id`. Si no lo trae, entra el respaldo por correo, y si tampoco, la revisión al entrar y el cron.
- Que la cuenta de Mercado Pago tiene activado el tema «Pagos» en sus notificaciones. Si no, los avisos `payment` no llegan y el caso queda cubierto solo por el botón, la revisión al entrar y el cron.
