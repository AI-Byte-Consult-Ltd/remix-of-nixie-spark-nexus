import type { VideoGuide } from "./types";

const es: VideoGuide = {
  guideHeading: "Cómo se usa",
  guideIntro: "Del inicio de sesión a tu primer vídeo en unos cinco minutos. NICS Video y NICS Studio comparten un solo inicio de sesión y un solo saldo de créditos.",
  guides: [
    {
      title: "Inicia sesión y recibe 10 créditos gratis",
      steps: [
        "Toca «Iniciar sesión», escribe tu email y toca «Recibir el código».",
        "Abre el email de noreply@aibyteconsult.com (revisa también el spam) e introduce el código de 6 dígitos. Vale 15 minutos.",
        "La sesión queda abierta en este dispositivo, en NICS Video y en NICS Studio.",
        "En «Precios» toca «Conseguir 10 créditos», escribe tu nombre y confirma. No hace falta tarjeta; los créditos se dan una vez por email y duran 30 días.",
      ],
    },
    {
      title: "Edición automática con NICS Video",
      steps: [
        "En «Sube tu material» escribe un título para las portadas (el de inglés es opcional).",
        "Elige hasta 20 clips: MP4, MOV, AVI, MKV, M4V o 3GP, hasta 1 GB cada uno y 1,5 GB en total.",
        "Toca «Subir y empezar» y deja la página abierta hasta que termine la subida. Un paquete cuesta 10 créditos.",
        "Después puedes cerrar la página. El estado muestra la cola, el análisis de escenas, el plan de montaje, el render y las portadas.",
        "Cuando el paquete está listo recibes un email con un enlace. Descarga el Short, el vídeo largo y las cuatro portadas en un plazo de 7 días.",
      ],
    },
    {
      title: "Edita tú mismo en NICS Studio",
      steps: [
        "Abre NICS Studio y añade vídeos o fotos en «Medios». El vídeo final puede durar hasta 3 minutos.",
        "Edita en la línea de tiempo: recortar, dividir, reordenar, añadir texto, música, filtros, zooms y fundidos. La edición manual es gratis.",
        "O escribe al agente en inglés o en ruso, por ejemplo: «cut the pauses, add captions 3 words at a time, a little bigger, and add zooms». Cada petición cuesta 1 crédito.",
        "Subtítulos: abre «Subtítulos», elige ruso o inglés y toca «Generar subtítulos» (1 crédito). Revisa y corrige el texto.",
        "Elige 9:16, 16:9 o 1:1 y toca «Exportar» (2 créditos) y luego «Descargar». Los proyectos se guardan solos en este navegador.",
      ],
    },
    {
      title: "Compra un plan",
      steps: [
        "Cuando se acaban los créditos, la web te dice cuántos hacen falta y cuántos quedan.",
        "En «Precios» elige Start, Creator o Pro y toca «Continuar al pago». Usa el mismo email con el que inicias sesión.",
        "Paga con tarjeta en la página segura de Revolut, que se abre en una pestaña nueva. El cargo es en euros.",
        "Unos minutos después del pago los créditos se activan solos durante 30 días. Sigue subiendo material o editando en NICS Studio.",
      ],
    },
  ],
  faqHeading: "Preguntas frecuentes",
  faq: [
    {
      q: "¿Cómo funciona NICS Video?",
      a: "Sube tus clips y el sistema elige los mejores planos y te monta un Short, un vídeo largo y portadas. Si prefieres editar a mano, abre NICS Studio, dile al agente qué cambiar, ajusta la línea de tiempo y exporta cuando quieras.",
    },
    {
      q: "¿Qué vídeos puedo usar?",
      a: "Para la edición automática: MP4, MOV, AVI, MKV, M4V o 3GP, hasta 20 archivos, 1 GB cada uno y 1,5 GB en total. NICS Studio acepta vídeos MP4 o MOV y fotos JPG o PNG, para un vídeo final de hasta 3 minutos.",
    },
    {
      q: "¿Puedo editar mis vídeos?",
      a: "Sí, en NICS Studio: recorta y reordena clips, añade subtítulos, texto, música, filtros, zooms y fundidos, y cambia entre 9:16, 16:9 y 1:1. La edición manual no cuesta nada; los créditos son solo para el agente, los subtítulos y la exportación.",
    },
    {
      q: "¿Qué idiomas se admiten?",
      a: "Las portadas están en ruso e inglés. Los subtítulos y las órdenes al agente funcionan en ruso e inglés. La web y el editor están en 12 idiomas, y vendrán más.",
    },
    {
      q: "¿Cómo funcionan los créditos?",
      a: "Un solo saldo para los dos servicios: un paquete automático cuesta 10 créditos, una exportación en NICS Studio 2, una petición al agente 1 y los subtítulos 1. Los créditos solo se descuentan si el trabajo sale bien y duran 30 días.",
    },
    {
      q: "¿Puedo cancelar mi plan?",
      a: "No hay nada que cancelar: cada pago es una compra única de créditos para 30 días, sin renovación automática ni cargos recurrentes. Para seguir, vuelve a comprar un plan.",
    },
    {
      q: "¿Cuánto cuesta NICS Video?",
      a: "Empiezas gratis con 10 créditos, una sola vez. Después, Start 14,99 EUR (60 créditos), Creator 34,99 EUR (250) o Pro 69,99 EUR (700), cada uno para 30 días. Pago con tarjeta a través de Revolut.",
    },
    {
      q: "¿Qué es un crédito?",
      a: "El crédito es la unidad con la que se paga el trabajo de la IA: edición automática, reconocimiento de voz para subtítulos, peticiones al agente y render del vídeo final. En el plan Start un crédito cuesta unos 25 céntimos.",
    },
    {
      q: "¿Dónde se guardan mis archivos?",
      a: "La edición automática funciona en nuestro propio hardware con modelos locales, nunca en nubes de IA externas; los archivos terminados se guardan 7 días. NICS Studio funciona en tu dispositivo y no sube tus archivos a ningún sitio.",
    },
    {
      q: "No me ha llegado el código de acceso",
      a: "Revisa el spam y toca «Enviar de nuevo». A un mismo email se pueden enviar como máximo 5 códigos por hora. ¿Sigue sin llegar? Escribe a info@aibyteconsult.com.",
    },
  ],
};

export default es;
