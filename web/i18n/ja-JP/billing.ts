const translation = {
  currentPlan: '現在のプラン',
  usagePage: {
    teamMembers: 'チームメンバー',
    buildApps: 'アプリを作成する',
    annotationQuota: 'アノテーション・クォータ',
    documentsUploadQuota: 'ドキュメント・アップロード・クォータ',
    vectorSpace: '知識データストレージ',
    vectorSpaceTooltip: '高品質インデックスモードのドキュメントは、知識データストレージのリソースを消費します。知識データストレージの上限に達すると、新しいドキュメントはアップロードされません。',
  },
  upgradeBtn: {
    plain: 'プランをアップグレード',
    encourage: '今すぐアップグレード',
    encourageShort: 'アップグレード',
  },
  viewBilling: '請求とサブスクリプションの管理',
  buyPermissionDeniedTip: 'サブスクリプションするには、エンタープライズ管理者に連絡してください',
  plansCommon: {
    title: 'あなたのAIの旅を支える価格設定',
    freeTrialTipPrefix: 'サインアップ後、',
    freeTrialTip: '200回のOpenAIコールの無料に受け取る',
    freeTrialTipSuffix: '。クレジットカード不要',
    yearlyTip: '10ヶ月分支払って、1年間楽しもう！',
    mostPopular: '人気',
    cloud: 'クラウドサービス',
    self: 'セルフホストサービス',
    planRange: {
      monthly: '月額',
      yearly: '年額',
    },
    month: '月',
    year: '年',
    save: '節約 ',
    free: '無料',
    annualBilling: '年次請求',
    comparePlanAndFeatures: 'プランと機能を比較する',
    priceTip: 'ワークスペース/',
    currentPlan: '現在のプラン',
    contractSales: '営業に連絡する',
    contractOwner: 'チームマネージャーに連絡する',
    startForFree: '無料で始める',
    getStarted: '始める',
    contactSales: '営業に連絡する',
    talkToSales: '営業と話す',
    modelProviders: 'OpenAI/Anthropic/Llama2/Azure OpenAI/Hugging Face/Replicateをサポート',
    teamWorkspace: '{{count,number}}チームワークスペース',
    teamMember_one: 'チームメンバー：{{count,number}}人',
    teamMember_other: 'チームメンバー：{{count,number}}人',
    annotationQuota: 'アノテーション・クォータ',
    buildApps: 'アプリの数：{{count,number}}個',
    documents: '{{count,number}}の知識文書',
    documentsTooltip: 'ナレッジデータソースからインポートされたドキュメントの数に対するクォータ。',
    vectorSpace: '{{size}}の知識データストレージ',
    vectorSpaceTooltip: '高品質インデックスモードのドキュメントは、知識データストレージのリソースを消費します。知識データストレージの上限に達すると、新しいドキュメントはアップロードされません。',
    documentsRequestQuota: '{{count,number}}/分のナレッジ リクエストのレート制限',
    documentsRequestQuotaTooltip: 'ナレッジベース内でワークスペースが1分間に実行できる操作の総数を示します。これには、データセットの作成、削除、更新、ドキュメントのアップロード、修正、アーカイブ、およびナレッジベースクエリが含まれます。この指標は、ナレッジベースリクエストのパフォーマンスを評価するために使用されます。例えば、Sandbox ユーザーが1分間に10回連続でヒットテストを実行した場合、そのワークスペースは次の1分間、データセットの作成、削除、更新、ドキュメントのアップロードや修正などの操作を一時的に実行できなくなります。',
    documentProcessingPriority: '文書処理',
    documentProcessingPriorityUpgrade: 'より高い精度と高速な速度でデータを処理します。',
    priority: {
      'standard': '標準',
      'priority': '優先',
      'top-priority': '最優先',
    },
    logsHistory: '{{days}}のログ履歴',
    customTools: 'カスタムツール',
    unavailable: '利用不可',
    days: '日間',
    unlimited: '無制限',
    support: 'サポート',
    supportItems: {
      communityForums: 'コミュニティフォーラム',
      emailSupport: 'メールサポート',
      priorityEmail: '優先メール＆チャットサポート',
      logoChange: 'ロゴ変更',
      SSOAuthentication: 'SSO認証',
      personalizedSupport: '個別サポート',
      dedicatedAPISupport: '専用APIサポート',
      customIntegration: 'カスタム統合とサポート',
      ragAPIRequest: 'RAG APIリクエスト',
      bulkUpload: 'ドキュメントの一括アップロード',
      agentMode: 'エージェントモード',
      workflow: 'ワークフロー',
      llmLoadingBalancing: 'LLMロードバランシング',
      llmLoadingBalancingTooltip: 'APIレート制限を効果的に回避するために、モデルに複数のAPIキーを追加する。',
    },
    comingSoon: '近日公開',
    member: 'メンバー',
    memberAfter: 'メンバー',
    messageRequest: {
      title: '{{count,number}}メッセージ',
      titlePerMonth: '{{count,number}}メッセージ/月',
      tooltip: 'Open Alモデルを使用するさまざまなプランのメッセージ呼び出しクォータ。上限を超えるメッセージは、Open AI APIキーを使用します。',
    },
    annotatedResponse: {
      title: '{{count,number}}の注釈クォータ制限',
      tooltip: '手動での回答の編集と注釈により、カスタマイズ可能な高品質の質問応答機能をアプリに提供します。（チャットアプリのみに適用）',
    },
    ragAPIRequestTooltip: 'Difyのナレッジベース処理機能のみを呼び出すAPI呼び出しの数を指します。',
    receiptInfo: 'チームオーナーとチーム管理者のみが購読および請求情報を表示できます',
  },
  plans: {
    sandbox: {
      name: 'Sandbox（サンドボックス）',
      for: '主要機能の無料体験',
      description: '主要機能を無料で体験',
    },
    professional: {
      name: 'Professional（プロフェッショナル）',
      for: '個人開発者/小規模チーム向け',
      description: '個人開発者・小規模チームに最適',
    },
    team: {
      name: 'Team（チーム）',
      for: '中規模チーム向け',
      description: '成長期のチームに必要な機能を備えたプラン',
    },
    community: {
      name: 'コミュニティ',
      for: '個人/小規模チーム・非営利プロジェクト向け',
      description: 'オープンソース版の無料プラン',
      price: '無料',
      btnText: 'コミュニティ版を始めましょう',
      includesTitle: '無料機能:',
      features: [
        'パブリックリポジトリの全コア機能',
        'シングルワークスペース',
        'Difyオープンソースライセンス準拠',
      ],
    },
    premium: {
      name: 'プレミアム',
      for: '中規模組織・チーム向け',
      description: 'クラウド対応の拡張版プラン',
      price: '従量制',
      priceTip: 'クラウドマーケットプレイス基準',
      btnText: 'プレミアム版を取得',
      includesTitle: 'コミュニティ版機能に加えて:',
      comingSoon: 'Microsoft Azure & Google Cloud 近日対応',
      features: [
        'クラウドプロバイダーによる自己管理',
        'シングルワークスペース',
        'Webアプリのロゴ＆ブランドカスタマイズ',
        '優先メール/チャットサポート',
      ],
    },
    enterprise: {
      name: 'エンタープライズ',
      for: '大規模チーム・企業向け',
      description: '企業レベルのセキュリティとカスタマイズを実現',
      price: 'カスタム',
      priceTip: '年間契約専用',
      btnText: '営業に相談',
      includesTitle: 'プレミアム版機能に加えて:',
      features: [
        'エンタープライズ向け拡張ソリューション',
        '商用ライセンス認可',
        '企業専用機能',
        'マルチワークスペース管理',
        'シングルサインオン（SSO）',
        'DifyパートナーによるSLA保証',
        '高度なセキュリティ管理',
        '公式メンテナンス＆アップデート',
        'プロフェッショナル技術支援',
      ],
    },
  },
  vectorSpace: {
    fullTip: '知識データストレージがいっぱいです。',
    fullSolution: 'より多くのスペースを得るためにプランをアップグレードしてください。',
  },
  apps: {
    fullTipLine1: 'より多くのアプリを作成するには、',
    fullTipLine2: 'プランをアップグレードしてください。',
  },
  annotatedResponse: {
    fullTipLine1: 'より多くの会話を注釈するには、',
    fullTipLine2: 'プランをアップグレードしてください。',
    quotaTitle: '注釈返信クォータ',
  },
}

export default translation
