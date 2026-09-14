// ============================================================
// PRÁCTICA 3 LM — Sistema de Gestión Académica
// ============================================================

const readline = require("readline");

// ──────────────────────────────────────────────────────────────
// BLOQUE 9 — Ámbito de Variables
// ──────────────────────────────────────────────────────────────

var sistemaActivo = true;

function ejemploAmbitoVariables() {
    if (true) {
        var conVar = "Soy var, visible fuera del bloque if";
        let conLet = "Soy let, solo visible dentro del bloque if";
        console.log("[Ámbito] Dentro del bloque - var:", conVar);
        console.log("[Ámbito] Dentro del bloque - let:", conLet);
    }
    console.log("[Ámbito] Fuera del bloque - var:", conVar);
    // console.log(conLet); // ❌ ReferenceError: let no existe fuera de su bloque

    let variableLocal = "Solo existo dentro de ejemploAmbitoVariables()";
    console.log("[Ámbito] Variable local:", variableLocal);
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 1 — Array global de estudiantes
// ──────────────────────────────────────────────────────────────

let estudiantes = [];

// ──────────────────────────────────────────────────────────────
// DATOS DE PRUEBA — Son datos de prueba
// NOTA: Estos datos son INVENTADOS. Se cargan al inicio.
// ──────────────────────────────────────────────────────────────

const datosDePrueba = [
    {
        id: 1,
        nombre: "Ana García",
        edad: 20,
        notas: [9, 8.5, 9.5],
        mostrarInformacion() {
            console.log(`  Nombre : ${this.nombre}`);
            console.log(`  Edad   : ${this.edad} años`);
            console.log(`  Notas registradas: ${this.notas.length}`);
        },
    },
    {
        id: 2,
        nombre: "Carlos López",
        edad: 22,
        notas: [6, 7, 5.5],
        mostrarInformacion() {
            console.log(`  Nombre : ${this.nombre}`);
            console.log(`  Edad   : ${this.edad} años`);
            console.log(`  Notas registradas: ${this.notas.length}`);
        },
    },
    {
        id: 3,
        nombre: "Beatriz Blanco",
        edad: 19,
        notas: [3, 4, 2],
        mostrarInformacion() {
            console.log(`  Nombre : ${this.nombre}`);
            console.log(`  Edad   : ${this.edad} años`);
            console.log(`  Notas registradas: ${this.notas.length}`);
        },
    },
];

// ──────────────────────────────────────────────────────────────
// Utilidades readline — Entrada/salida estándar
// ──────────────────────────────────────────────────────────────

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function preguntar(pregunta) {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta.trim());
        });
    });
}

async function pedirEnteroPositivo(mensaje) {
    while (true) {
        const entrada = await preguntar(mensaje);
        const valor = Number(entrada);
        if (!isNaN(valor) && Number.isInteger(valor) && valor > 0) {
            return valor;
        }
        console.log("  ⚠  Valor no válido. Introduce un número entero positivo.");
    }
}

async function pedirString(mensaje) {
    while (true) {
        const entrada = await preguntar(mensaje);
        if (typeof entrada === "string" && entrada.length > 0) {
            return entrada;
        }
        console.log("  ⚠  El campo no puede estar vacío.");
    }
}

async function pedirNumero(mensaje, allowEmpty = false) {
    while (true) {
        const entrada = await preguntar(mensaje);
        if (allowEmpty && entrada === "") return null;
        const normalizado = entrada.replace(",", ".");
        const valor = Number(normalizado);
        if (!isNaN(valor) && normalizado.trim() !== "") {
            return valor;
        }
        console.log("  ⚠  Valor no válido. Introduce un número (ej: 7, 6.5 o 6,5).");
    }
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 2 — Registro de Estudiantes
// ──────────────────────────────────────────────────────────────

function agregarEstudiante(id, nombre, edad) {
    try {
        if (typeof id !== "number" || isNaN(id)) {
            throw new Error("El id debe ser un número.");
        }
        if (typeof edad !== "number" || !Number.isInteger(edad) || edad <= 0) {
            throw new Error("La edad debe ser un número entero positivo.");
        }
        if (typeof nombre !== "string" || nombre.trim() === "") {
            throw new Error("El nombre debe ser un string no vacío.");
        }
        for (let i = 0; i < estudiantes.length; i++) {
            if (estudiantes[i].id === id) {
                throw new Error(`Ya existe un estudiante con el id ${id}.`);
            }
        }
        estudiantes.push({
            id,
            nombre: nombre.trim(),
            edad,
            notas: [],
            mostrarInformacion() {
                console.log(`  Nombre : ${this.nombre}`);
                console.log(`  Edad   : ${this.edad} años`);
                console.log(`  Notas registradas: ${this.notas.length}`);
            },
        });
        console.log(`✅ Estudiante "${nombre.trim()}" registrado correctamente.`);
    } catch (error) {
        console.log(`❌ Error al registrar estudiante: ${error.message}`);
    } finally {
        console.log("   Intento de registro finalizado");
    }
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 3 — Gestión de Notas
// ──────────────────────────────────────────────────────────────

function agregarNota(idEstudiante, nota) {
    if (nota < 0 || nota > 10) {
        console.log("❌ La nota debe estar entre 0 y 10.");
        return;
    }
    let encontrado = false;
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].id === idEstudiante) {
            estudiantes[i].notas.push(nota);
            console.log(`✅ Nota ${nota} añadida a ${estudiantes[i].nombre}.`);
            encontrado = true;
            break;
        }
    }
    if (!encontrado) {
        console.log(`❌ No existe ningún estudiante con id ${idEstudiante}.`);
    }
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 4 — Cálculo de Promedio
// ──────────────────────────────────────────────────────────────

