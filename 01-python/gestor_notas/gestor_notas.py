# =============================================================================
# gestor_notas.py — Gestor de Notas Personalizado
# Proyecto final de Fundamentos de Programación (DAW/DAM/ASIR)
#
# Para ejecutar:  python gestor_notas.py (o python3 gestor_notas.py según mi #
# sistema)
# Dependencia:    pip install colorama
# =============================================================================

from colorama import Fore, Style, init
# He instalado colorama para que los colores funcionen en Windows y Linux
# pip install colorama
init(autoreset=True)

# -----------------------------------------------------------------------------
# CONSTANTES
# Categorías disponibles para clasificar las notas
# -----------------------------------------------------------------------------
CATEGORIAS = ["Estudio", "Personal", "Trabajo", "Otro"]


# -----------------------------------------------------------------------------
# FUNCIÓN: mostrar_menu
# Imprime en pantalla las opciones del menú principal
# -----------------------------------------------------------------------------
def mostrar_menu():
    print(Fore.MAGENTA + "\n--- MENÚ PRINCIPAL ---" + Style.RESET_ALL)
    print(Fore.YELLOW + "1. Añadir una nota" + Style.RESET_ALL)
    print(Fore.YELLOW + "2. Ver todas las notas" + Style.RESET_ALL)
    print(Fore.YELLOW + "3. Buscar una nota por palabra clave" + Style.RESET_ALL)
    print(Fore.YELLOW + "4. Eliminar una nota" + Style.RESET_ALL)
    print(Fore.YELLOW + "5. Filtrar notas por categoría" + Style.RESET_ALL)
    print(Fore.BLUE + "6. Salir" + Style.RESET_ALL)


# -----------------------------------------------------------------------------
# FUNCIÓN: pedir_categoria
# Muestra las categorías disponibles y devuelve la elegida por el usuario.
# Si la entrada no es válida, asigna "otro" por defecto.
# -----------------------------------------------------------------------------
def pedir_categoria():
    print("\nCategorías disponibles:")
    for i, cat in enumerate(CATEGORIAS, start=1):
        print(f"  {i}. {cat}")

    try:
        eleccion = int(input("Elige el número de la categoría: ").strip())
        if 1 <= eleccion <= len(CATEGORIAS):
            return CATEGORIAS[eleccion - 1]
        else:
            print(Fore.YELLOW + "🚫 Número fuera de rango. Se asignará a 'Otro'." + Style.RESET_ALL)
            return "Otro"
    except ValueError:
        # El usuario escribió algo que no es un número
        print(Fore.YELLOW + "⛔ Entrada no válida. Se asignará 'Otro'." + Style.RESET_ALL)
        return "Otro"


# -----------------------------------------------------------------------------
# FUNCIÓN: añadir_nota
# Pide título, contenido y categoría al usuario y añade la nota a la lista.
# Antes de guardar pide confirmación (s/n).
# Si el título ya existe, avisa y pregunta si quiere sobrescribir.
# -----------------------------------------------------------------------------
def añadir_nota(notas):
    print(Fore.CYAN + "\n--- AÑADIR NOTA ---" + Style.RESET_ALL)

    titulo = input("\nEscribe el título de la nota \n(ej: Comentario, Teléfono, Cita médica, Nombre, etc.): ").strip()
    if not titulo:
        print(Fore.RED + "⚠️ El título no puede estar vacío." + Style.RESET_ALL)
        return

    contenido = input("Escribe el contenido de la nota: ").strip()
    if not contenido:
        print(Fore.RED + "⚠️ El contenido no puede estar vacío." + Style.RESET_ALL)
        return

    # El usuario elige una categoría para clasificar la nota
    categoria = pedir_categoria()

    # Buscamos si ya existe una nota con el mismo título (ignorando mayúsculas)
    indice_existente = None
    for i, nota in enumerate(notas):
        if nota["titulo"].lower() == titulo.lower():
            indice_existente = i
            break

    # Si el título ya existe, preguntamos si quiere sobrescribir
    if indice_existente is not None:
        print(Fore.YELLOW + f"⚠️ Ya existe una nota con el título '{notas[indice_existente]['titulo']}'." + Style.RESET_ALL)
        respuesta = input("¿Quieres sobrescribirla? (s/n): ").strip().lower()
        if respuesta == "s":
            notas[indice_existente]["contenido"] = contenido
            notas[indice_existente]["categoria"] = categoria
            print(Fore.GREEN + "✅ Nota sobrescrita correctamente." + Style.RESET_ALL)
        else:
            print(Fore.RED + "⛔ Operación cancelada. La nota no se ha modificado." + Style.RESET_ALL)
        return

    # Mostramos un resumen y pedimos confirmación antes de guardar
    print(f"\nTítulo:    {titulo}")
    print(f"Contenido: {contenido}")
    print(f"Categoría: {categoria}")
    confirmar = input("¿Guardar esta nota? (s/n): ").strip().lower()

    if confirmar == "s":
        # Añadimos la nueva nota como diccionario a la lista
        notas.append({"titulo": titulo, "contenido": contenido, "categoria": categoria})
        print(Fore.GREEN + "✅ Nota guardada correctamente." + Style.RESET_ALL)
    else:
        print(Fore.RED + "⛔ Operación cancelada. La nota no se ha guardado." + Style.RESET_ALL)


