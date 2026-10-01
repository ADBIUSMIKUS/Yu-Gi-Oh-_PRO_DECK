# Blue-Eyes Card Explorer

Aplicación académica Angular para buscar cartas de Yu-Gi-Oh! y explorar el arquetipo Blue-Eyes con datos reales de [YGOPRODeck](https://ygoprodeck.com/api-guide/). La interfaz muestra resultados, detalle, impresiones y un filtro de expansiones generado a partir de la respuesta de la API.

## Características

- Búsqueda parcial por nombre (`fname`) con `FormControl.valueChanges`, `debounceTime(400)`, `distinctUntilChanged` y `switchMap`.
- Colección del arquetipo Blue-Eyes obtenida con `archetype=Blue-Eyes`.
- Tarjeta reutilizable para ambas vistas y detalle por ruta `/card/:id`.
- Expansiones únicas generadas desde `card_sets` con `Set<string>`; filtro dinámico que conserva las impresiones originales.
- Estados visibles de carga, éxito, vacío y error. La respuesta HTTP 400 específica de “sin coincidencias” se interpreta como vacío; los demás errores se muestran como error.
- Diseño adaptable, navegación visible, etiquetas accesibles y movimiento reducido.

## Stack y requisitos

Angular 21 (core 21.2.25, CLI 21.2.24 en la validación), TypeScript 5.9, RxJS 7.8, `HttpClient`, HTML y CSS. Requiere Node.js compatible con Angular 21 (esta entrega se validó con Node 24.13.0), npm, conexión a Internet y navegador moderno.

## Instalación y ejecución

```powershell
cd 'C:\Users\Amin\Documents\Yu-Gi-Oh!_PRO_DECK'
npm install
npm start
```

Abrir `http://localhost:4200/`. Para compilar y probar:

```powershell
npm run build
npm test -- --watch=false
```

**Nota del entorno de creación:** el lanzador global `D:\npm.cmd` de esta máquina apuntaba a un `npm-cli.js` inexistente en AppData. Se usó el ejecutable real con `& 'D:\node.exe' 'D:\node_modules\npm\bin\npm-cli.js' <comando>`. Si `npm` funciona normalmente en otro equipo, utiliza los comandos estándar anteriores.

## Arquitectura

```text
src/app/
├── core/services/yugioh.service.ts    HTTP y endpoint único
├── models/card.model.ts                Interfaces de respuesta, carta, imagen e impresión
├── shared/card/                       Tarjeta reutilizable
├── pages/search/                     Buscador y estados de consulta
├── pages/blue-eyes/                  Colección, expansiones y filtro
├── pages/card-detail/                Detalle e impresiones
├── app.routes.ts                      Rutas
└── app.config.ts                      provideHttpClient y router
```

`SearchComponent` observa el campo de búsqueda. Tras 400 ms sin cambios, `switchMap` llama a `YugiohService.searchCards`; una nueva búsqueda cancela la anterior. `BlueEyesComponent` consulta el arquetipo al entrar, calcula las expansiones únicas y filtra localmente las cartas por `set_name`. `CardComponent` emite la carta seleccionada. La ruta de detalle usa el `id` para consultar la carta de nuevo, de modo que funciona también al recargarla o compartir su URL. El parámetro `from=blue-eyes` indica a dónde debe volver el enlace.

## API y campos usados

Endpoint: `https://db.ygoprodeck.com/api/v7/cardinfo.php`. Parámetros documentados: `fname`, `archetype`, `id`. Se modelan `data`, `id`, `name`, `type`, `desc`, `atk`, `def`, `level`, `attribute`, `archetype`, `card_images` y `card_sets`. Las impresiones emplean `set_name`, `set_code`, `set_rarity` y `set_price`. Los campos de estadísticas pueden faltar o venir como `null`; por eso se renderizan sólo cuando tienen valor. El precio se presenta tal como lo proporciona la API y no se estima.

La API puede responder HTTP 400 con `No card matching your query was found...` para una búsqueda sin resultados. El servicio reconoce únicamente ese mensaje como lista vacía. Problemas de conexión y otras respuestas inesperadas producen un mensaje de error visible.

## Validación realizada el 1 de octubre de 2026

- `npm install`: 469 paquetes instalados.
- `npm run build`: PASS.
- `npm test -- --watch=false`: 5 archivos, 9 pruebas PASS, incluidas deduplicación, filtro, parámetros HTTP, vacío/error, estados Loading/Error y debounce.
- API real: `fname=Kuriboh` devolvió 25 cartas; `archetype=Blue-Eyes` devolvió 44; búsqueda imposible devolvió HTTP 400 con mensaje de ausencia.
- Navegador local: búsquedas Blue-Eyes (21), Dark Magician (15) y Kuriboh (25); vacío; colección Blue-Eyes (44); filtro “Legend of Blue Eyes White Dragon” (1); detalle de Blue-Eyes White Dragon (54 impresiones). Estos recuentos pertenecen a la consulta de esa fecha y pueden cambiar.

## Créditos

Práctica de Aplicaciones Web de Amin Kaled Franco Cruz. Datos e imágenes: YGOPRODeck. Yu-Gi-Oh! pertenece a sus respectivos titulares.