function calcularPromedio(idEstudiante) {
    let estudiante = null;
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].id === idEstudiante) {
            estudiante = estudiantes[i];
            break;
        }
    }
    if (!estudiante) {
        console.log(`❌ No existe ningún estudiante con id ${idEstudiante}.`);
        return;
    }
    if (estudiante.notas.length === 0) {
        console.log(`ℹ  ${estudiante.nombre} no tiene notas registradas.`);
        return;
    }
    let suma = 0;
    estudiante.notas.forEach((nota) => {
        suma += nota;
    });
    const promedio = suma / estudiante.notas.length;
    console.log(`📊 Promedio de ${estudiante.nombre}: ${promedio.toFixed(2)}`);
    if (promedio < 5) {
        console.log("   → Estado: Suspende");
    } else if (promedio < 9) {
        console.log("   → Estado: Aprobado");
    } else {
        console.log("   → Estado: Excelente");
    }
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 5 — Análisis de Strings
// ──────────────────────────────────────────────────────────────

function primeraLetraRepetida(nombre) {
    if (typeof nombre !== "string") {
        console.log("❌ El argumento debe ser un string.");
        return;
    }
    const nombreLower = nombre.toLowerCase();
    for (let i = 0; i < nombreLower.length; i++) {
        const charActual = nombreLower[i];
        if (charActual === " ") continue;
        for (let j = 0; j < i; j++) {
            if (nombreLower[j] === charActual) {
                console.log(`🔤 Primera letra repetida en "${nombre}": '${charActual}'`);
                return charActual;
            }
        }
    }
    console.log(`🔤 No hay letras repetidas en "${nombre}".`);
    return null;
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 6 — Recursividad
// ──────────────────────────────────────────────────────────────

function sumaHastaN(n) {
    if (typeof n !== "number" || !Number.isInteger(n) || n <= 0) {
        console.log("❌ n debe ser un número entero positivo.");
        return 0;
    }
    if (n === 1) return 1;
    return n + sumaHastaN(n - 1);
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 7 — Objetos y this
// ──────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────
// BLOQUE 8 — Manipulación Avanzada de Arrays
// ──────────────────────────────────────────────────────────────

function mostrarEstudiantesDestacados() {
    const obtenerPromedio = (est) => {
        if (est.notas.length === 0) return 0;
        let suma = 0;
        est.notas.forEach((n) => (suma += n));
        return suma / est.notas.length;
    };
    const destacados = estudiantes.filter((est) => obtenerPromedio(est) >= 9);
    const nombres = destacados.map((est) => est.nombre);
    if (nombres.length === 0) {
        console.log("ℹ  No hay estudiantes destacados (promedio >= 9).");
    } else {
        console.log("🌟 Estudiantes destacados (promedio ≥ 9):");
        nombres.forEach((nombre) => console.log(`   - ${nombre}`));
    }
}

// ──────────────────────────────────────────────────────────────
// Función auxiliar — Mostrar todos los estudiantes
// ──────────────────────────────────────────────────────────────

function mostrarEstudiantes() {
    if (estudiantes.length === 0) {
        console.log("ℹ  No hay estudiantes registrados.");
        return;
    }
    console.log("\n📋 Lista de estudiantes:");
    estudiantes.forEach((est) => {
        console.log(`\n  [ID: ${est.id}]`);
        est.mostrarInformacion();
        console.log(
            `  Notas  : ${est.notas.length > 0 ? est.notas.join(", ") : "Sin notas"}`
        );
    });
}

// ──────────────────────────────────────────────────────────────
// Función auxiliar — Mostrar lista compacta id → nombre
// ──────────────────────────────────────────────────────────────

function mostrarListaIds() {
    if (estudiantes.length === 0) {
        console.log("  ℹ  No hay estudiantes registrados aún.");
        return;
    }
    console.log("  Estudiantes disponibles:");
    for (let i = 0; i < estudiantes.length; i++) {
        console.log(`    ID ${estudiantes[i].id} → ${estudiantes[i].nombre}`);
    }
}

// ──────────────────────────────────────────────────────────────
// Función auxiliar — Eliminar estudiante
// ──────────────────────────────────────────────────────────────

function eliminarEstudiante(idEstudiante) {
    let indice = -1;
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].id === idEstudiante) {
            indice = i;
            break;
        }
    }
    if (indice === -1) {
        console.log(`❌ No existe ningún estudiante con id ${idEstudiante}.`);
        return;
    }
    const eliminado = estudiantes.splice(indice, 1)[0];
    console.log(`✅ Estudiante "${eliminado.nombre}" (ID ${eliminado.id}) eliminado correctamente.`);
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 1 — Función principal del sistema (menú con switch)
// ──────────────────────────────────────────────────────────────

