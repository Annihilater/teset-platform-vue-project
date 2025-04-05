const translation = {
  createApp: 'UTWÓRZ APLIKACJĘ',
  types: {
    all: 'Wszystkie',
    chatbot: 'Chatbot',
    agent: 'Agent',
    workflow: 'Przepływ pracy',
    completion: 'Zakończenie',
    advanced: 'Przepływ czatu',
    basic: 'Podstawowy',
  },
  duplicate: 'Duplikuj',
  duplicateTitle: 'Duplikuj aplikację',
  export: 'Eksportuj DSL',
  exportFailed: 'Eksport DSL nie powiódł się.',
  importDSL: 'Importuj plik DSL',
  createFromConfigFile: 'Utwórz z pliku DSL',
  deleteAppConfirmTitle: 'Usunąć tę aplikację?',
  deleteAppConfirmContent:
    'Usunięcie aplikacji jest nieodwracalne. Użytkownicy nie będą mieli już dostępu do twojej aplikacji, a wszystkie konfiguracje monitów i dzienniki zostaną trwale usunięte.',
  appDeleted: 'Aplikacja usunięta',
  appDeleteFailed: 'Nie udało się usunąć aplikacji',
  join: 'Dołącz do społeczności',
  communityIntro:
    'Dyskutuj z członkami zespołu, współtwórcami i deweloperami na różnych kanałach.',
  roadmap: 'Zobacz naszą mapę drogową',
  newApp: {
    startFromBlank: 'Utwórz od podstaw',
    startFromTemplate: 'Utwórz z szablonu',
    captionAppType: 'Jaki typ aplikacji chcesz stworzyć?',
    chatbotDescription:
      'Zbuduj aplikację opartą na czacie. Ta aplikacja używa formatu pytań i odpowiedzi, umożliwiając wielokrotne rundy ciągłej konwersacji.',
    completionDescription:
      'Zbuduj aplikację generującą teksty wysokiej jakości na podstawie monitów, takich jak generowanie artykułów, streszczeń, tłumaczeń i innych.',
    completionWarning: 'Ten typ aplikacji nie będzie już obsługiwany.',
    agentDescription:
      'Zbuduj inteligentnego agenta, który może autonomicznie wybierać narzędzia do wykonywania zadań',
    workflowDescription:
      'Zbuduj aplikację, która w oparciu o przepływ pracy generuje teksty wysokiej jakości z dużą możliwością dostosowania. Jest odpowiednia dla doświadczonych użytkowników.',
    workflowWarning: 'Obecnie w fazie beta',
    chatbotType: 'Metoda orkiestracji chatbota',
    basic: 'Podstawowy',
    basicTip: 'Dla początkujących, można przełączyć się później na Chatflow',
    basicFor: 'Dla początkujących',
    basicDescription:
      'Podstawowa orkiestracja pozwala na skonfigurowanie aplikacji Chatbot za pomocą prostych ustawień, bez możliwości modyfikacji wbudowanych monitów. Jest odpowiednia dla początkujących.',
    advanced: 'Chatflow',
    advancedFor: 'Dla zaawansowanych użytkowników',
    advancedDescription:
      'Orkiestracja przepływu pracy organizuje Chatboty w formie przepływów pracy, oferując wysoki stopień dostosowania, w tym możliwość edycji wbudowanych monitów. Jest odpowiednia dla doświadczonych użytkowników.',
    captionName: 'Ikona i nazwa aplikacji',
    appNamePlaceholder: 'Podaj nazwę swojej aplikacji',
    captionDescription: 'Opis',
    appDescriptionPlaceholder: 'Wprowadź opis aplikacji',
    useTemplate: 'Użyj tego szablonu',
    previewDemo: 'Podgląd demo',
    chatApp: 'Asystent',
    chatAppIntro:
      'Chcę zbudować aplikację opartą na czacie. Ta aplikacja używa formatu pytań i odpowiedzi, umożliwiając wielokrotne rundy ciągłej konwersacji.',
    agentAssistant: 'Nowy asystent agenta',
    completeApp: 'Generator tekstu',
    completeAppIntro:
      'Chcę stworzyć aplikację, która generuje teksty wysokiej jakości na podstawie monitów, takich jak generowanie artykułów, streszczeń, tłumaczeń i innych.',
    showTemplates: 'Chcę wybrać z szablonu',
    hideTemplates: 'Wróć do wyboru trybu',
    Create: 'Utwórz',
    Cancel: 'Anuluj',
    nameNotEmpty: 'Nazwa nie może być pusta',
    appTemplateNotSelected: 'Proszę wybrać szablon',
    appTypeRequired: 'Proszę wybrać typ aplikacji',
    appCreated: 'Aplikacja utworzona',
    appCreateFailed: 'Nie udało się utworzyć aplikacji',
    appCreateDSLErrorPart3: 'Aktualna wersja aplikacji DSL:',
    appCreateDSLErrorPart2: 'Czy chcesz kontynuować?',
    Confirm: 'Potwierdzić',
    caution: 'Ostrożność',
    appCreateDSLWarning: 'Przestroga: Różnica w wersji DSL może mieć wpływ na niektóre funkcje',
    appCreateDSLErrorTitle: 'Niezgodność wersji',
    appCreateDSLErrorPart4: 'Wersja DSL obsługiwana przez system:',
    appCreateDSLErrorPart1: 'Wykryto istotną różnicę w wersjach DSL. Wymuszenie importu może spowodować nieprawidłowe działanie aplikacji.',
    noTemplateFoundTip: 'Spróbuj wyszukać za pomocą różnych słów kluczowych.',
    noAppsFound: 'Nie znaleziono aplikacji',
    foundResults: '{{liczba}} Wyniki',
    noTemplateFound: 'Nie znaleziono szablonów',
    chatbotUserDescription: 'Szybko zbuduj chatbota opartego na LLM z prostą konfiguracją. Możesz przełączyć się na Chatflow później.',
    optional: 'Fakultatywny',
    workflowUserDescription: 'Orkiestracja przepływu pracy dla zadań jednoetapowych, takich jak automatyzacja i przetwarzanie wsadowe.',
    completionUserDescription: 'Szybko zbuduj asystenta AI do zadań generowania tekstu za pomocą prostej konfiguracji.',
    forBeginners: 'DLA POCZĄTKUJĄCYCH',
    agentShortDescription: 'Inteligentny agent z rozumowaniem i autonomicznym wykorzystaniem narzędzi',
    completionShortDescription: 'Asystent AI do zadań generowania tekstu',
    noIdeaTip: 'Nie masz pomysłów? Sprawdź nasze szablony',
    forAdvanced: 'DLA ZAAWANSOWANYCH UŻYTKOWNIKÓW',
    foundResult: '{{liczba}} Wynik',
    advancedShortDescription: 'Przepływ pracy dla złożonych, wieloetapowych dialogów z pamięcią',
    learnMore: 'Dowiedz się więcej',
    chatbotShortDescription: 'Chatbot oparty na LLM z prostą konfiguracją',
    chooseAppType: 'Wybierz typ aplikacji',
    agentUserDescription: 'Inteligentny agent zdolny do iteracyjnego wnioskowania i autonomicznego wykorzystania narzędzi do osiągania celów zadań.',
    workflowShortDescription: 'Orkiestracja dla jednoetapowych zadań automatyzacji',
    advancedUserDescription: 'Orkiestracja przepływu pracy dla wielorundowych, złożonych zadań dialogowych z funkcjami pamięci.',
  },
  editApp: 'Edytuj informacje',
  editAppTitle: 'Edytuj informacje o aplikacji',
  editDone: 'Informacje o aplikacji zaktualizowane',
  editFailed: 'Nie udało się zaktualizować informacji o aplikacji',
  iconPicker: {
    ok: 'OK',
    cancel: 'Anuluj',
    emoji: 'Emoji',
    image: 'Obraz',
  },
  switch: 'Przełącz na Orkiestrację Przepływu Pracy',
  switchTipStart:
    'Dla ciebie zostanie utworzona nowa kopia aplikacji, a nowa kopia przełączy się na Orkiestrację Przepływu Pracy. Nowa kopia będzie ',
  switchTip: 'nie pozwoli',
  switchTipEnd: ' na powrót do Podstawowej Orkiestracji.',
  switchLabel: 'Kopia aplikacji do utworzenia',
  removeOriginal: 'Usuń oryginalną aplikację',
  switchStart: 'Rozpocznij przełączanie',
  typeSelector: {
    all: 'WSZYSTKIE Typy',
    chatbot: 'Chatbot',
    agent: 'Agent',
    workflow: 'Przepływ pracy',
    completion: 'Zakończenie',
    advanced: 'Przepływ czatu',
  },
  tracing: {
    title: 'Śledzenie wydajności aplikacji',
    description: 'Konfiguracja zewnętrznego dostawcy LLMOps i śledzenie wydajności aplikacji.',
    config: 'Konfiguruj',
    collapse: 'Zwiń',
    expand: 'Rozwiń',
    tracing: 'Śledzenie',
    disabled: 'Wyłączone',
    disabledTip: 'Najpierw skonfiguruj dostawcę',
    enabled: 'W użyciu',
    tracingDescription: 'Przechwytywanie pełnego kontekstu wykonania aplikacji, w tym wywołań LLM, kontekstu, promptów, żądań HTTP i więcej, do platformy śledzenia stron trzecich.',
    configProviderTitle: {
      configured: 'Skonfigurowano',
      notConfigured: 'Skonfiguruj dostawcę, aby włączyć śledzenie',
      moreProvider: 'Więcej dostawców',
    },
    langsmith: {
      title: 'LangSmith',
      description: 'Kompleksowa platforma deweloperska dla każdego etapu cyklu życia aplikacji opartej na LLM.',
    },
    langfuse: {
      title: 'Langfuse',
      description: 'Śledzenie, oceny, zarządzanie promptami i metryki do debugowania i ulepszania twojej aplikacji LLM.',
    },
    inUse: 'W użyciu',
    configProvider: {
      title: 'Konfiguruj ',
      placeholder: 'Wprowadź swój {{key}}',
      project: 'Projekt',
      publicKey: 'Klucz publiczny',
      secretKey: 'Klucz tajny',
      viewDocsLink: 'Zobacz dokumentację {{key}}',
      removeConfirmTitle: 'Usunąć konfigurację {{key}}?',
      removeConfirmContent: 'Obecna konfiguracja jest w użyciu, jej usunięcie wyłączy funkcję Śledzenia.',
    },
    view: 'Widok',
    opik: {
      description: 'Opik to platforma typu open source do oceny, testowania i monitorowania aplikacji LLM.',
      title: 'Opik',
    },
  },
  answerIcon: {
    description: 'Czy w aplikacji udostępnionej ma być używana ikona aplikacji internetowej do zamiany 🤖.',
    title: 'Użyj ikony WebApp, aby zastąpić 🤖',
    descriptionInExplore: 'Czy używać ikony aplikacji internetowej do zastępowania 🤖 w Eksploruj',
  },
  importFromDSL: 'Importowanie z DSL',
  importFromDSLUrl: 'Z adresu URL',
  importFromDSLFile: 'Z pliku DSL',
  importFromDSLUrlPlaceholder: 'Wklej tutaj link DSL',
  mermaid: {
    handDrawn: 'Ręcznie rysowane',
    classic: 'Klasyczny',
  },
  openInExplore: 'Otwieranie w obszarze Eksploruj',
  newAppFromTemplate: {
    sidebar: {
      Recommended: 'Zalecane',
      Assistant: 'Asystent',
      Writing: 'Pismo',
      Programming: 'Programowanie',
      Workflow: 'Przepływ pracy',
      Agent: 'Agent',
      HR: 'HR',
    },
    searchAllTemplate: 'Przeszukaj wszystkie szablony...',
    byCategories: 'WEDŁUG KATEGORII',
  },
  showMyCreatedAppsOnly: 'Pokaż tylko moje utworzone aplikacje',
  appSelector: {
    params: 'PARAMETRY APLIKACJI',
    noParams: 'Nie są potrzebne żadne parametry',
    placeholder: 'Wybierz aplikację...',
    label: 'Aplikacja',
  },
}

export default translation