# -----------------------------------------------------------------------------
# FUNCIÓN: ver_notas
# Muestra todas las notas numeradas con título, contenido y categoría.
# Si se pasa filtro_categoria, solo muestra las notas de esa categoría.
# Si no hay notas, informa al usuario.
# -----------------------------------------------------------------------------
def ver_notas(notas, filtro_categoria=None):
    print(Fore.CYAN + "\n--- TODAS LAS NOTAS ---" + Style.RESET_ALL)

    # Si hay filtro, construimos una sub lista solo con las notas que coincidan
    lista = notas
    if filtro_categoria:
        lista = [n for n in notas if n.get("categoria", "").lower() == filtro_categoria.lower()]

    # Comprobamos si la lista (filtrada o no) está vacía
    if not lista:
        if filtro_categoria:
            print(Fore.YELLOW + f"🚫 No hay notas en la categoría '{filtro_categoria}'." + Style.RESET_ALL)
        else:
            print(Fore.YELLOW + "⚠️  No hay notas guardadas todavía." + Style.RESET_ALL)
        return

    # Recorremos la lista con enumerate para mostrar el número de cada nota
    for i, nota in enumerate(lista, start=1):
        categoria = nota.get("categoria", "sin categoría")
        print(Fore.GREEN + f"\n[{i}]" + Style.RESET_ALL + f" Título:    {nota['titulo']}")
        print(f"    Contenido: {nota['contenido']}")
        print(f"    Categoría: " + Fore.CYAN + categoria + Style.RESET_ALL)

    print(Fore.GREEN + f"\nTotal de notas mostradas: {len(lista)}" + Style.RESET_ALL)


# -----------------------------------------------------------------------------
# FUNCIÓN: buscar_nota
# Pide una palabra clave y recorre todas las notas buscando coincidencias
# en el título o en el contenido (sin distinguir mayúsculas/minúsculas).
# Si no encuentra nada, lo indica claramente.
# -----------------------------------------------------------------------------
def buscar_nota(notas):
    print(Fore.CYAN + "\n--- BUSCAR NOTA ---" + Style.RESET_ALL)

    if not notas:
        print(Fore.YELLOW + "🚫 No hay notas guardadas. No se puede buscar." + Style.RESET_ALL)
        return

    palabra = input("Escribe la palabra clave a buscar: ").strip().lower()
    if not palabra:
        print(Fore.RED + "⛔ No has introducido ninguna palabra clave." + Style.RESET_ALL)
        return

    # Guardamos las notas que contienen la palabra en título o contenido
    resultados = []
    for i, nota in enumerate(notas, start=1):
        if palabra in nota["titulo"].lower() or palabra in nota["contenido"].lower():
            resultados.append((i, nota))

    if not resultados:
        print(Fore.YELLOW + f"⛔ No se encontró ninguna nota con la palabra '{palabra}'." + Style.RESET_ALL)
    else:
        print(Fore.GREEN + f"\nSe encontraron {len(resultados)} nota(s) con '{palabra}':\n" + Style.RESET_ALL)
        for numero, nota in resultados:
            categoria = nota.get("categoria", "sin categoría")
            print(Fore.GREEN + f"[{numero}]" + Style.RESET_ALL + f" Título:    {nota['titulo']}")
            print(f"    Contenido: {nota['contenido']}")
            print(f"    Categoría: " + Fore.CYAN + categoria + Style.RESET_ALL + "\n")


# -----------------------------------------------------------------------------
# FUNCIÓN: eliminar_nota
# Muestra la lista de notas numeradas y elimina la que elija el usuario.
# Pide confirmación antes de borrar y valida que el número sea correcto.
# -----------------------------------------------------------------------------
def eliminar_nota(notas):
    print(Fore.CYAN + "\n--- ELIMINAR NOTA ---" + Style.RESET_ALL)

    if not notas:
        print(Fore.YELLOW + "🚫 No hay notas guardadas. No hay nada que eliminar." + Style.RESET_ALL)
        return

    # Mostramos la lista numerada con su categoría para que el usuario elija
    for i, nota in enumerate(notas, start=1):
        categoria = nota.get("categoria", "sin categoría")
        print(Fore.GREEN + f"[{i}]" + Style.RESET_ALL + f" {nota['titulo']}  (" + Fore.CYAN + categoria + Style.RESET_ALL + ")")

    # Recogemos el número con try/except para evitar que el programa se rompa
    try:
        numero = int(input("\nEscribe el número de la nota que quieres eliminar: ").strip())
    except ValueError:
        print(Fore.RED + "⛔ Entrada inválida. Debes introducir un número." + Style.RESET_ALL)
        return

    # Comprobamos que el número esté dentro del rango válido
    if numero < 1 or numero > len(notas):
        print(Fore.RED + f"⛔ Número fuera de rango. Debes elegir entre 1 y {len(notas)}." + Style.RESET_ALL)
        return

    nota_elegida = notas[numero - 1]
    print(Fore.YELLOW + f"\nVas a eliminar: '{nota_elegida['titulo']}'" + Style.RESET_ALL)
    confirmar = input("¿Confirmas la eliminación? (s/n): ").strip().lower()

    if confirmar == "s":
        notas.pop(numero - 1)   # pop() elimina el elemento en la posición indicada
        print(Fore.GREEN + "✅ Nota eliminada correctamente." + Style.RESET_ALL)
    else:
        print("🚫 Operación cancelada. La nota no se ha eliminado.")