async function iniciarSistema() {
    console.log("\n📦 Cargando datos de prueba...");
    datosDePrueba.forEach((d) => {
        estudiantes.push(d);
    });
    console.log(`   ${datosDePrueba.length} estudiantes de prueba cargados correctamente.`);

    ejemploAmbitoVariables();

    let salir = false;

    while (!salir) {
        console.log(`
╔══════════════════════════════════════╗
║   SISTEMA DE GESTIÓN ACADÉMICA       ║
╠══════════════════════════════════════╣
║  1. Agregar estudiante               ║
║  2. Mostrar estudiantes              ║
║  3. Calcular promedio de estudiante  ║
║  4. Primera letra repetida en nombre ║
║  5. Calcular suma recursiva hasta N  ║
║  6. Agregar nota a estudiante        ║
║  7. Mostrar estudiantes destacados   ║
║  8. Eliminar estudiante              ║
║  9. Salir                            ║
╚══════════════════════════════════════╝`);

        const opcionStr = await preguntar("Elige una opción (1-9): ");
        const opcion = Number(opcionStr);

        if (isNaN(opcion) || !Number.isInteger(opcion) || opcion < 1 || opcion > 9) {
            console.log("⚠  Opción no válida. Introduce un número entre 1 y 9.");
            continue;
        }

        switch (opcion) {

            // ── Opción 1: Registrar un nuevo estudiante
            case 1: {
                console.log("\n── Agregar Estudiante ──");
                const id     = await pedirEnteroPositivo("  ID (número entero positivo): ");
                const nombre = await pedirString("  Nombre: ");
                const edad   = await pedirEnteroPositivo("  Edad (número entero positivo): ");
                agregarEstudiante(id, nombre, edad);
                break;
            }

            // ── Opción 2: Listar todos los estudiantes
            case 2:
                mostrarEstudiantes();
                break;

            // ── Opción 3: Calcular promedio de un estudiante
            case 3: {
                console.log("\n── Calcular Promedio ──");
                const id = await pedirEnteroPositivo("  ID del estudiante: ");
                calcularPromedio(id);
                break;
            }

            // ── Opción 4: Detectar primera letra repetida
            case 4: {
                console.log("\n── Primera Letra Repetida ──");
                const nombre = await pedirString("  Nombre a analizar: ");
                primeraLetraRepetida(nombre);
                break;
            }

            // ── Opción 5: Suma recursiva hasta N
            case 5: {
                console.log("\n── Suma Recursiva ──");
                const n = await pedirEnteroPositivo("  Introduce N (número entero positivo): ");
                const resultado = sumaHastaN(n);
                console.log(`  Suma desde 1 hasta ${n} = ${resultado}`);
                break;
            }

            // ── Opción 6: Añadir una nota a un estudiante
            case 6: {
                console.log("\n── Agregar Nota ──");
                mostrarListaIds();
                const id = await pedirEnteroPositivo("  ID del estudiante: ");
                const notaRaw = await pedirNumero(
                    "  Nota (0-10, Enter para omitir): ",
                    true
                );
                if (notaRaw === null) {
                    console.log("ℹ  No se añadió ninguna nota.");
                } else if (notaRaw < 0 || notaRaw > 10) {
                    console.log("❌ La nota debe estar entre 0 y 10.");
                } else {
                    agregarNota(id, notaRaw);
                }
                break;
            }

            // ── Opción 7: Mostrar estudiantes con promedio >= 9
            case 7:
                mostrarEstudiantesDestacados();
                break;

            // ── Opción 8: Eliminar estudiante -Añadido como extra-
            case 8: {
                console.log("\n── Eliminar Estudiante ──");
                mostrarListaIds();
                if (estudiantes.length === 0) break;
                const id = await pedirEnteroPositivo("  ID del estudiante a eliminar: ");
                const confirmacion = await preguntar(
                    `  ¿Seguro que quieres eliminar al estudiante con ID ${id}? (s/n): `
                );
                if (confirmacion.toLowerCase() === "s") {
                    eliminarEstudiante(id);
                } else {
                    console.log("ℹ  Eliminación cancelada.");
                }
                break;
            }

            // ── Opción 9: Terminar el programa
            case 9:
                console.log("\n👋 Saliendo del sistema...");
                salir = true;
                break;

            default:
                console.log("⚠  Opción no válida.");
        }
    }

    rl.close();
}

// ──────────────────────────────────────────────────────────────
// BLOQUE 10 — Manejo Global de Errores + arranque del programa
// ──────────────────────────────────────────────────────────────

try {
    iniciarSistema();
} catch (e) {
    console.log("Error general del sistema:", e.message);
} finally {
    console.log("Sistema finalizado correctamente");
}
