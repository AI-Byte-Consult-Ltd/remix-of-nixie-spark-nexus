import type { VideoGuide } from "./types";

const pl: VideoGuide = {
  guideHeading: "Jak korzystać",
  guideIntro: "Od logowania do pierwszego filmu w około pięć minut. NICS Video i NICS Studio mają jedno logowanie i jedno saldo kredytów.",
  guides: [
    {
      title: "Zaloguj się i odbierz 10 darmowych kredytów",
      steps: [
        "Kliknij „Zaloguj się”, wpisz e-mail i kliknij „Wyślij kod”.",
        "Otwórz wiadomość od noreply@aibyteconsult.com (sprawdź też spam) i wpisz 6-cyfrowy kod. Jest ważny 15 minut.",
        "Pozostajesz zalogowany na tym urządzeniu, w NICS Video i w NICS Studio.",
        "W sekcji „Cennik” kliknij „Odbierz 10 kredytów”, podaj imię i potwierdź. Karta nie jest potrzebna; kredyty przysługują raz na e-mail i są ważne 30 dni.",
      ],
    },
    {
      title: "Automatyczny montaż w NICS Video",
      steps: [
        "W sekcji „Wgraj swój materiał” wpisz tytuł okładki (angielski jest opcjonalny).",
        "Wybierz do 20 klipów: MP4, MOV, AVI, MKV, M4V lub 3GP, każdy do 1 GB, łącznie do 1,5 GB.",
        "Kliknij „Wgraj i zacznij” i nie zamykaj strony do końca wgrywania. Jeden pakiet kosztuje 10 kredytów.",
        "Potem możesz zamknąć stronę. Status pokazuje kolejkę, analizę scen, plan montażu, renderowanie i okładki.",
        "Gdy pakiet jest gotowy, dostajesz e-mail z linkiem. Pobierz Short, długi film i cztery okładki w ciągu 7 dni.",
      ],
    },
    {
      title: "Montuj sam w NICS Studio",
      steps: [
        "Otwórz NICS Studio i dodaj filmy lub zdjęcia w zakładce „Media”. Gotowy film może mieć do 3 minut.",
        "Montuj na osi czasu: przycinanie, dzielenie, kolejność, tekst, muzyka, filtry, zoomy i przejścia. Ręczna edycja jest darmowa.",
        "Albo napisz do agenta po angielsku lub rosyjsku, na przykład: „cut the pauses, add captions 3 words at a time, a little bigger, and add zooms”. Jedna prośba kosztuje 1 kredyt.",
        "Napisy: otwórz „Napisy”, wybierz rosyjski lub angielski i kliknij „Utwórz napisy” (1 kredyt). Sprawdź i popraw tekst.",
        "Wybierz 9:16, 16:9 lub 1:1 i kliknij „Eksportuj” (2 kredyty), potem „Pobierz”. Projekty zapisują się same w tej przeglądarce.",
      ],
    },
    {
      title: "Kup plan",
      steps: [
        "Gdy kredyty się kończą, strona pokazuje, ile potrzeba i ile zostało.",
        "W sekcji „Cennik” wybierz Start, Creator lub Pro i kliknij „Przejdź do płatności”. Użyj tego samego e-maila, którym się logujesz.",
        "Zapłać kartą na bezpiecznej stronie Revolut, która otworzy się w nowej karcie. Płatność w euro.",
        "Kilka minut po płatności kredyty włączą się same na 30 dni. Wróć do wgrywania lub NICS Studio.",
      ],
    },
  ],
  faqHeading: "Częste pytania",
  faq: [
    {
      q: "Jak działa NICS Video?",
      a: "Wgraj klipy, a system wybierze najlepsze ujęcia i zmontuje dla Ciebie Short, długi film i okładki. Jeśli wolisz montować sam, otwórz NICS Studio, powiedz agentowi, co zmienić, dopracuj oś czasu i wyeksportuj film.",
    },
    {
      q: "Jakich filmów mogę użyć?",
      a: "Do automatycznego montażu: MP4, MOV, AVI, MKV, M4V lub 3GP, do 20 plików, każdy do 1 GB, łącznie do 1,5 GB. NICS Studio przyjmuje filmy MP4 lub MOV i zdjęcia JPG lub PNG, na gotowy film do 3 minut.",
    },
    {
      q: "Czy mogę edytować swoje filmy?",
      a: "Tak, w NICS Studio: przycinanie i kolejność klipów, napisy, tekst, muzyka, filtry, zoomy i przejścia, format 9:16, 16:9 lub 1:1. Ręczna edycja nic nie kosztuje; kredyty są tylko na agenta, napisy i eksport.",
    },
    {
      q: "Jakie języki są obsługiwane?",
      a: "Okładki są po rosyjsku i angielsku. Napisy i polecenia dla agenta działają po rosyjsku i angielsku. Strona i edytor są dostępne w 12 językach, kolejne języki są w drodze.",
    },
    {
      q: "Jak działają kredyty?",
      a: "Jedno saldo na oba serwisy: pakiet automatyczny to 10 kredytów, eksport w NICS Studio 2, prośba do agenta 1, napisy 1. Kredyty są pobierane dopiero po udanej operacji i są ważne 30 dni.",
    },
    {
      q: "Czy mogę anulować plan?",
      a: "Nie ma czego anulować: każda płatność to jednorazowy zakup kredytów na 30 dni, bez automatycznego odnawiania i bez powtarzających się obciążeń. Aby kontynuować, kup plan ponownie.",
    },
    {
      q: "Ile kosztuje NICS Video?",
      a: "Zaczynasz za darmo z 10 kredytami, jednorazowo. Potem Start 14,99 EUR (60 kredytów), Creator 34,99 EUR (250) lub Pro 69,99 EUR (700), każdy na 30 dni. Płatność kartą przez Revolut.",
    },
    {
      q: "Czym jest kredyt?",
      a: "Kredytem płacisz za przetwarzanie: automatyczny montaż, rozpoznawanie mowy do napisów, prośby do agenta i renderowanie gotowego filmu. W planie Start jeden kredyt kosztuje około 25 centów.",
    },
    {
      q: "Gdzie są przechowywane moje pliki?",
      a: "Automatyczny montaż działa na naszym własnym sprzęcie, nigdy w zewnętrznych chmurach; gotowe pliki są przechowywane 7 dni. NICS Studio działa na Twoim urządzeniu i nigdzie nie wysyła plików.",
    },
    {
      q: "Kod logowania nie dotarł",
      a: "Sprawdź spam i kliknij „Wyślij ponownie”. Na jeden e-mail można wysłać najwyżej 5 kodów na godzinę. Nadal nic? Napisz na info@aibyteconsult.com.",
    },
  ],
};

export default pl;
