import type { VideoGuide } from "./types";

const de: VideoGuide = {
  guideHeading: "So nutzen Sie es",
  guideIntro: "Von der Anmeldung bis zum ersten Video in etwa fünf Minuten. NICS Video und NICS Studio teilen sich eine Anmeldung und ein Credit-Guthaben.",
  guides: [
    {
      title: "Anmelden und 10 Gratis-Credits erhalten",
      steps: [
        "Tippen Sie auf „Anmelden“, geben Sie Ihre E-Mail ein und tippen Sie auf „Code anfordern“.",
        "Öffnen Sie die E-Mail von noreply@aibyteconsult.com (auch im Spam nachsehen) und geben Sie den 6-stelligen Code ein. Er gilt 15 Minuten.",
        "Sie bleiben auf diesem Gerät angemeldet, auf NICS Video und in NICS Studio.",
        "Tippen Sie unter „Preise“ auf „10 Credits erhalten“, geben Sie Ihren Namen ein und bestätigen Sie. Keine Karte nötig; die Credits gibt es einmal pro E-Mail, sie gelten 30 Tage.",
      ],
    },
    {
      title: "Automatischer Schnitt mit NICS Video",
      steps: [
        "Schreiben Sie unter „Material hochladen“ einen Titel für die Cover (der englische ist optional).",
        "Wählen Sie bis zu 20 Clips: MP4, MOV, AVI, MKV, M4V oder 3GP, je bis 1 GB und insgesamt bis 1,5 GB.",
        "Tippen Sie auf „Hochladen und starten“ und lassen Sie die Seite offen, bis der Upload fertig ist. Ein Paket kostet 10 Credits.",
        "Danach können Sie die Seite schließen. Der Status zeigt Warteschlange, Szenenanalyse, Schnittplan, Rendern und Cover.",
        "Ist das Paket fertig, erhalten Sie eine E-Mail mit Link. Laden Sie Short, langes Video und die vier Cover innerhalb von 7 Tagen herunter.",
      ],
    },
    {
      title: "Selbst schneiden in NICS Studio",
      steps: [
        "Öffnen Sie NICS Studio und fügen Sie unter „Medien“ Videos oder Fotos hinzu. Das fertige Video darf bis zu 3 Minuten lang sein.",
        "Schneiden Sie auf der Timeline: kürzen, teilen, umsortieren, Text, Musik, Filter, Zooms und Blenden. Manuelle Schnitte sind kostenlos.",
        "Oder schreiben Sie dem Agenten auf Englisch oder Russisch, zum Beispiel: „cut the pauses, add captions 3 words at a time, a little bigger, and add zooms“. Eine Anfrage kostet 1 Credit.",
        "Untertitel: Öffnen Sie „Untertitel“, wählen Sie Russisch oder Englisch und tippen Sie auf „Untertitel erstellen“ (1 Credit). Prüfen und korrigieren Sie den Text.",
        "Wählen Sie 9:16, 16:9 oder 1:1 und tippen Sie auf „Exportieren“ (2 Credits), dann „Herunterladen“. Projekte speichern sich automatisch in diesem Browser.",
      ],
    },
    {
      title: "Einen Tarif kaufen",
      steps: [
        "Wenn die Credits ausgehen, zeigt die Seite, wie viele nötig sind und wie viele übrig sind.",
        "Wählen Sie unter „Preise“ Start, Creator oder Pro und tippen Sie auf „Weiter zur Zahlung“. Nutzen Sie dieselbe E-Mail wie bei der Anmeldung.",
        "Zahlen Sie per Karte auf der sicheren Revolut-Seite, die sich in einem neuen Tab öffnet. Abgerechnet wird in Euro.",
        "Wenige Minuten nach der Zahlung werden die Credits automatisch für 30 Tage aktiviert. Machen Sie mit Uploads oder NICS Studio weiter.",
      ],
    },
  ],
  faqHeading: "Häufige Fragen",
  faq: [
    {
      q: "Wie funktioniert NICS Video?",
      a: "Laden Sie Ihre Clips hoch, und das System wählt die besten Aufnahmen und schneidet daraus ein Short, ein langes Video und Cover. Zum Selberschneiden öffnen Sie NICS Studio, sagen dem Agenten, was er ändern soll, feilen an der Timeline und exportieren, wenn Sie fertig sind.",
    },
    {
      q: "Welche Videos kann ich verwenden?",
      a: "Für den automatischen Schnitt: MP4, MOV, AVI, MKV, M4V oder 3GP, bis zu 20 Dateien, je 1 GB und insgesamt 1,5 GB. NICS Studio nimmt MP4- oder MOV-Videos und JPG- oder PNG-Fotos, für ein fertiges Video bis 3 Minuten.",
    },
    {
      q: "Kann ich meine Videos bearbeiten?",
      a: "Ja, in NICS Studio: Clips kürzen und umsortieren, Untertitel, Text, Musik, Filter, Zooms und Blenden hinzufügen und zwischen 9:16, 16:9 und 1:1 wechseln. Manuelle Schnitte kosten nichts; Credits braucht es nur für Agent, Untertitel und Export.",
    },
    {
      q: "Welche Sprachen werden unterstützt?",
      a: "Cover gibt es auf Russisch und Englisch. Untertitel und Agenten-Befehle funktionieren auf Russisch und Englisch. Website und Editor gibt es in 12 Sprachen, weitere Sprachen folgen.",
    },
    {
      q: "Wie funktionieren Credits?",
      a: "Ein Guthaben für beide Dienste: Ein automatisches Paket kostet 10 Credits, ein Export in NICS Studio 2, eine Agenten-Anfrage 1, Untertitel 1. Credits werden erst nach erfolgreicher Arbeit abgezogen und gelten 30 Tage.",
    },
    {
      q: "Kann ich meinen Tarif kündigen?",
      a: "Es gibt nichts zu kündigen: Jede Zahlung ist ein einmaliger Kauf von Credits für 30 Tage, ohne automatische Verlängerung und ohne wiederkehrende Abbuchung. Zum Weitermachen kaufen Sie einfach erneut einen Tarif.",
    },
    {
      q: "Was kostet NICS Video?",
      a: "Sie starten gratis mit 10 Credits, einmalig. Danach Start 14,99 EUR (60 Credits), Creator 34,99 EUR (250) oder Pro 69,99 EUR (700), jeweils für 30 Tage. Zahlung per Karte über Revolut.",
    },
    {
      q: "Was ist ein Credit?",
      a: "Mit Credits wird hier die Verarbeitung bezahlt: automatischer Schnitt, Spracherkennung für Untertitel, Agenten-Anfragen und das Rendern des fertigen Videos. Im Start-Tarif kostet ein Credit etwa 25 Cent.",
    },
    {
      q: "Wo werden meine Dateien gespeichert?",
      a: "Der automatische Schnitt läuft auf unserer eigenen Hardware, nie in fremden Clouds; fertige Dateien werden 7 Tage aufbewahrt. NICS Studio arbeitet auf Ihrem Gerät und lädt Ihre Dateien nirgendwohin hoch.",
    },
    {
      q: "Der Anmeldecode ist nicht angekommen",
      a: "Sehen Sie im Spam nach und tippen Sie auf „Erneut senden“. An eine E-Mail gehen höchstens 5 Codes pro Stunde. Klappt es nicht, schreiben Sie an info@aibyteconsult.com.",
    },
  ],
};

export default de;
