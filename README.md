# AI4Devs-QA — Pruebas E2E con Playwright

> Ejercicio práctico de **Quality Assurance** para el programa AI4Devs.  
> El objetivo es aplicar pruebas End-to-End sobre la interfaz `position` usando **Playwright**, validando tanto la carga visual como la interacción de arrastrar candidatos entre fases del proceso de contratación.
>
> ⚠️ **Este ejercicio debe resolverse con asistencia de IA.** El uso de herramientas como Claude, ChatGPT, GitHub Copilot u otras es parte del proceso de aprendizaje y será evaluado. Documenta todos los prompts que utilizaste en el archivo correspondiente.

---

## Índice

- [Descripción del ejercicio](#descripción-del-ejercicio)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración de Playwright](#instalación-y-configuración-de-playwright)
- [Ejecución de pruebas](#ejecución-de-pruebas)
- [Escenarios cubiertos](#escenarios-cubiertos)
- [Convenciones y buenas prácticas](#convenciones-y-buenas-prácticas)
- [Uso de IA en este ejercicio](#uso-de-ia-en-este-ejercicio)
- [Entrega del ejercicio](#entrega-del-ejercicio)

---

## Descripción del ejercicio

Este repositorio contiene el ejercicio de pruebas E2E para la interfaz `position` de un sistema de gestión de candidatos.

La pantalla de `position` muestra un tablero tipo Kanban donde los candidatos se distribuyen en columnas según su fase actual dentro del proceso de contratación. Las pruebas deben validar:

- Que la página carga correctamente con todos sus elementos visuales.
- Que es posible mover un candidato de una fase a otra mediante drag and drop.
- Que al mover un candidato, el backend recibe correctamente la petición `PUT /candidate/:id` con la nueva fase.

---

## Stack tecnológico

El stack base del proyecto puede variar según la implementación de cada estudiante. A continuación se indica únicamente lo que es común a todos:

| Capa | Detalle |
|---|---|
| **Testing E2E** | [Playwright](https://playwright.dev/) — obligatorio para este ejercicio |
| **Frontend** | Según tu implementación del ejercicio anterior (React, Vue, Angular, etc.) |
| **Backend** | Según tu implementación del ejercicio anterior (Node.js, Python, Java, etc.) |
| **Lenguaje de pruebas** | TypeScript o JavaScript, según el proyecto |

> Documenta en esta sección el stack específico que usaste en tu solución.

---

## Estructura del repositorio

```
AI4Devs-qa/
├── frontend/
│   ├── src/                           # Código fuente de la interfaz
│   ├── tests/
│   │   └── e2e/
│   │       └── position.spec.ts       # Pruebas E2E (o .spec.js)
│   ├── playwright.config.ts           # Configuración de Playwright
│   └── package.json
├── prompts/
│   └── prompts-[tus-iniciales].md     # Lista de prompts usados con IA
└── README.md
```

---

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- El proyecto del ejercicio anterior corriendo correctamente en local

---

## Instalación y configuración de Playwright

Desde la carpeta `frontend`, instala Playwright y sus navegadores:

```bash
cd frontend
npm install
npm install -D @playwright/test
npx playwright install
```

Si el proyecto aún no tiene archivo de configuración, genera uno base con:

```bash
npx playwright init
```

Esto creará `playwright.config.ts` (o `.js`) en la raíz de `/frontend`.

---

## Ejecución de pruebas

Todos los comandos se ejecutan desde la carpeta `frontend`.

**Modo interactivo con UI — recomendado durante el desarrollo:**

```bash
npx playwright test --ui
```

**Modo headless — para validación final y CI/CD:**

```bash
npx playwright test
```

**Solo las pruebas de `position`:**

```bash
npx playwright test tests/e2e/position.spec.ts
```

**Ver reporte HTML tras la ejecución:**

```bash
npx playwright show-report
```

---

## Escenarios cubiertos

### ✅ Escenario 1 — Carga de la página `position`

Valida que la pantalla carga correctamente:

- El título de la posición se muestra.
- Las columnas de fases del proceso están presentes.
- Los candidatos aparecen en la columna correcta según su fase.

### ✅ Escenario 2 — Cambio de fase de un candidato

Valida el flujo completo de mover un candidato entre fases:

- Se puede arrastrar una tarjeta de una columna a otra (drag and drop).
- La tarjeta aparece visualmente en la nueva columna.
- Se dispara una petición `PUT /candidate/:id` al backend.
- El body contiene la nueva fase y la respuesta es exitosa.

---

## Convenciones y buenas prácticas

- **Selectores estables:** usar atributos `data-testid` para localizar elementos.
- **Nombres descriptivos:** cada prueba describe claramente el escenario y el resultado esperado.
- **Validación doble:** estado visual de la UI + comunicación con el backend.
- **Sin datos quemados frágiles:** los datos de prueba son controlados y fáciles de actualizar.

Ejemplo de atributos `data-testid` recomendados en la interfaz:

```html
<div data-testid="position-title"></div>
<div data-testid="phase-column-applied"></div>
<div data-testid="phase-column-interview"></div>
<div data-testid="candidate-card-1"></div>
```

---

## Uso de IA en este ejercicio

El uso de herramientas de IA es **parte central de este ejercicio** y será uno de los criterios de evaluación.

Se espera que utilices IA para:

- Generar o iterar sobre el código de las pruebas E2E.
- Resolver dudas sobre la API de Playwright (selectores, drag and drop, intercepción de requests).
- Depurar pruebas que fallen o produzcan comportamientos inesperados.
- Mejorar la estructura y legibilidad de tus pruebas.

### Qué se evalúa

| Criterio | Descripción |
|---|---|
| **Calidad de los prompts** | ¿Son claros, contextualizados y orientados a un resultado concreto? |
| **Iteración con la IA** | ¿Refinaste los prompts para mejorar los resultados iniciales? |
| **Criterio propio** | ¿Validaste, ajustaste y entendiste el código generado? |
| **Trazabilidad** | ¿Están documentados los prompts que llevaron a la solución final? |

### Cómo documentar tu uso de IA

Registra todos los prompts utilizados en:

```
/prompts/prompts-[tus-iniciales].md
```

El archivo debe contener **únicamente la lista de prompts** usados durante el ejercicio, en el orden en que los ejecutaste. No es necesario incluir las respuestas ni explicaciones adicionales.

Ejemplo de formato:

```markdown
# Prompts utilizados — [Tus iniciales]

1. "Genera una prueba E2E con Playwright que valide que la página /position carga correctamente y muestra las columnas Aplicado, Entrevista y Oferta usando selectores data-testid."

2. "La prueba anterior falla al buscar el elemento data-testid='phase-column-applied'. ¿Cómo puedo depurar qué elementos están disponibles en el DOM durante la ejecución?"

3. "Refactoriza las pruebas para que usen beforeEach y eviten repetir la navegación a la página en cada test."
```

---

## Entrega del ejercicio

El Pull Request debe incluir:

- [ ] Cambios en la interfaz dentro de `/frontend` (atributos `data-testid` u otros necesarios para las pruebas).
- [ ] Configuración de Playwright (`playwright.config.ts` o `.js`).
- [ ] Archivo de pruebas en `/frontend/tests/e2e/position.spec.ts` (o `.spec.js`).
- [ ] Archivo `/prompts/prompts-[tus-iniciales].md` con la lista de prompts utilizados.
- [ ] Evidencia de ejecución exitosa (captura de pantalla o salida de terminal).

El Pull Request debe incluir una descripción con el siguiente formato:

```markdown
## Descripción

Breve descripción de la solución implementada.

## Cambios realizados

- ...

## Cómo ejecutar las pruebas

cd frontend
npm install
npx playwright install
npx playwright test

## Herramientas de IA utilizadas

- [Nombre de la herramienta] — para qué la usaste
```

---

<div align="center">
  <sub>Ejercicio desarrollado para <strong>AI4Devs</strong> — Programa de formación en IA para desarrolladores.</sub>
</div>
