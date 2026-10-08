"""Pruebas automatizadas de GameZone con Playwright (Chromium).

Recorre el sitio como lo haría un usuario y verifica: estructura semántica,
generación dinámica de tarjetas, filtros, agregar/eliminar videojuegos,
validación de formularios, conexión entre secciones, manejo de errores,
responsividad en 8 anchos de pantalla y emulación de 6 dispositivos.

Requisitos (una sola vez):
    pip install playwright
    playwright install chromium

Uso (con el sitio corriendo, por ejemplo con "npm run preview"):
    python pruebas/verificar_sitio.py http://localhost:4173/
    python pruebas/verificar_sitio.py https://blazeman1.github.io/Frontend.EFT.React/
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/"
if not URL.endswith("/"):
    URL += "/"
resultados = []

def ok(nombre, condicion, detalle=""):
    resultados.append((nombre, bool(condicion), detalle))
    print(("OK   " if condicion else "FALLA"), nombre, ("- " + str(detalle)) if detalle else "")
    assert condicion, f"{nombre}: {detalle}"

async def tarjetas(page):
    return await page.locator('[data-testid="lista-juegos"] > li').count()

async def nueva_pagina(browser, errores, **kw):
    ctx = await browser.new_context(**kw)
    page = await ctx.new_page()
    # Se ignoran solo los errores de red de la URL de imagen inválida usada A PROPÓSITO en la prueba de onError.
    page.on("console", lambda m: errores.append(f"{m.text} @ {m.location.get('url')}") if m.type == "error" and "invalida.gamezone.test" not in (m.location.get("url") or "") else None)
    page.on("pageerror", lambda e: errores.append(str(e)))
    return ctx, page

async def main():
    errores = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx, page = await nueva_pagina(browser, errores, viewport={"width": 1366, "height": 768})

        # ---------- 1. Carga y estructura semántica ----------
        await page.goto(URL)
        ok("Esqueleto de carga visible al inicio", await page.locator('[data-testid="cargando-catalogo"]').is_visible())
        ok("Insignia del navbar muestra '…' mientras carga", (await page.locator('[data-testid="contador-navbar"]').inner_text()) == "…")
        await page.wait_for_selector('[data-testid="lista-juegos"]')
        ok("12 tarjetas generadas dinámicamente", await tarjetas(page) == 12)
        estructura = await page.evaluate("""() => ({
            header: document.querySelectorAll('header').length,
            nav: document.querySelectorAll('header nav').length,
            main: document.querySelectorAll('main').length,
            secciones: [...document.querySelectorAll('main > section')].map(s => s.id),
            footer: document.querySelectorAll('footer').length,
            articles: document.querySelectorAll('article.card').length,
            h1: document.querySelectorAll('h1').length,
            aside: document.querySelectorAll('aside').length,
            lang: document.documentElement.lang,
        })""")
        ok("Etiquetas semánticas header/nav/main/section/footer/article/aside", estructura["header"] == 1 and estructura["nav"] == 1 and estructura["main"] == 1
           and estructura["secciones"] == ["inicio", "catalogo", "contacto"] and estructura["footer"] == 1 and estructura["articles"] == 12
           and estructura["h1"] == 1 and estructura["aside"] == 1 and estructura["lang"] == "es", estructura)
        layout = await page.evaluate("""() => ({
            grid: getComputedStyle(document.querySelector('.grilla-juegos')).display,
            columnas: getComputedStyle(document.querySelector('.grilla-juegos')).gridTemplateColumns.split(' ').length,
            heroFlex: getComputedStyle(document.querySelector('.hero-contenido')).display,
            filtrosFlex: getComputedStyle(document.querySelector('.barra-filtros')).display,
        })""")
        ok("CSS Grid en el catálogo y Flexbox en hero/filtros", layout["grid"] == "grid" and layout["heroFlex"] == "flex" and layout["filtrosFlex"] == "flex", layout)
        resumen = await page.locator('[data-testid="resumen-inicio"]').inner_text()
        ok("Resumen de inicio: 12 juegos, 6 categorías, desde $19.990", "12" in resumen and "6" in resumen and "$19.990" in resumen, resumen.replace("\n", " | "))
        ok("Navbar muestra 12 videojuegos", await page.locator('[data-testid="contador-navbar"]').inner_text() == "12")
        ok("Tarjeta con imagen, nombre, precio y descripción",
           await page.locator('[data-testid="juego-1"] img').count() == 1
           and "Reinos Olvidados" in await page.locator('[data-testid="juego-1"]').inner_text()
           and "$27.990" in await page.locator('[data-testid="juego-1"]').inner_text()
           and "reinos en ruinas" in await page.locator('[data-testid="juego-1"]').inner_text())
        imagenes_rotas = await page.evaluate("[...document.images].filter(i => i.complete && i.naturalWidth === 0).length")
        ok("Todas las imágenes cargan", imagenes_rotas == 0, imagenes_rotas)

        # ---------- 2. Filtro por categoría y búsqueda ----------
        await page.click('[data-testid="filtro-RPG"]')
        ok("Filtro RPG muestra 2 juegos", await tarjetas(page) == 2)
        ok("Contador 'Mostrando 2 de 12'", "Mostrando 2 de 12" in await page.locator('[data-testid="contador-catalogo"]').inner_text())
        ok("Botón activo con aria-pressed", await page.locator('[data-testid="filtro-RPG"]').get_attribute("aria-pressed") == "true")
        await page.click('[data-testid="filtro-Todas"]')
        await page.fill("#busqueda", "galaxia")
        ok("Búsqueda 'galaxia' -> 1", await tarjetas(page) == 1)
        await page.fill("#busqueda", "cronicas")
        ok("Búsqueda sin tildes 'cronicas' encuentra 'Crónicas de Atacama'", await tarjetas(page) == 1 and "Crónicas" in await page.locator('[data-testid="lista-juegos"]').inner_text())
        await page.fill("#busqueda", "zzz")
        ok("Sin resultados muestra mensaje", await page.locator('[data-testid="sin-resultados"]').is_visible())
        await page.click("text=Ver todos los videojuegos")
        ok("'Ver todos' limpia filtros", await tarjetas(page) == 12 and await page.input_value("#busqueda") == "")
        await page.click('[data-testid="atajo-Deportes"]')
        await page.wait_for_timeout(700)
        ok("Atajo de inicio 'Deportes' filtra el catálogo", await tarjetas(page) == 2 and await page.locator('[data-testid="filtro-Deportes"]').get_attribute("aria-pressed") == "true")
        en_vista = await page.evaluate("document.getElementById('catalogo').getBoundingClientRect().top < 200")
        ok("Atajo desplaza la página hasta el catálogo", en_vista)
        await page.click('[data-testid="filtro-Todas"]')

        # ---------- 3. Modo administrador: agregar ----------
        await page.check("#modoAdmin")
        ok("Modo admin muestra el formulario", await page.locator('[data-testid="formulario-juego"]').is_visible())
        await page.click('[data-testid="guardar-juego"]')
        alerta = await page.locator('[data-testid="formulario-juego"] .alert-danger').inner_text()
        ok("Envío vacío: 4 errores (imagen es opcional)", "4 campos" in alerta, alerta)
        foco = await page.evaluate("document.activeElement.id")
        ok("Foco en el primer campo con error", foco == "juego-nombre", foco)
        ok("Campos marcados con is-invalid", await page.locator('[data-testid="formulario-juego"] .is-invalid').count() == 4)
        await page.fill("#juego-nombre", "galaxia infinita")
        await page.locator("#juego-nombre").blur()
        ok("Nombre repetido detectado", "Ya existe" in await page.locator("#juego-nombre-error").inner_text())
        await page.fill("#juego-precio", "29.990")
        ok("Precio con punto rechazado", "entero" in await page.locator("#juego-precio-error").inner_text())
        await page.fill("#juego-imagen", "imagen-sin-protocolo")
        await page.locator("#juego-imagen").blur()
        ok("URL de imagen inválida rechazada", "http" in await page.locator("#juego-imagen-error").inner_text())
        await page.fill("#juego-nombre", "Pixel Quest")
        await page.select_option("#juego-categoria", "Aventura")
        await page.fill("#juego-precio", "17990")
        await page.fill("#juego-descripcion", "Plataformas retro con niveles creados por la comunidad.")
        await page.fill("#juego-imagen", "https://imagen.invalida.gamezone.test/portada.jpg")
        vp = await page.locator('[data-testid="vista-previa"]').inner_text()
        ok("Vista previa en tiempo real (reutiliza TarjetaVideojuego)", "Pixel Quest" in vp and "$17.990" in vp and "Aventura" in vp)
        await page.click('[data-testid="guardar-juego"]')
        await page.wait_for_timeout(300)
        ok("Juego agregado: 13 tarjetas", await tarjetas(page) == 13)
        primera = page.locator('[data-testid="lista-juegos"] > li').first
        ok("El nuevo aparece primero con insignia 'Nuevo'", "Pixel Quest" in await primera.inner_text() and "Nuevo" in await primera.inner_text())
        await page.wait_for_timeout(800)
        src = await primera.locator("img").evaluate("i => i.src")
        ok("Imagen que no carga se reemplaza por la imagen por defecto (onError)", src.endswith("img/sin-imagen.jpg"), src)
        ok("Navbar actualizado a 13 (props entre secciones)", await page.locator('[data-testid="contador-navbar"]').inner_text() == "13")
        ok("Resumen de inicio actualizado a 13", "13" in await page.locator('[data-testid="resumen-inicio"]').inner_text())
        ok("Conteo de categoría Aventura actualizado a 3", "3" in await page.locator('[data-testid="filtro-Aventura"]').inner_text())
        ok("Aviso de éxito", "Se agregó" in await page.locator('[data-testid="aviso-catalogo"]').inner_text())
        ok("Formulario se limpia después de agregar", await page.input_value("#juego-nombre") == "")

        # ---------- 4. Eliminar y restablecer ----------
        await page.click('[data-testid="eliminar-1"]')
        ok("Eliminar pide confirmación", await page.locator('[data-testid="confirmar-eliminar-1"]').is_visible())
        await page.click('[data-testid="confirmar-eliminar-1"]')
        ok("Juego eliminado: 12 tarjetas y sin 'Reinos Olvidados'", await tarjetas(page) == 12 and await page.locator('[data-testid="juego-1"]').count() == 0)
        ok("Aviso de eliminación", "Se eliminó" in await page.locator('[data-testid="aviso-catalogo"]').inner_text())
        await page.click('[data-testid="filtro-Deportes"]')
        for jid in (6, 11):
            await page.click(f'[data-testid="eliminar-{jid}"]')
            await page.click(f'[data-testid="confirmar-eliminar-{jid}"]')
        ok("Categoría vacía muestra mensaje", "Deportes" in await page.locator('[data-testid="sin-resultados"]').inner_text())
        ok("Atajo 'Deportes' deshabilitado al quedar sin juegos", await page.locator('[data-testid="atajo-Deportes"]').is_disabled())
        await page.click('[data-testid="restablecer"]')
        await page.wait_for_selector('[data-testid="lista-juegos"]')
        ok("Restablecer recupera los 12 originales", await tarjetas(page) == 12 and await page.locator('[data-testid="juego-1"]').count() == 1)
        await page.uncheck("#modoAdmin")
        ok("Sin modo admin no hay botones Eliminar", await page.locator('[data-testid^="eliminar-"]').count() == 0)

        # ---------- 5. Formulario de contacto ----------
        await page.click('[data-testid="enviar-contacto"]')
        ok("Contacto vacío: resumen de 3 errores", "3 campos" in await page.locator('[data-testid="contacto-errores"]').inner_text())
        ok("Foco en el nombre", await page.evaluate("document.activeElement.id") == "contacto-nombre")
        await page.fill("#contacto-nombre", "F1")
        await page.fill("#contacto-email", "fernando@")
        await page.fill("#contacto-mensaje", "Hola")
        t_nombre = await page.locator("#contacto-nombre-error").inner_text()
        t_email = await page.locator("#contacto-email-error").inner_text()
        t_msg = await page.locator("#contacto-mensaje-error").inner_text()
        ok("Mensajes de error específicos", "3 caracteres" in t_nombre and "válido" in t_email and "10 caracteres" in t_msg, [t_nombre, t_email, t_msg])
        await page.fill("#contacto-nombre", "F4bián")
        ok("Nombre con números rechazado", "letras" in await page.locator("#contacto-nombre-error").inner_text())
        await page.fill("#contacto-nombre", "Fernando Fuentes")
        await page.fill("#contacto-email", "fernando@correo.cl")
        await page.fill("#contacto-mensaje", "Quisiera saber cuándo llega Liga Estelar 26 a tienda.")
        ok("Campos válidos con is-valid", await page.locator('[data-testid="formulario-contacto"] .is-valid').count() == 3)
        ok("Contador de caracteres", "/500" in await page.locator('[data-testid="contador-mensaje"]').inner_text())
        await page.click('[data-testid="enviar-contacto"]')
        ok("Estado 'Enviando...' con botón deshabilitado", await page.locator('[data-testid="enviar-contacto"]').is_disabled())
        await page.wait_for_selector('[data-testid="contacto-exito"]')
        ok("Confirmación personalizada", "Gracias, Fernando Fuentes" in await page.locator('[data-testid="contacto-exito"]').inner_text())
        ok("Formulario reiniciado", await page.input_value("#contacto-nombre") == "" and await page.locator('[data-testid="contacto-errores"]').count() == 0)

        # ---------- 6. Consultar: conexión catálogo -> contacto ----------
        await page.click('[data-testid="consultar-3"]')
        await page.wait_for_timeout(900)
        mensaje = await page.input_value("#contacto-mensaje")
        ok("'Consultar' precarga el mensaje con el juego", "Velocidad Extrema" in mensaje and "$22.990" in mensaje, mensaje)
        ok("Indicador de consulta activa", "Velocidad Extrema" in await page.locator('[data-testid="consulta-activa"]').inner_text())
        ok("Se desplaza a Contacto", await page.evaluate("document.getElementById('contacto').getBoundingClientRect().top < 200"))
        await page.wait_for_timeout(400)
        activo = await page.locator('header .nav-link.active').inner_text()
        ok("Navbar resalta 'Contacto' (IntersectionObserver)", activo.strip() == "Contacto", activo)
        await page.click('[data-testid="consulta-activa"] button')
        ok("'Quitar' elimina la consulta", await page.locator('[data-testid="consulta-activa"]').count() == 0)
        await ctx.close()

        # ---------- 7. Error de carga simulado ----------
        ctx, page = await nueva_pagina(browser, errores, viewport={"width": 1366, "height": 768})
        await page.goto(URL + "?error")
        await page.wait_for_selector('[data-testid="reintentar"]')
        ok("?error muestra alerta con Reintentar", "No pudimos cargar" in await page.locator("#catalogo .alert-danger").inner_text())
        await page.click('[data-testid="reintentar"]')
        await page.wait_for_selector('[data-testid="lista-juegos"]')
        ok("Reintentar recupera el catálogo", await tarjetas(page) == 12)
        await ctx.close()

        # ---------- 8. Responsividad por ancho de pantalla ----------
        anchos = [(320, 640), (360, 740), (375, 812), (414, 896), (768, 1024), (1024, 768), (1366, 768), (1920, 1080)]
        tabla = []
        for ancho, alto in anchos:
            ctx, page = await nueva_pagina(browser, errores, viewport={"width": ancho, "height": alto})
            await page.goto(URL)
            await page.wait_for_selector('[data-testid="lista-juegos"]')
            info = await page.evaluate("""() => ({
                scroll: document.documentElement.scrollWidth,
                columnas: getComputedStyle(document.querySelector('.grilla-juegos')).gridTemplateColumns.split(' ').length,
                toggler: getComputedStyle(document.querySelector('.navbar-toggler')).display !== 'none',
                select: document.getElementById('filtroCategoriaMovil').offsetParent !== null,
            })""")
            sin_scroll = info["scroll"] <= ancho
            if info["toggler"]:
                await page.click(".navbar-toggler")
                abierto = "show" in (await page.locator("#menuPrincipal").get_attribute("class"))
                await page.click("#menuPrincipal >> text=Contacto")
                await page.wait_for_timeout(500)
                cerrado = "show" not in (await page.locator("#menuPrincipal").get_attribute("class"))
                menu_ok = abierto and cerrado
            else:
                menu_ok = True
            if info["select"]:
                await page.select_option("#filtroCategoriaMovil", "Carreras")
                filtro_ok = await tarjetas(page) == 2
            else:
                await page.click('[data-testid="filtro-Carreras"]')
                filtro_ok = await tarjetas(page) == 2
            tabla.append({"ancho": ancho, "columnas": info["columnas"], "menu_hamburguesa": info["toggler"], "filtro": "select" if info["select"] else "botones",
                          "sin_scroll_horizontal": sin_scroll, "menu_ok": menu_ok, "filtro_ok": filtro_ok})
            ok(f"{ancho}px: sin scroll horizontal, menú y filtro funcionando ({info['columnas']} col.)", sin_scroll and menu_ok and filtro_ok, info)
            await ctx.close()

        # ---------- 9. Emulación de dispositivos reales ----------
        dispositivos = ["iPhone SE", "iPhone 13", "Pixel 7", "Galaxy S9+", "iPad (gen 7)", "iPad Pro 11 landscape"]
        tabla_disp = []
        for nombre in dispositivos:
            d = p.devices[nombre]
            ctx, page = await nueva_pagina(browser, errores, **{k: v for k, v in d.items() if k != "default_browser_type"})
            await page.goto(URL)
            await page.wait_for_selector('[data-testid="lista-juegos"]')
            ancho = d["viewport"]["width"]
            scroll = await page.evaluate("document.documentElement.scrollWidth")
            # Interacción táctil: tocar "Consultar" y verificar el mensaje precargado
            await page.locator('[data-testid="consultar-2"]').tap()
            await page.wait_for_timeout(900)
            precargado = "Sombra Silenciosa" in await page.input_value("#contacto-mensaje")
            tabla_disp.append({"dispositivo": nombre, "viewport": f"{ancho}x{d['viewport']['height']}", "sin_scroll": scroll <= ancho, "tactil_ok": precargado})
            ok(f"{nombre}: carga, sin scroll horizontal e interacción táctil", scroll <= ancho and precargado, {"scroll": scroll, "ancho": ancho})
            await ctx.close()

        await browser.close()

    ok("Consola sin errores en todas las pruebas", errores == [], errores)
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "resultados.json"), "w", encoding="utf-8") as f:
        json.dump({"pruebas": [r[0] for r in resultados], "anchos": tabla, "dispositivos": tabla_disp}, f, ensure_ascii=False, indent=2)
    print(f"\n✅ {len(resultados)} verificaciones pasaron")

asyncio.run(main())
