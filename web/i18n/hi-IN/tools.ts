const translation = {
  title: 'उपकरण',
  createCustomTool: 'कस्टम उपकरण बनाएं',
  customToolTip: 'Dify कस्टम उपकरणों के बारे में और जानें',
  type: {
    all: 'सभी',
    builtIn: 'निर्मित',
    custom: 'कस्टम',
    workflow: 'कार्यप्रवाह',
  },
  contribute: {
    line1: 'मैं रुचि रखता हूं ',
    line2: 'Dify में उपकरण दान करने में।',
    viewGuide: 'गाइड देखें',
  },
  author: 'द्वारा',
  auth: {
    unauthorized: 'अधिकृत करने के लिए',
    authorized: 'अधिकृत',
    setup: 'उपयोग करने के लिए अधिकृति सेटअप करें',
    setupModalTitle: 'अधिकृति सेटअप करें',
    setupModalTitleDescription:
      'प्रमाणिकरण कॉन्फ़िगर करने के बाद, कार्यस्थान के सभी सदस्य इस उपकरण का उपयोग कर सकेंगे।',
  },
  includeToolNum: '{{num}} उपकरण शामिल हैं',
  addTool: 'उपकरण जोड़ें',
  addToolModal: {
    type: 'प्रकार',
    category: 'श्रेणी',
    add: 'जोड़ें',
    added: 'जोड़ा गया',
    manageInTools: 'उपकरणों में प्रबंधित करें',
    emptyTitle: 'कोई कार्यप्रवाह उपकरण उपलब्ध नहीं',
    emptyTip: 'कार्यप्रवाह -> उपकरण के रूप में प्रकाशित पर जाएं',
    emptyTipCustom: 'एक कस्टम टूल बनाएं',
    emptyTitleCustom: 'कोई कस्टम टूल उपलब्ध नहीं है',
  },
  createTool: {
    title: 'कस्टम उपकरण बनाएं',
    editAction: 'कॉन्फ़िगर करें',
    editTitle: 'कस्टम उपकरण संपादित करें',
    name: 'नाम',
    toolNamePlaceHolder: 'उपकरण का नाम दर्ज करें',
    nameForToolCall: 'उपकरण कॉल नाम',
    nameForToolCallPlaceHolder:
      'मशीन पहचान के लिए उपयोग, जैसे कि getCurrentWeather, list_pets',
    nameForToolCallTip: 'केवल संख्या, अक्षर, और अंडरस्कोर का समर्थन करता है।',
    description: 'विवरण',
    descriptionPlaceholder:
      'विशिष्ट स्थान के लिए तापमान प्राप्त करने का उद्देश्य, उदाहरण के लिए।',
    schema: 'स्कीमा',
    schemaPlaceHolder: 'यहाँ अपना OpenAPI स्कीमा दर्ज करें',
    viewSchemaSpec: 'OpenAPI-Swagger विनिर्देश देखें',
    importFromUrl: 'URL से आयात करें',
    importFromUrlPlaceHolder: 'https://...',
    urlError: 'कृपया एक मान्य URL दर्ज करें',
    examples: 'उदाहरण',
    exampleOptions: {
      json: 'मौसम(JSON)',
      yaml: 'पेट स्टोर(YAML)',
      blankTemplate: 'खाली टेम्पलेट',
    },
    availableTools: {
      title: 'उपलब्ध उपकरण',
      name: 'नाम',
      description: 'विवरण',
      method: 'विधि',
      path: 'पथ',
      action: 'क्रियाएं',
      test: 'परीक्षण',
    },
    authMethod: {
      title: 'अधिकृति विधि',
      type: 'अधिकृति प्रकार',
      keyTooltip:
        'Http हैडर कुंजी, यदि आपको कुछ पता नहीं है तो "Authorization" के साथ छोड़ सकते हैं या इसे कस्टम मूल्य पर सेट कर सकते हैं',
      types: {
        none: 'कोई नहीं',
        api_key: 'API कुंजी',
        apiKeyPlaceholder: 'API कुंजी के लिए HTTP हैडर नाम',
        apiValuePlaceholder: 'API कुंजी दर्ज करें',
      },
      key: 'कुंजी',
      value: 'मूल्य',
    },
    authHeaderPrefix: {
      title: 'अधिकृति प्रकार',
      types: {
        basic: 'बेसिक',
        bearer: 'बियरर',
        custom: 'कस्टम',
      },
    },
    privacyPolicy: 'गोपनीयता नीति',
    privacyPolicyPlaceholder: 'कृपया गोपनीयता नीति दर्ज करें',
    toolInput: {
      title: 'उपकरण इनपुट',
      name: 'नाम',
      required: 'आवश्यक',
      method: 'विधि',
      methodSetting: 'सेटिंग',
      methodSettingTip: 'उपयोगकर्ता उपकरण कॉन्फ़िगरेशन भरता है',
      methodParameter: 'पैरामीटर',
      methodParameterTip: 'LLM प्रतिपादन के दौरान भरता है',
      label: 'टैग',
      labelPlaceholder: 'टैग चुनें(वैकल्पिक)',
      description: 'पैरामीटर के अर्थ का विवरण',
      descriptionPlaceholder: 'पैरामीटर के अर्थ का विवरण',
    },
    customDisclaimer: 'कस्टम अस्वीकरण',
    customDisclaimerPlaceholder: 'कस्टम अस्वीकरण दर्ज करें',
    confirmTitle: 'सहेजने की पुष्टि करें ?',
    confirmTip: 'इस उपकरण का उपयोग करने वाले ऐप्स प्रभावित होंगे',
    deleteToolConfirmTitle: 'इस उपकरण को हटाएं?',
    deleteToolConfirmContent: 'इस उपकरण को हटाने से वापस नहीं आ सकता है। उपयोगकर्ता अब तक आपके उपकरण पर अन्तराल नहीं कर सकेंगे।',
  },
  test: {
    title: 'परीक्षण',
    parametersValue: 'पैरामीटर और मूल्य',
    parameters: 'पैरामीटर',
    value: 'मूल्य',
    testResult: 'परीक्षण परिणाम',
    testResultPlaceholder: 'परीक्षण परिणाम यहाँ दिखाई देगा',
  },
  thought: {
    using: 'का उपयोग करते हुए',
    used: 'इस्तेमाल किया हुआ',
    requestTitle: 'अनुरोध करने के लिए',
    responseTitle: 'प्रतिक्रिया से',
  },
  setBuiltInTools: {
    info: 'जानकारी',
    setting: 'सेटिंग',
    toolDescription: 'उपकरण विवरण',
    parameters: 'पैरामीटर्स',
    string: 'स्ट्रिंग',
    number: 'नंबर',
    required: 'आवश्यक',
    infoAndSetting: 'जानकारी और सेटिंग्स',
    file: 'फाइल',
  },
  noCustomTool: {
    title: 'कोई कस्टम उपकरण नहीं!',
    content:
      'एआई ऐप्स बनाने के लिए यहां अपने कस्टम उपकरण जोड़ें और प्रबंधित करें।',
    createTool: 'उपकरण बनाएं',
  },
  noSearchRes: {
    title: 'क्षमा करें, कोई परिणाम नहीं!',
    content: 'हम आपकी खोज से मेल खाने वाले कोई उपकरण नहीं ढूंढ पाए।',
    reset: 'खोज रीसेट करें',
  },
  builtInPromptTitle: 'प्रॉम्प्ट',
  toolRemoved: 'उपकरण हटाया गया',
  notAuthorized: 'उपकरण अधिकृत नहीं',
  howToGet: 'कैसे प्राप्त करें',
  openInStudio: 'स्टूडियो में खोलें',
  toolNameUsageTip: 'एजेंट तर्क और प्रेरण के लिए उपकरण कॉल नाम',
  noTools: 'कोई उपकरण नहीं मिला',
  copyToolName: 'नाम कॉपी करें',
}

export default translation
