import type { VideoGuide } from "./types";

const it: VideoGuide = {
  guideHeading: "Come si usa",
  guideIntro: "Dall’accesso al primo video in circa cinque minuti. NICS Video e NICS Studio condividono un solo accesso e un solo saldo di crediti.",
  guides: [
    {
      title: "Accedi e ricevi 10 crediti gratuiti",
      steps: [
        "Tocca «Accedi», inserisci la tua email e tocca «Ricevi il codice».",
        "Apri l’email di noreply@aibyteconsult.com (controlla anche lo spam) e inserisci il codice a 6 cifre. Vale 15 minuti.",
        "Resti connesso su questo dispositivo, su NICS Video e in NICS Studio.",
        "In «Prezzi» tocca «Ottieni 10 crediti», inserisci il nome e conferma. Nessuna carta richiesta; i crediti si ricevono una volta per email e valgono 30 giorni.",
      ],
    },
    {
      title: "Montaggio automatico con NICS Video",
      steps: [
        "In «Carica le tue riprese» scrivi un titolo per le copertine (quello in inglese è facoltativo).",
        "Scegli fino a 20 clip: MP4, MOV, AVI, MKV, M4V o 3GP, fino a 1 GB ciascuna e 1,5 GB in totale.",
        "Tocca «Carica e avvia» e tieni aperta la pagina fino alla fine del caricamento. Un pacchetto costa 10 crediti.",
        "Poi puoi chiudere la pagina. Lo stato mostra coda, analisi delle scene, piano di montaggio, rendering e copertine.",
        "Quando il pacchetto è pronto ricevi un’email con un link. Scarica lo Short, il video lungo e le quattro copertine entro 7 giorni.",
      ],
    },
    {
      title: "Monta da solo in NICS Studio",
      steps: [
        "Apri NICS Studio e aggiungi video o foto in «Media». Il video finale può durare fino a 3 minuti.",
        "Monta sulla timeline: taglia, dividi, riordina, aggiungi testo, musica, filtri, zoom e dissolvenze. Le modifiche manuali sono gratuite.",
        "Oppure scrivi all’agente in inglese o in russo, per esempio: «cut the pauses, add captions 3 words at a time, a little bigger, and add zooms». Una richiesta costa 1 credito.",
        "Sottotitoli: apri «Sottotitoli», scegli russo o inglese e tocca «Genera sottotitoli» (1 credito). Controlla e correggi il testo.",
        "Scegli 9:16, 16:9 o 1:1 e tocca «Esporta» (2 crediti), poi «Scarica». I progetti si salvano da soli in questo browser.",
      ],
    },
    {
      title: "Acquista un piano",
      steps: [
        "Quando i crediti finiscono, il sito indica quanti ne servono e quanti ne restano.",
        "In «Prezzi» scegli Start, Creator o Pro e tocca «Vai al pagamento». Usa la stessa email con cui accedi.",
        "Paga con carta sulla pagina sicura di Revolut, che si apre in una nuova scheda. L’addebito è in euro.",
        "Pochi minuti dopo il pagamento i crediti si attivano da soli per 30 giorni. Continua con i caricamenti o con NICS Studio.",
      ],
    },
  ],
  faqHeading: "Domande frequenti",
  faq: [
    {
      q: "Come funziona NICS Video?",
      a: "Carica le tue clip: il sistema sceglie le inquadrature migliori e monta per te uno Short, un video lungo e le copertine. Per montare a mano apri NICS Studio, di’ all’agente cosa cambiare, rifinisci la timeline ed esporta quando sei pronto.",
    },
    {
      q: "Quali video posso usare?",
      a: "Per il montaggio automatico: MP4, MOV, AVI, MKV, M4V o 3GP, fino a 20 file, 1 GB ciascuno e 1,5 GB in totale. NICS Studio accetta video MP4 o MOV e foto JPG o PNG, per un video finale fino a 3 minuti.",
    },
    {
      q: "Posso modificare i miei video?",
      a: "Sì, in NICS Studio: taglia e riordina le clip, aggiungi sottotitoli, testo, musica, filtri, zoom e dissolvenze, passa tra 9:16, 16:9 e 1:1. Le modifiche manuali non costano nulla; i crediti servono solo per agente, sottotitoli ed esportazione.",
    },
    {
      q: "Quali lingue sono supportate?",
      a: "Le copertine sono in russo e in inglese. Sottotitoli e comandi all’agente funzionano in russo e in inglese. Il sito e l’editor sono disponibili in 12 lingue, e altre lingue arriveranno.",
    },
    {
      q: "Come funzionano i crediti?",
      a: "Un unico saldo per entrambi i servizi: un pacchetto automatico costa 10 crediti, un’esportazione in NICS Studio 2, una richiesta all’agente 1, i sottotitoli 1. I crediti vengono scalati solo a lavoro riuscito e valgono 30 giorni.",
    },
    {
      q: "Posso disdire il piano?",
      a: "Non c’è nulla da disdire: ogni pagamento è un acquisto una tantum di crediti per 30 giorni, senza rinnovo automatico né addebiti ricorrenti. Per continuare, acquista di nuovo un piano.",
    },
    {
      q: "Quanto costa NICS Video?",
      a: "Inizi gratis con 10 crediti, una volta sola. Poi Start 14,99 EUR (60 crediti), Creator 34,99 EUR (250) o Pro 69,99 EUR (700), ciascuno per 30 giorni. Pagamento con carta tramite Revolut.",
    },
    {
      q: "Che cos’è un credito?",
      a: "Il credito è l’unità con cui si paga l’elaborazione: montaggio automatico, riconoscimento vocale per i sottotitoli, richieste all’agente e rendering del video finale. Con il piano Start un credito costa circa 25 centesimi.",
    },
    {
      q: "Dove vengono conservati i miei file?",
      a: "Il montaggio automatico gira sul nostro hardware, mai su cloud esterni; i file finiti restano disponibili 7 giorni. NICS Studio funziona sul tuo dispositivo e non carica i tuoi file da nessuna parte.",
    },
    {
      q: "Il codice di accesso non è arrivato",
      a: "Controlla lo spam e tocca «Invia di nuovo». A una stessa email si possono inviare al massimo 5 codici all’ora. Ancora niente? Scrivi a info@aibyteconsult.com.",
    },
  ],
};

export default it;
