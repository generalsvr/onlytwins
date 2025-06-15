// Define all supported languages
export const supportedLanguages = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский' },
  { id: 'zh', name: 'Chinese', nativeName: '中文' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語' },
  { id: 'ko', name: 'Korean', nativeName: '한국어' },
];

// Define translation keys and their values for each language
export const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.settings': 'Settings',
    'nav.gifts': 'Gifts',
    'nav.home': 'Home',
    'nav.affiliate': 'Affiliate',
    'nav.earn': 'Earn',

    // Common
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.finish': 'Finish',
    'common.upgrade': 'Upgrade',
    'common.recharge': 'Recharge',
    'common.unlock': 'Unlock',
    'common.chatNow': 'Chat Now',
    'common.invite': 'Invite',
    'common.open': 'Open',
    'common.start': 'Start',
    'common.payNow': 'Pay Now',
    'common.getStarted': 'Get Started',
    'common.createCharacter': 'Create Character',
    'common.copied': 'Copied!',
    'common.voiceCall': 'Voice Call',
    'common.endCall': 'End Call',
    'common.connecting': 'Connecting...',
    'common.callActive': 'Call in progress',
    'common.doubleClick': 'double-click',
    'common.doubleClickToCall': 'Double-click to start voice call',
    'common.microphoneRequired':
      'Microphone access is required for voice calls',
    'common.microphoneAccessDenied': 'Microphone access denied',
    'common.enableMicrophoneInstructions':
      'Please enable microphone access in your browser settings to use voice calls',
    'common.callInitError':
      'Failed to initialize voice call. Please try again.',
    'common.voiceCallWith': 'Voice Call with',
    'common.close': 'Close',
    'common.speakToInteract':
      'Speak to interact with the character. The AI will respond with voice.',

    // Settings
    'settings.title': 'Settings',
    'settings.yourPlan': 'Your Plan',
    'settings.free': 'Free',
    'settings.language': 'Language',

    // Models
    'models.title': 'Models',
    'models.createYourOwn': 'Create Your Own',
    'models.createDesc':
      'Design your perfect companion with custom looks and personality',

    // Character Creation
    'character.create.title': 'Create Your Character',
    'character.create.designCompanion': 'Design Your Perfect Companion',
    'character.create.customCharacters':
      'Create custom characters with tailored appearances and personalities that match your preferences.',
    'character.create.step1':
      'Choose physical attributes like ethnicity, hair, and body type',
    'character.create.step2':
      'Select personality traits, occupation, and interests',
    'character.create.step3':
      'Get a unique AI-generated companion tailored just for you',
    'character.create.appearance': 'Appearance',
    'character.create.personality': 'Personality',
    'character.create.selectStyle': 'Select Style',
    'character.create.realistic': 'Realistic',
    'character.create.anime': 'Anime',
    'character.create.realisticDesc': 'Photorealistic appearance',
    'character.create.animeDesc': 'Stylized anime look',
    'character.create.selectEthnicity': 'Select Ethnicity',
    'character.create.selectAge': 'Select Age',
    'character.create.yearsOld': 'Years Old',
    'character.create.selectEyeColor': 'Select Eye Color',
    'character.create.selectHairType': 'Select Hair Type',
    'character.create.selectHairColor': 'Select Hair Color',
    'character.create.selectVoice': 'Select Voice',
    'character.create.selectBodyType': 'Select Body Type',
    'character.create.selectBreastSize': 'Select Breast Size',
    'character.create.selectButtSize': 'Select Butt Size',
    'character.create.nextPersonality': 'Next: Personality',
    'character.create.selectPersonalityType': 'Select Personality Type',
    'character.create.selectOccupation': 'Select Occupation',
    'character.create.selectHobbies': 'Select Hobbies',
    'character.create.chooseUpTo3': 'Choose up to 3',
    'character.create.selectRelationshipType': 'Select Relationship Type',
    'character.create.characterSummary': 'Character Summary',
    'character.create.yourCharacter': 'Your Character',
    'character.create.characterCreated': 'Character Created!',
    'character.create.readyToChat': 'Your custom companion is ready to chat',
    'character.create.startChatting': 'Start Chatting',
    'character.create.notSelected': 'Not selected',
    'character.create.style': 'Style:',
    'character.create.ethnicity': 'Ethnicity:',
    'character.create.age': 'Age:',
    'character.create.eyeColor': 'Eye Color:',
    'character.create.hair': 'Hair:',
    'character.create.bodyType': 'Body Type:',
    'character.create.personalityLabel': 'Personality:',
    'character.create.occupation': 'Occupation:',
    'character.create.hobbies': 'Hobbies:',
    'character.create.relationship': 'Relationship:',
    'character.create.flirty': 'Flirty',
    'character.create.flirtyDesc': 'Playful and seductive',
    'character.create.shy': 'Shy',
    'character.create.shyDesc': 'Reserved and innocent',
    'character.create.dominant': 'Dominant',
    'character.create.dominantDesc': 'Confident and assertive',
    'character.create.sweet': 'Sweet',
    'character.create.sweetDesc': 'Caring and affectionate',
    'character.create.intellectual': 'Intellectual',
    'character.create.intellectualDesc': 'Smart and thoughtful',
    'character.create.adventurous': 'Adventurous',
    'character.create.adventurousDesc': 'Daring and spontaneous',
    'character.create.casual': 'Casual',
    'character.create.casualDesc': 'Fun and no strings attached',
    'character.create.romantic': 'Romantic',
    'character.create.romanticDesc': 'Deep emotional connection',
    'character.create.friendship': 'Friendship',
    'character.create.friendshipDesc': 'Supportive and platonic',
    'character.create.mentor': 'Mentor',
    'character.create.mentorDesc': 'Guiding and teaching',

    // Character Detail
    'character.aboutMe': 'About me:',
    'character.interests': 'Interests:',
    'character.relationshipLevel': 'Relationship level:',
    'character.progressBar': 'Progress Bar:',

    // Gifts
    'gifts.title': 'Gifts',
    'gifts.flowers': 'Flowers',
    'gifts.necklace': 'Necklace',
    'gifts.designerPurse': 'Designer Purse',
    'gifts.rolexWatch': 'Rolex Watch',

    // Affiliate
    'affiliate.title': 'Affiliate',
    'affiliate.inviteFriends': 'Invite friends to earn Stars!',
    'affiliate.spreadLove':
      'Spread the love among friends, let them join OnlyTwins and earn % of their subscription (TG Stars).',
    'affiliate.percentage': 'Percentage',
    'affiliate.commission': 'Commission from each subs',

    // Share Invite
    'share.title': 'Share & Earn',
    'share.appName': 'OnlyTwins',
    'share.appDesc': 'AI Companion App',
    'share.inviteCode': 'Your Invite Code',
    'share.shareLink': 'Share Link',
    'share.earnCommission': 'Earn 50% commission',
    'share.forEachFriend': 'For each friend who subscribes using your code',

    // Earn
    'earn.title': 'Earn',
    'earn.weekly': 'Weekly',
    'earn.earnForChecking': 'Earn for checking socials',
    'earn.socials': 'Socials',
    'earn.followOT': 'Follow OT on',

    // Store
    'store.title': 'Store',
    'store.unlimitedEnergy': 'Unlimited Energy',
    'store.breakObstacles': 'Break down the obstacles.',
    'store.unlockVitality': 'Unlock boundless vitality!',

    // Plan
    'plan.title': 'Plan',
    'plan.year': '1 Year',
    'plan.month': '1 Month',
    'plan.threeMonths': '3 Months',
    'plan.infiniteEnergy': 'Infinite energy',
    'plan.tokens': '99 TwinTokens for shopping',
    'plan.advancedAI': 'Our most advanced AI engine',
    'plan.unlimitedPhoto': 'Unlimited photo generation',

    // Payment
    'payment.title': 'Payment Method',
    'payment.purchasing': 'Purchasing a sub for',
    'payment.telegramStars': 'Telegram Stars',
    'payment.payWithCard': 'Pay with Card',
    'payment.anonymous': 'All payments are anonymous and secure.',

    // Language
    'language.title': 'Language',
    'language.en': 'English',
    'language.ru': 'Russian',
    'language.zh': 'Chinese',
    'language.de': 'German',
    'language.ar': 'Arabic',
    'language.ja': 'Japanese',
    'language.ko': 'Korean',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
  ru: {
    // Navigation
    'nav.settings': 'Настройки',
    'nav.gifts': 'Подарки',
    'nav.home': 'Главная',
    'nav.affiliate': 'Партнёрка',
    'nav.earn': 'Заработать',

    // Common
    'common.back': 'Назад',
    'common.continue': 'Продолжить',
    'common.finish': 'Завершить',
    'common.upgrade': 'Улучшить',
    'common.recharge': 'Пополнить',
    'common.unlock': 'Разблокировать',
    'common.chatNow': 'Начать чат',
    'common.invite': 'Пригласить',
    'common.open': 'Открыть',
    'common.start': 'Начать',
    'common.payNow': 'Оплатить',
    'common.getStarted': 'Начать',
    'common.createCharacter': 'Создать персонажа',
    'common.copied': 'Скопировано!',
    'common.voiceCall': 'Голосовой вызов',
    'common.endCall': 'Завершить вызов',
    'common.connecting': 'Соединение...',
    'common.callActive': 'Разговор активен',
    'common.doubleClick': 'двойной клик',
    'common.doubleClickToCall': 'Двойной клик для голосового вызова',
    'common.microphoneRequired':
      'Для голосовых вызовов требуется доступ к микрофону',
    'common.microphoneAccessDenied': 'Доступ к микрофону запрещен',
    'common.enableMicrophoneInstructions':
      'Пожалуйста, разрешите доступ к микрофону в настройках браузера для использования голосовых вызовов',
    'common.callInitError':
      'Не удалось инициализировать голосовой вызов. Пожалуйста, попробуйте снова.',

    // Settings
    'settings.title': 'Настройки',
    'settings.yourPlan': 'Ваш план',
    'settings.free': 'Бесплатный',
    'settings.language': 'Язык',

    // Models
    'models.title': 'Модели',
    'models.createYourOwn': 'Создать свою',
    'models.createDesc':
      'Создайте идеального компаньона с индивидуальной внешностью и характером',

    // Character Creation
    'character.create.title': 'Создать персонажа',
    'character.create.designCompanion': 'Создайте идеального компаньона',
    'character.create.customCharacters':
      'Создавайте персонажей с индивидуальной внешностью и характером, соответствующими вашим предпочтениям.',
    'character.create.step1':
      'Выберите физические атрибуты, такие как этническая принадлежность, волосы и тип телосложения',
    'character.create.step2': 'Выберите черты характера, профессию и интересы',
    'character.create.step3':
      'Получите уникального ИИ-компаньона, созданного специально для вас',
    'character.create.appearance': 'Внешность',
    'character.create.personality': 'Личность',
    'character.create.selectStyle': 'Выберите стиль',
    'character.create.realistic': 'Реалистичный',
    'character.create.anime': 'Аниме',
    'character.create.realisticDesc': 'Фотореалистичный вид',
    'character.create.animeDesc': 'Стилизованный аниме-вид',
    'character.create.selectEthnicity': 'Выберите этническую принадлежность',
    'character.create.selectAge': 'Выберите возраст',
    'character.create.yearsOld': 'Лет',
    'character.create.selectEyeColor': 'Выберите цвет глаз',
    'character.create.selectHairType': 'Выберите тип волос',
    'character.create.selectHairColor': 'Выберите цвет волос',
    'character.create.selectVoice': 'Выберите голос',
    'character.create.selectBodyType': 'Выберите тип телосложения',
    'character.create.selectBreastSize': 'Выберите размер груди',
    'character.create.selectButtSize': 'Выберите размер ягодиц',
    'character.create.nextPersonality': 'Далее: Личность',
    'character.create.selectPersonalityType': 'Выберите тип личности',
    'character.create.selectOccupation': 'Выберите профессию',
    'character.create.selectHobbies': 'Выберите хобби',
    'character.create.chooseUpTo3': 'Выберите до 3',
    'character.create.selectRelationshipType': 'Выберите тип отношений',
    'character.create.characterSummary': 'Сводка персонажа',
    'character.create.yourCharacter': 'Ваш персонаж',
    'character.create.characterCreated': 'Персонаж создан!',
    'character.create.readyToChat': 'Ваш персонаж готов к общению',
    'character.create.startChatting': 'Начать общение',
    'character.create.notSelected': 'Не выбрано',
    'character.create.style': 'Стиль:',
    'character.create.ethnicity': 'Этническая принадлежность:',
    'character.create.age': 'Возраст:',
    'character.create.eyeColor': 'Цвет глаз:',
    'character.create.hair': 'Волосы:',
    'character.create.bodyType': 'Тип телосложения:',
    'character.create.personalityLabel': 'Личность:',
    'character.create.occupation': 'Профессия:',
    'character.create.hobbies': 'Хобби:',
    'character.create.relationship': 'Отношения:',
    'character.create.flirty': 'Кокетливый',
    'character.create.flirtyDesc': 'Игривый и соблазнительный',
    'character.create.shy': 'Застенчивый',
    'character.create.shyDesc': 'Сдержанный и невинный',
    'character.create.dominant': 'Доминирующий',
    'character.create.dominantDesc': 'Уверенный и напористый',
    'character.create.sweet': 'Милый',
    'character.create.sweetDesc': 'Заботливый и ласковый',
    'character.create.intellectual': 'Интеллектуальный',
    'character.create.intellectualDesc': 'Умный и вдумчивый',
    'character.create.adventurous': 'Авантюрный',
    'character.create.adventurousDesc': 'Смелый и спонтанный',
    'character.create.casual': 'Непринужденный',
    'character.create.casualDesc': 'Веселый и без обязательств',
    'character.create.romantic': 'Романтичный',
    'character.create.romanticDesc': 'Глубокая эмоциональная связь',
    'character.create.friendship': 'Дружба',
    'character.create.friendshipDesc': 'Поддерживающий и платонический',
    'character.create.mentor': 'Наставник',
    'character.create.mentorDesc': 'Направляющий и обучающий',

    // Character Detail
    'character.aboutMe': 'Обо мне:',
    'character.interests': 'Интересы:',
    'character.relationshipLevel': 'Уровень отношений:',
    'character.progressBar': 'Прогресс:',

    // Gifts
    'gifts.title': 'Подарки',
    'gifts.flowers': 'Цветы',
    'gifts.necklace': 'Ожерелье',
    'gifts.designerPurse': 'Дизайнерская сумка',
    'gifts.rolexWatch': 'Часы Rolex',

    // Affiliate
    'affiliate.title': 'Партнёрка',
    'affiliate.inviteFriends': 'Приглашайте друзей и зарабатывайте звёзды!',
    'affiliate.spreadLove':
      'Расскажите друзьям об OnlyTwins и получайте % от их подписки (звёзды TG).',
    'affiliate.percentage': 'Процент',
    'affiliate.commission': 'Комиссия с каждой подписки',

    // Share Invite
    'share.title': 'Поделиться и заработать',
    'share.appName': 'OnlyTwins',
    'share.appDesc': 'Приложение ИИ-компаньон',
    'share.inviteCode': 'Ваш код приглашения',
    'share.shareLink': 'Ссылка для приглашения',
    'share.earnCommission': 'Получайте 50% комиссии',
    'share.forEachFriend':
      'За каждого друга, который подписывается по вашему коду',

    // Earn
    'earn.title': 'Заработать',
    'earn.weekly': 'Еженедельно',
    'earn.earnForChecking': 'Зарабатывайте за проверку соцсетей',
    'earn.socials': 'Соцсети',
    'earn.followOT': 'Подписаться на OT в',

    // Store
    'store.title': 'Магазин',
    'store.unlimitedEnergy': 'Безлимитная энергия',
    'store.breakObstacles': 'Преодолейте препятствия.',
    'store.unlockVitality': 'Разблокируйте безграничную жизненную силу!',

    // Plan
    'plan.title': 'План',
    'plan.year': '1 Год',
    'plan.month': '1 Месяц',
    'plan.threeMonths': '3 Месяца',
    'plan.infiniteEnergy': 'Бесконечная энергия',
    'plan.tokens': '99 TwinTokens для покупок',
    'plan.advancedAI': 'Наш самый продвинутый ИИ-движок',
    'plan.unlimitedPhoto': 'Безлимитная генерация фото',

    // Payment
    'payment.title': 'Способ оплаты',
    'payment.purchasing': 'Покупка подписки на',
    'payment.telegramStars': 'Звёзды Telegram',
    'payment.payWithCard': 'Оплата картой',
    'payment.anonymous': 'Все платежи анонимны и безопасны.',

    // Language
    'language.title': 'Язык',
    'language.en': 'Английский',
    'language.ru': 'Русский',
    'language.zh': 'Китайский',
    'language.de': 'Немецкий',
    'language.ar': 'Арабский',
    'language.ja': 'Японский',
    'language.ko': 'Корейский',

    // Status Bar
    'statusBar.tokens': 'ТТ',
    'statusBar.energy': '100/100',
  },
  zh: {
    // Navigation
    'nav.settings': '设置',
    'nav.gifts': '礼物',
    'nav.home': '首页',
    'nav.affiliate': '联盟',
    'nav.earn': '赚取',

    // Common
    'common.back': '返回',
    'common.continue': '继续',
    'common.finish': '完成',
    'common.upgrade': '升级',
    'common.recharge': '充值',
    'common.unlock': '解锁',
    'common.chatNow': '立即聊天',
    'common.invite': '邀请',
    'common.open': '打开',
    'common.start': '开始',
    'common.payNow': '立即支付',
    'common.getStarted': '开始使用',
    'common.createCharacter': '创建角色',
    'common.copied': '已复制！',
    'common.voiceCall': '语音通话',
    'common.endCall': '结束通话',
    'common.connecting': '连接中...',
    'common.callActive': '通话进行中',
    'common.doubleClick': '双击',
    'common.doubleClickToCall': '双击开始语音通话',
    'common.microphoneRequired': '语音通话需要麦克风访问权限',
    'common.microphoneAccessDenied': '麦克风访问被拒绝',
    'common.enableMicrophoneInstructions':
      '请在浏览器设置中启用麦克风访问权限以使用语音通话',
    'common.callInitError': '初始化语音通话失败。请重试。',

    // Settings
    'settings.title': '设置',
    'settings.yourPlan': '您的计划',
    'settings.free': '免费',
    'settings.language': '语言',

    // Models
    'models.title': '模特',
    'models.createYourOwn': '创建自己的',
    'models.createDesc': '设计您的完美伴侣，定制外观和个性',

    // Character Creation
    'character.create.title': '创建您的角色',
    'character.create.designCompanion': '设计您的完美伴侣',
    'character.create.customCharacters':
      '创建定制角色，根据您的喜好量身定制外观和个性。',
    'character.create.step1': '选择身体特征，如种族、发型和体型',
    'character.create.step2': '选择性格特点、职业和兴趣',
    'character.create.step3': '获得专为您定制的独特AI伴侣',
    'character.create.appearance': '外观',
    'character.create.personality': '个性',
    'character.create.selectStyle': '选择风格',
    'character.create.realistic': '写实',
    'character.create.anime': '动漫',
    'character.create.realisticDesc': '照片级真实外观',
    'character.create.animeDesc': '风格化动漫外观',
    'character.create.selectEthnicity': '选择种族',
    'character.create.selectAge': '选择年龄',
    'character.create.yearsOld': '岁',
    'character.create.selectEyeColor': '选择眼睛颜色',
    'character.create.selectHairType': '选择发型',
    'character.create.selectHairColor': '选择发色',
    'character.create.selectVoice': '选择声音',
    'character.create.selectBodyType': '选择体型',
    'character.create.selectBreastSize': '选择胸部大小',
    'character.create.selectButtSize': '选择臀部大小',
    'character.create.nextPersonality': '下一步：个性',
    'character.create.selectPersonalityType': '选择性格类型',
    'character.create.selectOccupation': '选择职业',
    'character.create.selectHobbies': '选择爱好',
    'character.create.chooseUpTo3': '最多选择3个',
    'character.create.selectRelationshipType': '选择关系类型',
    'character.create.characterSummary': '角色摘要',
    'character.create.yourCharacter': '您的角色',
    'character.create.characterCreated': '角色已创建！',
    'character.create.readyToChat': '您的定制伴侣已准备好聊天',
    'character.create.startChatting': '开始聊天',
    'character.create.notSelected': '未选择',
    'character.create.style': '风格：',
    'character.create.ethnicity': '种族：',
    'character.create.age': '年龄：',
    'character.create.eyeColor': '眼睛颜色：',
    'character.create.hair': '头发：',
    'character.create.bodyType': '体型：',
    'character.create.personalityLabel': '性格：',
    'character.create.occupation': '职业：',
    'character.create.hobbies': '爱好：',
    'character.create.relationship': '关系：',
    'character.create.flirty': '调情',
    'character.create.flirtyDesc': '俏皮和诱人',
    'character.create.shy': '害羞',
    'character.create.shyDesc': '含蓄和天真',
    'character.create.dominant': '强势',
    'character.create.dominantDesc': '自信和果断',
    'character.create.sweet': '甜美',
    'character.create.sweetDesc': '关怀和亲切',
    'character.create.intellectual': '知性',
    'character.create.intellectualDesc': '聪明和深思熟虑',
    'character.create.adventurous': '冒险',
    'character.create.adventurousDesc': '大胆和自发',
    'character.create.casual': '随意',
    'character.create.casualDesc': '有趣且无负担',
    'character.create.romantic': '浪漫',
    'character.create.romanticDesc': '深厚的情感联系',
    'character.create.friendship': '友谊',
    'character.create.friendshipDesc': '支持和柏拉图式',
    'character.create.mentor': '导师',
    'character.create.mentorDesc': '引导和教学',

    // Character Detail
    'character.aboutMe': '关于我：',
    'character.interests': '兴趣：',
    'character.relationshipLevel': '关系等级：',
    'character.progressBar': '进度条：',

    // Gifts
    'gifts.title': '礼物',
    'gifts.flowers': '鲜花',
    'gifts.necklace': '项链',
    'gifts.designerPurse': '设计师手袋',
    'gifts.rolexWatch': '劳力士手表',

    // Affiliate
    'affiliate.title': '联盟',
    'affiliate.inviteFriends': '邀请朋友赚取星星！',
    'affiliate.spreadLove':
      '在朋友中传播爱，让他们加入OnlyTwins，赚取他们订阅的百分比（TG星星）。',
    'affiliate.percentage': '百分比',
    'affiliate.commission': '每次订阅的佣金',

    // Share Invite
    'share.title': '分享并赚取',
    'share.appName': 'OnlyTwins',

    // Share Invite
    'share.title': '分享并赚取',
    'share.appName': 'OnlyTwins',
    'share.appDesc': 'AI伴侣应用',
    'share.inviteCode': '您的邀请码',
    'share.shareLink': '分享链接',
    'share.earnCommission': '赚取50%佣金',
    'share.forEachFriend': '每位使用您的邀请码订阅的朋友',

    // Earn
    'earn.title': '赚取',
    'earn.weekly': '每周',
    'earn.earnForChecking': '查看社交媒体赚取',
    'earn.socials': '社交媒体',
    'earn.followOT': '在以下平台关注OT',

    // Store
    'store.title': '商店',
    'store.unlimitedEnergy': '无限能量',
    'store.breakObstacles': '打破障碍。',
    'store.unlockVitality': '解锁无限活力！',

    // Plan
    'plan.title': '计划',
    'plan.year': '1年',
    'plan.month': '1个月',
    'plan.threeMonths': '3个月',
    'plan.infiniteEnergy': '无限能量',
    'plan.tokens': '99个TwinTokens用于购物',
    'plan.advancedAI': '我们最先进的AI引擎',
    'plan.unlimitedPhoto': '无限照片生成',

    // Payment
    'payment.title': '支付方式',
    'payment.purchasing': '购买订阅',
    'payment.telegramStars': 'Telegram星星',
    'payment.payWithCard': '用卡支付',
    'payment.anonymous': '所有支付都是匿名和安全的。',

    // Language
    'language.title': '语言',
    'language.en': '英语',
    'language.ru': '俄语',
    'language.zh': '中文',
    'language.de': '德语',
    'language.ar': '阿拉伯语',
    'language.ja': '日语',
    'language.ko': '韩语',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
  de: {
    // Navigation
    'nav.settings': 'Einstellungen',
    'nav.gifts': 'Geschenke',
    'nav.home': 'Startseite',
    'nav.affiliate': 'Partner',
    'nav.earn': 'Verdienen',

    // Common
    'common.back': 'Zurück',
    'common.continue': 'Weiter',
    'common.finish': 'Fertig',
    'common.upgrade': 'Upgrade',
    'common.recharge': 'Aufladen',
    'common.unlock': 'Freischalten',
    'common.chatNow': 'Jetzt chatten',
    'common.invite': 'Einladen',
    'common.open': 'Öffnen',
    'common.start': 'Starten',
    'common.payNow': 'Jetzt bezahlen',
    'common.getStarted': 'Loslegen',
    'common.createCharacter': 'Charakter erstellen',
    'common.copied': 'Kopiert!',
    'common.voiceCall': 'Sprachanruf',
    'common.endCall': 'Anruf beenden',
    'common.connecting': 'Verbinde...',
    'common.callActive': 'Anruf aktiv',
    'common.doubleClick': 'Doppelklick',
    'common.doubleClickToCall': 'Doppelklick für Sprachanruf',
    'common.microphoneRequired':
      'Für Sprachanrufe wird Mikrofonzugriff benötigt',
    'common.microphoneAccessDenied': 'Mikrofonzugriff verweigert',
    'common.enableMicrophoneInstructions':
      'Bitte aktiviere den Mikrofonzugriff in deinen Browsereinstellungen, um Sprachanrufe zu nutzen',
    'common.callInitError':
      'Sprachanruf konnte nicht initialisiert werden. Bitte versuche es erneut.',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.yourPlan': 'Dein Plan',
    'settings.free': 'Kostenlos',
    'settings.language': 'Sprache',

    // Models
    'models.title': 'Modelle',
    'models.createYourOwn': 'Eigenes erstellen',
    'models.createDesc':
      'Gestalte deinen perfekten Begleiter mit individuellem Aussehen und Persönlichkeit',

    // Character Creation
    'character.create.title': 'Erstelle deinen Charakter',
    'character.create.designCompanion': 'Gestalte deinen perfekten Begleiter',
    'character.create.customCharacters':
      'Erstelle maßgeschneiderte Charaktere mit Aussehen und Persönlichkeit nach deinen Vorlieben.',
    'character.create.step1':
      'Wähle körperliche Attribute wie Ethnizität, Haare und Körpertyp',
    'character.create.step2':
      'Wähle Persönlichkeitsmerkmale, Beruf und Interessen',
    'character.create.step3':
      'Erhalte einen einzigartigen KI-Begleiter, der genau auf dich zugeschnitten ist',
    'character.create.appearance': 'Aussehen',
    'character.create.personality': 'Persönlichkeit',
    'character.create.selectStyle': 'Stil auswählen',
    'character.create.realistic': 'Realistisch',
    'character.create.anime': 'Anime',
    'character.create.realisticDesc': 'Fotorealistisches Aussehen',
    'character.create.animeDesc': 'Stilisierter Anime-Look',
    'character.create.selectEthnicity': 'Ethnizität auswählen',
    'character.create.selectAge': 'Alter auswählen',
    'character.create.yearsOld': 'Jahre alt',
    'character.create.selectEyeColor': 'Augenfarbe auswählen',
    'character.create.selectHairType': 'Haartyp auswählen',
    'character.create.selectHairColor': 'Haarfarbe auswählen',
    'character.create.selectVoice': 'Stimme auswählen',
    'character.create.selectBodyType': 'Körpertyp auswählen',
    'character.create.selectBreastSize': 'Brustgröße auswählen',
    'character.create.selectButtSize': 'Popo-Größe auswählen',
    'character.create.nextPersonality': 'Weiter: Persönlichkeit',
    'character.create.selectPersonalityType': 'Persönlichkeitstyp auswählen',
    'character.create.selectOccupation': 'Beruf auswählen',
    'character.create.selectHobbies': 'Hobbys auswählen',
    'character.create.chooseUpTo3': 'Wähle bis zu 3',
    'character.create.selectRelationshipType': 'Beziehungstyp auswählen',
    'character.create.characterSummary': 'Charakter-Zusammenfassung',
    'character.create.yourCharacter': 'Dein Charakter',
    'character.create.characterCreated': 'Charakter erstellt!',
    'character.create.readyToChat':
      'Dein maßgeschneiderter Begleiter ist bereit zum Chatten',
    'character.create.startChatting': 'Chat starten',
    'character.create.notSelected': 'Nicht ausgewählt',
    'character.create.style': 'Stil:',
    'character.create.ethnicity': 'Ethnizität:',
    'character.create.age': 'Alter:',
    'character.create.eyeColor': 'Augenfarbe:',
    'character.create.hair': 'Haare:',
    'character.create.bodyType': 'Körpertyp:',
    'character.create.personalityLabel': 'Persönlichkeit:',
    'character.create.occupation': 'Beruf:',
    'character.create.hobbies': 'Hobbys:',
    'character.create.relationship': 'Beziehung:',
    'character.create.flirty': 'Flirty',
    'character.create.flirtyDesc': 'Verspielt und verführerisch',
    'character.create.shy': 'Schüchtern',
    'character.create.shyDesc': 'Reserviert und unschuldig',
    'character.create.dominant': 'Dominant',
    'character.create.dominantDesc': 'Selbstbewusst und durchsetzungsfähig',
    'character.create.sweet': 'Süß',
    'character.create.sweetDesc': 'Fürsorglich und liebevoll',
    'character.create.intellectual': 'Intellektuell',
    'character.create.intellectualDesc': 'Klug und nachdenklich',
    'character.create.adventurous': 'Abenteuerlustig',
    'character.create.adventurousDesc': 'Wagemutig und spontan',
    'character.create.casual': 'Locker',
    'character.create.casualDesc': 'Spaß und unverbindlich',
    'character.create.romantic': 'Romantisch',
    'character.create.romanticDesc': 'Tiefe emotionale Verbindung',
    'character.create.friendship': 'Freundschaft',
    'character.create.friendshipDesc': 'Unterstützend und platonisch',
    'character.create.mentor': 'Mentor',
    'character.create.mentorDesc': 'Anleitend und lehrend',

    // Character Detail
    'character.aboutMe': 'Über mich:',
    'character.interests': 'Interessen:',
    'character.relationshipLevel': 'Beziehungslevel:',
    'character.progressBar': 'Fortschrittsbalken:',

    // Gifts
    'gifts.title': 'Geschenke',
    'gifts.flowers': 'Blumen',
    'gifts.necklace': 'Halskette',
    'gifts.designerPurse': 'Designer-Handtasche',
    'gifts.rolexWatch': 'Rolex-Uhr',

    // Affiliate
    'affiliate.title': 'Affiliate',
    'affiliate.inviteFriends': 'Freunde einladen, um Sterne zu verdienen!',
    'affiliate.spreadLove':
      'Verbreite die Liebe unter Freunden, lass sie OnlyTwins beitreten und verdiene % ihrer Abonnements (TG-Sterne).',
    'affiliate.percentage': 'Prozentsatz',
    'affiliate.commission': 'Provision von jedem Abo.',

    // Language
    'language.title': 'Sprache',
    'language.en': 'Englisch',
    'language.ru': 'Russisch',
    'language.zh': 'Chinesisch',
    'language.de': 'Deutsch',
    'language.ar': 'Arabisch',
    'language.ja': 'Japanisch',
    'language.ko': 'Koreanisch',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
  ar: {
    // Navigation
    'nav.settings': 'الإعدادات',
    'nav.gifts': 'الهدايا',
    'nav.home': 'الرئيسية',
    'nav.affiliate': 'الشركاء',
    'nav.earn': 'اكسب',
    'common.voiceCall': 'مكالمة صوتية',
    'common.endCall': 'إنهاء المكالمة',
    'common.connecting': 'جاري الاتصال...',
    'common.callActive': 'المكالمة نشطة',
    'common.doubleClick': 'نقرة مزدوجة',
    'common.doubleClickToCall': 'انقر نقرًا مزدوجًا لبدء المكالمة الصوتية',
    'common.microphoneRequired':
      'الوصول إلى الميكروفون مطلوب للمكالمات الصوتية',
    'common.microphoneAccessDenied': 'تم رفض الوصول إلى الميكروفون',
    'common.enableMicrophoneInstructions':
      'يرجى تمكين الوصول إلى الميكروفون في إعدادات المتصفح لاستخدام المكالمات الصوتية',
    'common.callInitError':
      'فشل في بدء المكالمة الصوتية. يرجى المحاولة مرة أخرى.',

    // Common
    'common.back': 'رجوع',
    'common.continue': 'استمرار',
    'common.finish': 'إنهاء',
    'common.upgrade': 'ترقية',
    'common.recharge': 'إعادة شحن',
    'common.unlock': 'فتح',
    'common.chatNow': 'الدردشة الآن',
    'common.invite': 'دعوة',
    'common.open': 'فتح',
    'common.start': 'ابدأ',
    'common.payNow': 'ادفع الآن',
    'common.getStarted': 'ابدأ',
    'common.createCharacter': 'إنشاء شخصية',
    'common.copied': 'تم النسخ!',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.yourPlan': 'خطتك',
    'settings.free': 'مجاني',
    'settings.language': 'اللغة',

    // Models
    'models.title': 'النماذج',
    'models.createYourOwn': 'أنشئ نموذجك الخاص',
    'models.createDesc': 'صمم رفيقك المثالي بمظهر وشخصية مخصصة',

    // Language
    'language.title': 'اللغة',
    'language.en': 'الإنجليزية',
    'language.ru': 'الروسية',
    'language.zh': 'الصينية',
    'language.de': 'الألمانية',
    'language.ar': 'العربية',
    'language.ja': 'اليابانية',
    'language.ko': 'الكورية',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
  ja: {
    // Navigation
    'nav.settings': '設定',
    'nav.gifts': 'ギフト',
    'nav.home': 'ホーム',
    'nav.affiliate': 'アフィリエイト',
    'nav.earn': '稼ぐ',
    'common.voiceCall': '音声通話',
    'common.endCall': '通話終了',
    'common.connecting': '接続中...',
    'common.callActive': '通話中',
    'common.doubleClick': 'ダブルクリック',
    'common.doubleClickToCall': 'ダブルクリックで音声通話を開始',
    'common.microphoneRequired': '音声通話にはマイクのアクセス許可が必要です',
    'common.microphoneAccessDenied': 'マイクへのアクセスが拒否されました',
    'common.enableMicrophoneInstructions':
      '音声通話を使用するには、ブラウザの設定でマイクへのアクセスを有効にしてください',
    'common.callInitError':
      '音声通話の初期化に失敗しました。もう一度お試しください。',

    // Common
    'common.back': '戻る',
    'common.continue': '続ける',
    'common.finish': '完了',
    'common.upgrade': 'アップグレード',
    'common.recharge': 'チャージ',
    'common.unlock': 'ロック解除',
    'common.chatNow': '今すぐチャット',
    'common.invite': '招待',
    'common.open': '開く',
    'common.start': '開始',
    'common.payNow': '今すぐ支払う',
    'common.getStarted': '始める',
    'common.createCharacter': 'キャラクター作成',
    'common.copied': 'コピーしました！',

    // Settings
    'settings.title': '設定',
    'settings.yourPlan': 'あなたのプラン',
    'settings.free': '無料',
    'settings.language': '言語',

    // Models
    'models.title': 'モデル',
    'models.createYourOwn': '自分だけのモデルを作成',
    'models.createDesc':
      '外見と性格をカスタマイズして理想のコンパニオンをデザイン',

    // Language
    'language.title': '言語',
    'language.en': '英語',
    'language.ru': 'ロシア語',
    'language.zh': '中国語',
    'language.de': 'ドイツ語',
    'language.ar': 'アラビア語',
    'language.ja': '日本語',
    'language.ko': '韓国語',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
  ko: {
    // Navigation
    'nav.settings': '설정',
    'nav.gifts': '선물',
    'nav.home': '홈',
    'nav.affiliate': '제휴',
    'nav.earn': '수익',
    'common.voiceCall': '음성 통화',
    'common.endCall': '통화 종료',
    'common.connecting': '연결 중...',
    'common.callActive': '통화 중',
    'common.doubleClick': '더블 클릭',
    'common.doubleClickToCall': '더블 클릭으로 음성 통화 시작',
    'common.microphoneRequired': '음성 통화에는 마이크 접근 권한이 필요합니다',
    'common.microphoneAccessDenied': '마이크 접근이 거부되었습니다',
    'common.enableMicrophoneInstructions':
      '음성 통화를 사용하려면 브라우저 설정에서 마이크 접근을 활성화하세요',
    'common.callInitError':
      '음성 통화 초기화에 실패했습니다. 다시 시도해 주세요.',

    // Common
    'common.back': '뒤로',
    'common.continue': '계속',
    'common.finish': '완료',
    'common.upgrade': '업그레이드',
    'common.recharge': '충전',
    'common.unlock': '잠금 해제',
    'common.chatNow': '지금 채팅',
    'common.invite': '초대',
    'common.open': '열기',
    'common.start': '시작',
    'common.payNow': '지금 결제',
    'common.getStarted': '시작하기',
    'common.createCharacter': '캐릭터 만들기',
    'common.copied': '복사됨!',

    // Settings
    'settings.title': '설정',
    'settings.yourPlan': '내 플랜',
    'settings.free': '무료',
    'settings.language': '언어',

    // Models
    'models.title': '모델',
    'models.createYourOwn': '나만의 모델 만들기',
    'models.createDesc': '맞춤형 외모와 성격으로 완벽한 동반자 디자인하기',

    // Language
    'language.title': '언어',
    'language.en': '영어',
    'language.ru': '러시아어',
    'language.zh': '중국어',
    'language.de': '독일어',
    'language.ar': '아랍어',
    'language.ja': '일본어',
    'language.ko': '한국어',

    // Status Bar
    'statusBar.tokens': 'TT',
    'statusBar.energy': '100/100',
  },
};