# -----------------------------------------------------------------------------
# FUNCIÓN: filtrar_por_categoria
# Pide al usuario una categoría y llama a ver_notas con ese filtro aplicado.
# -----------------------------------------------------------------------------
def filtrar_por_categoria(notas):
    print(Fore.CYAN + "\n--- FILTRAR POR CATEGORÍA ---" + Style.RESET_ALL)
    print("Categorías disponibles:")
    for i, cat in enumerate(CATEGORIAS, start=1):
        print(f"  {i}. {cat}")

    categoria = input("Escribe el número o el nombre de la categoría a filtrar: ").strip().lower()

    # Acepta número o texto
    if categoria.isdigit():
        idx = int(categoria)
        if 1 <= idx <= len(CATEGORIAS):
            categoria = CATEGORIAS[idx - 1]
        else:
            print(Fore.RED + "Número de categoría fuera de rango." + Style.RESET_ALL)
            return
    else:
        if categoria not in [c.lower() for c in CATEGORIAS]:
            print(Fore.RED + "Categoría no válida." + Style.RESET_ALL)
            return
        # conservamos la versión normalizada para mostrar
        categoria = next(c for c in CATEGORIAS if c.lower() == categoria)

    ver_notas(notas, filtro_categoria=categoria)


# -----------------------------------------------------------------------------
# FUNCIÓN: main
# Bucle principal del programa. Muestra el menú y llama a cada función
# según la opción elegida. Se repite hasta que el usuario elige Salir.
# -----------------------------------------------------------------------------
def main():
    print(Fore.MAGENTA + "\n¡Bienvenido al Gestor de Notas Personalizado!" + Style.RESET_ALL)

    # Lista principal donde se almacenan todas las notas como diccionarios:
    # {"titulo": str, "contenido": str, "categoria": str}
    notas = []

    # Bucle principal: sigue ejecutándose hasta que el usuario elija salir
    while True:
        mostrar_menu()
        opcion = input("\nElige una opción (1-6): ").strip()

        if opcion == "1":
            añadir_nota(notas)
        elif opcion == "2":
            ver_notas(notas)
        elif opcion == "3":
            buscar_nota(notas)
        elif opcion == "4":
            eliminar_nota(notas)
        elif opcion == "5":
            filtrar_por_categoria(notas)
        elif opcion == "6":
            print(Fore.MAGENTA + "\n¡Hasta pronto 👋! Cerrando el gestor de notas.\n" + Style.RESET_ALL)
            break
        else:
            # Cualquier entrada fuera de rango muestra un aviso en rojo
            print(Fore.RED + "🚫 Opción no válida. Por favor, elige un número entre 1 y 6." + Style.RESET_ALL)


# Punto de entrada: solo ejecuta main() si se lanza este archivo directamente
if __name__ == "__main__":
    main()


# =================================================================================================================================================
# Autor:      [JAIME LLASTARRY JANSANA]
# Fecha:      septiembre 2026
# Descripción:
#   Gestor de Notas por terminal desarrollado como proyecto final de
#   Fundamentos de Programación (DAW/DAM/ASIR).
#
#   Funciones del programa:
#     mostrar_menu()               → imprime las opciones del menú
#     pedir_categoria()            → devuelve la categoría elegida por el usuario
#     añadir_nota(notas)           → añade una nota nueva a la lista
#     ver_notas(notas, filtro)     → muestra todas las notas (o filtradas)
#     buscar_nota(notas)           → busca notas por palabra clave
#     eliminar_nota(notas)         → elimina una nota por número
#     filtrar_por_categoria(notas) → filtra notas por categoría
#     main()                       → bucle principal del programa
#
#   Ampliaciones incluidas:
#     - Títulos orientativos para notas (ej: Comentario, Teléfono, Cita médica, Nombre, etc.)
#     - Categorías por nota (Estudio / Personal / Trabajo / Otro)
#     - Filtrado de notas por categoría (opción 5)
#     - Colores con colorama (verde=éxito, rojo=error, amarillo=aviso, cyan=info, azul=exit, magenta=títulos)
#     - Se ha instalado colorama para que los colores funcionen en Windows y Linux. Instalación con: pip install colorama (desde la terminal)
#   Notas:
#     - El programa no guarda las notas en un archivo, por lo que se perderán al cerrar. Se podrían guardar en un JSON o CSV para futuras mejoras.
#     - Se podían añadir: fechas a las notas, edición de notas existentes, ordenación por título o categoría (en lugar de entrada), etc.
# =================================================================================================================================================
