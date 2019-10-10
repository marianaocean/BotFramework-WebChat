export interface Strings {
    title: string;
    send: string;
    unknownFile: string;
    unknownCard: string;
    receiptTax: string;
    receiptVat: string;
    receiptTotal: string;
    messageRetry: string;
    messageFailed: string;
    messageSending: string;
    timeSent: string;
    consolePlaceholder: string;
    listeningIndicator: string;
    uploadFile: string;
    speak: string;
    alwaysSpeak: string;
    autoListenAfterSpeak: string;
    close: string;
    config: string;
    timeInterval: string;
    tooManyUserSays: string;
    inputCompletion: string;
    longtimeNoResponse: string;
    confirmToReload: string;
    voiceInput: string;
}

interface LocalizedStrings {
    [locale: string]: Strings;
}

const localizedStrings: LocalizedStrings = {
    'en-us': {
        title: 'Chat',
        send: 'Send',
        unknownFile: '[File of type \'%1\']',
        unknownCard: '[Unknown Card \'%1\']',
        receiptVat: 'VAT',
        receiptTax: 'Tax',
        receiptTotal: 'Total',
        messageRetry: 'retry',
        messageFailed: 'couldn\'t send',
        messageSending: 'sending',
        timeSent: ' at %1',
        consolePlaceholder: 'Type your message...',
        listeningIndicator: 'Listening...',
        uploadFile: 'Upload file',
        speak: 'Speak',
        alwaysSpeak: 'Always speak',
        autoListenAfterSpeak: 'Auto listen after speak',
        close: 'close',
        config: 'Configs',
        timeInterval: 'Time interval (s)',
        tooManyUserSays: 'There are too many questions to match, so try typing a little more.',
        inputCompletion: 'Input completion',
        longtimeNoResponse: 'Bot is not responding. Please change the text and try send it again or reload the page.',
        confirmToReload: 'It seems that internet connection has been lost. Please reload the page!',
        voiceInput: 'Voice Input'
    },
    'th-th': {
        title: 'พูดคุย',
        send: 'ส่ง',
        unknownFile: '[ไฟล์ประเภท \'%1\']',
        unknownCard: '[การ์ดที่ไม่รู้จัก \'%1\']',
        receiptVat: 'ภาษีมูลค่าเพิ่ม',
        receiptTax: 'ภาษี',
        receiptTotal: 'ทั้งหมด',
        messageRetry: 'ลองใหม่อีกครั้ง',
        messageFailed: 'ไม่สามารถส่ง',
        messageSending: 'การส่ง',
        timeSent: ' ที่ %1',
        consolePlaceholder: 'พิมพ์ข้อความของคุณ ...',
        listeningIndicator: 'ฟัง ...',
        uploadFile: 'อัพโหลดไฟล์',
        speak: 'พูด',
        alwaysSpeak: '',
        autoListenAfterSpeak: '',
        close: 'ปิด',
        config: 'การกำหนดค่า',
        timeInterval: '',
        tooManyUserSays: '',
        inputCompletion: '',
        longtimeNoResponse: '',
        confirmToReload: '',
        voiceInput: ''
    },
    'ja-jp': {
        title: 'チャット',
        send: '送信',
        unknownFile: '[ファイルタイプ \'%1\']',
        unknownCard: '[不明なカード \'%1\']',
        receiptVat: '消費税',
        receiptTax: '税',
        receiptTotal: '合計',
        messageRetry: '再送',
        messageFailed: '送信できませんでした。',
        messageSending: '送信中',
        timeSent: ' %1',
        consolePlaceholder: 'メッセージを入力してください...',
        listeningIndicator: '聴いてます...',
        uploadFile: '',
        speak: '',
        alwaysSpeak: '常時読み上げ',
        autoListenAfterSpeak: '読み上げ後自動音声入力',
        close: '閉じる',
        config: '設定',
        timeInterval: 'メッセージ間隔（秒）',
        tooManyUserSays: 'マッチする質問が多すぎるため、もう少し入力してみてください。',
        inputCompletion: '質問予測',
        longtimeNoResponse: 'ボットの反応がなさそうです、言い方を変えて再送かページリロードかをしてみてください！',
        confirmToReload: '通信ができなくなっているかもしれません、ページをリロードしてください！',
        voiceInput: '音声入力'
    },
    'zh-hans': {
        title: '聊天',
        send: '发送',
        unknownFile: '[类型为\'%1\'的文件]',
        unknownCard: '[未知的\'%1\'卡片]',
        receiptVat: '消费税',
        receiptTax: '税',
        receiptTotal: '共计',
        messageRetry: '重试',
        messageFailed: '无法发送',
        messageSending: '正在发送',
        timeSent: ' 用时 %1',
        consolePlaceholder: '输入你的消息...',
        listeningIndicator: '正在倾听...',
        uploadFile: '上传文件',
        speak: '发言',
        alwaysSpeak: '总是读出消息',
        autoListenAfterSpeak: '读出消息后启动语音输入',
        close: '关闭',
        config: '设定',
        timeInterval: '消息间隔（秒）',
        tooManyUserSays: '匹配结果过多，请输入更多内容以匹配',
        inputCompletion: '问题补全',
        longtimeNoResponse: '机器人似乎没有响应，请重新发送或刷新页面',
        confirmToReload: '网络连接可能已断开，请刷新页面',
        voiceInput: '语音输入'
    },
    'zh-hant': {
        title: '聊天',
        send: '發送',
        unknownFile: '[類型為\'%1\'的文件]',
        unknownCard: '[未知的\'%1\'卡片]',
        receiptVat: '消費稅',
        receiptTax: '税',
        receiptTotal: '總共',
        messageRetry: '重試',
        messageFailed: '無法發送',
        messageSending: '正在發送',
        timeSent: ' 於 %1',
        consolePlaceholder: '輸入你的訊息...',
        listeningIndicator: '正在聆聽...',
        uploadFile: '上載檔案',
        speak: '發言',
        alwaysSpeak: '總是讀出消息',
        autoListenAfterSpeak: '讀出消息後啟動語音輸入',
        close: '關閉',
        config: '設定',
        timeInterval: '消息間隔（秒）',
        tooManyUserSays: '匹配结果过多，请输入更多内容以匹配',
        inputCompletion: '問題補全',
        longtimeNoResponse: '机器人似乎没有响应，請重試或刷新頁面',
        confirmToReload: '網絡連接可能已斷開，請刷新頁面',
        voiceInput: '語音輸入'
    },
    'ru-ru': {
        title: 'Чат',
        send: 'Отправить',
        unknownFile: '[Неизвестный тип \'%1\']',
        unknownCard: '[Неизвестная карта \'%1\']',
        receiptVat: 'VAT',
        receiptTax: 'Налог',
        receiptTotal: 'Итого',
        messageRetry: 'повторить',
        messageFailed: 'не удалось отправить',
        messageSending: 'отправка',
        timeSent: ' в %1',
        consolePlaceholder: 'Введите ваше сообщение...',
        listeningIndicator: 'прослушивание...',
        uploadFile: '',
        speak: '',
        alwaysSpeak: '',
        autoListenAfterSpeak: '',
        close: 'близко',
        config: 'настройки',
        timeInterval: '',
        tooManyUserSays: '',
        inputCompletion: '',
        longtimeNoResponse: '',
        confirmToReload: '',
        voiceInput: ''
    },
    'ko-kr': {
        title: '채팅',
        send: '전송',
        unknownFile: '[파일 형식 \'%1\']',
        unknownCard: '[알수없는 타입의 카드 \'%1\']',
        receiptVat: '부가세',
        receiptTax: '세액',
        receiptTotal: '합계',
        messageRetry: '재전송',
        messageFailed: '전송할 수 없습니다',
        messageSending: '전송중',
        timeSent: ' %1',
        consolePlaceholder: '메세지를 입력하세요...',
        listeningIndicator: '수신중...',
        uploadFile: '',
        speak: '',
        alwaysSpeak: '대화자동읽기',
        autoListenAfterSpeak: '자동읽기후,마이크켜기',
        close: '닫기',
        config: '설정',
        timeInterval: '메세지간격(초)',
        tooManyUserSays: '일치하는 질문수가 너무 많습니다. 좀 더 입력해 주세요.',
        inputCompletion: '예상질문',
        longtimeNoResponse: '챗봇이 반응이 없습니다. 입력문장을 바꿔서 다시 전송하거나 페이지를 다시 로드해 주세요.',
        confirmToReload: '통신이 끊어진 것 같습니다. 페이지를 다시 로드해 주세요!',
        voiceInput: '음성 입력'
    }
//     'nb-no': {
//         title: 'Chat',
//         send: 'Send',
//         unknownFile: '[Fil av typen \'%1\']',
//         unknownCard: '[Ukjent Kort \'%1\']',
//         receiptVat: 'MVA',
//         receiptTax: 'Skatt',
//         receiptTotal: 'Totalt',
//         messageRetry: 'prøv igjen',
//         messageFailed: 'kunne ikke sende',
//         messageSending: 'sender',
//         timeSent: ' %1',
//         consolePlaceholder: 'Skriv inn melding...',
//         listeningIndicator: 'Lytter...',
//         uploadFile: 'Last opp fil',
//         speak: 'Snakk',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'da-dk': {
//         title: 'Chat',
//         send: 'Send',
//         unknownFile: '[Fil af typen \'%1\']',
//         unknownCard: '[Ukendt kort \'%1\']',
//         receiptVat: 'Moms',
//         receiptTax: 'Skat',
//         receiptTotal: 'Total',
//         messageRetry: 'prøv igen',
//         messageFailed: 'ikke sendt',
//         messageSending: 'sender',
//         timeSent: ' kl %1',
//         consolePlaceholder: 'Skriv din besked...',
//         listeningIndicator: 'Lytter...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'de-de': {
//         title: 'Chat',
//         send: 'Senden',
//         unknownFile: '[Datei vom Typ \'%1\']',
//         unknownCard: '[Unbekannte Card \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'MwSt.',
//         receiptTotal: 'Gesamtbetrag',
//         messageRetry: 'wiederholen',
//         messageFailed: 'konnte nicht senden',
//         messageSending: 'sendet',
//         timeSent: ' um %1',
//         consolePlaceholder: 'Verfasse eine Nachricht...',
//         listeningIndicator: 'Hören...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'pl-pl': {
//         title: 'Chat',
//         send: 'Wyślij',
//         unknownFile: '[Plik typu \'%1\']',
//         unknownCard: '[Nieznana karta \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'Podatek',
//         receiptTotal: 'Razem',
//         messageRetry: 'wyślij ponownie',
//         messageFailed: 'wysłanie nieudane',
//         messageSending: 'wysyłanie',
//         timeSent: ' o %1',
//         consolePlaceholder: 'Wpisz swoją wiadomość...',
//         listeningIndicator: 'Słuchanie...',
//         uploadFile: 'Wyślij plik',
//         speak: 'Mów',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'nl-nl': {
//         title: 'Chat',
//         send: 'Verstuur',
//         unknownFile: '[Bestand van het type \'%1\']',
//         unknownCard: '[Onbekende kaart \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'BTW',
//         receiptTotal: 'Totaal',
//         messageRetry: 'opnieuw',
//         messageFailed: 'versturen mislukt',
//         messageSending: 'versturen',
//         timeSent: ' om %1',
//         consolePlaceholder: 'Typ je bericht...',
//         listeningIndicator: 'Aan het luisteren...',
//         uploadFile: 'Bestand uploaden',
//         speak: 'Spreek',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'lv-lv': {
//         title: 'Tērzēšana',
//         send: 'Sūtīt',
//         unknownFile: '[Nezināms tips \'%1\']',
//         unknownCard: '[Nezināma kartīte \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'Nodoklis',
//         receiptTotal: 'Kopsumma',
//         messageRetry: 'Mēģināt vēlreiz',
//         messageFailed: 'Neizdevās nosūtīt',
//         messageSending: 'Nosūtīšana',
//         timeSent: ' %1',
//         consolePlaceholder: 'Ierakstiet savu ziņu...',
//         listeningIndicator: 'Klausoties...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'pt-br': {
//         title: 'Bate-papo',
//         send: 'Enviar',
//         unknownFile: '[Arquivo do tipo \'%1\']',
//         unknownCard: '[Cartão desconhecido \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'Imposto',
//         receiptTotal: 'Total',
//         messageRetry: 'repetir',
//         messageFailed: 'não pude enviar',
//         messageSending: 'enviando',
//         timeSent: ' às %1',
//         consolePlaceholder: 'Digite sua mensagem...',
//         listeningIndicator: 'Ouvindo...',
//         uploadFile: 'Subir arquivo',
//         speak: 'Falar',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'fr-fr': {
//         title: 'Chat',
//         send: 'Envoyer',
//         unknownFile: '[Fichier de type \'%1\']',
//         unknownCard: '[Carte inconnue \'%1\']',
//         receiptVat: 'TVA',
//         receiptTax: 'Taxe',
//         receiptTotal: 'Total',
//         messageRetry: 'réessayer',
//         messageFailed: 'envoi impossible',
//         messageSending: 'envoi',
//         timeSent: ' à %1',
//         consolePlaceholder: 'Écrivez votre message...',
//         listeningIndicator: 'Écoute...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'es-es': {
//         title: 'Chat',
//         send: 'Enviar',
//         unknownFile: '[Archivo de tipo \'%1\']',
//         unknownCard: '[Tarjeta desconocida \'%1\']',
//         receiptVat: 'IVA',
//         receiptTax: 'Impuestos',
//         receiptTotal: 'Total',
//         messageRetry: 'reintentar',
//         messageFailed: 'no enviado',
//         messageSending: 'enviando',
//         timeSent: ' a las %1',
//         consolePlaceholder: 'Escribe tu mensaje...',
//         listeningIndicator: 'Escuchando...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'el-gr': {
//         title: 'Συνομιλία',
//         send: 'Αποστολή',
//         unknownFile: '[Αρχείο τύπου \'%1\']',
//         unknownCard: '[Αγνωστη Κάρτα \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'ΦΠΑ',
//         receiptTotal: 'Σύνολο',
//         messageRetry: 'δοκιμή',
//         messageFailed: 'αποτυχία',
//         messageSending: 'αποστολή',
//         timeSent: ' την %1',
//         consolePlaceholder: 'Πληκτρολόγηση μηνύματος...',
//         listeningIndicator: 'Ακούγοντας...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'it-it': {
//         title: 'Chat',
//         send: 'Invia',
//         unknownFile: '[File di tipo \'%1\']',
//         unknownCard: '[Card sconosciuta \'%1\']',
//         receiptVat: 'VAT',
//         receiptTax: 'Tasse',
//         receiptTotal: 'Totale',
//         messageRetry: 'riprova',
//         messageFailed: 'impossibile inviare',
//         messageSending: 'invio',
//         timeSent: ' %1',
//         consolePlaceholder: 'Scrivi il tuo messaggio...',
//         listeningIndicator: 'Ascoltando...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'zh-yue': {
//         title: '傾偈',
//         send: '傳送',
//         unknownFile: '[類型係\'%1\'嘅文件]',
//         unknownCard: '[唔知\'%1\'係咩卡片]',
//         receiptVat: '消費稅',
//         receiptTax: '税',
//         receiptTotal: '總共',
//         messageRetry: '再嚟一次',
//         messageFailed: '傳送唔倒',
//         messageSending: '而家傳送緊',
//         timeSent: ' 喺 %1',
//         consolePlaceholder: '輸入你嘅訊息...',
//         listeningIndicator: '聽緊你講嘢...',
//         uploadFile: '上載檔案',
//         speak: '講嘢',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'cs-cz': {
//         title: 'Chat',
//         send: 'Odeslat',
//         unknownFile: '[Soubor typu \'%1\']',
//         unknownCard: '[Neznámá karta \'%1\']',
//         receiptVat: 'DPH',
//         receiptTax: 'Daň z prod.',
//         receiptTotal: 'Celkem',
//         messageRetry: 'opakovat',
//         messageFailed: 'nepodařilo se odeslat',
//         messageSending: 'Odesílání',
//         timeSent: ' v %1',
//         consolePlaceholder: 'Napište svou zprávu...',
//         listeningIndicator: 'Poslouchám...',
//         uploadFile: 'Nahrát soubor',
//         speak: 'Použít hlas',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'hu-hu' : {
//         title: 'Csevegés',
//         send: 'Küldés',
//         unknownFile: '[Fájltípus \'%1\']',
//         unknownCard: '[Ismeretlen kártya \'%1\']',
//         receiptVat: 'ÁFA',
//         receiptTax: 'Adó',
//         receiptTotal: 'Összesen',
//         messageRetry: 'próbálja újra',
//         messageFailed: 'nem sikerült elküldeni',
//         messageSending: 'küldés',
//         timeSent: ' ekkor: %1',
//         consolePlaceholder: 'Írja be üzenetét...',
//         listeningIndicator: 'Figyelés...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'sv-se' : {
//         title: 'Chatt',
//         send: 'Skicka',
//         unknownFile: '[Filtyp \'%1\']',
//         unknownCard: '[Okänt kort \'%1\']',
//         receiptVat: 'Moms',
//         receiptTax: 'Skatt',
//         receiptTotal: 'Totalt',
//         messageRetry: 'försök igen',
//         messageFailed: 'kunde inte skicka',
//         messageSending: 'skickar',
//         timeSent: ' %1',
//         consolePlaceholder: 'Skriv ett meddelande...',
//         listeningIndicator: 'Lyssnar...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'tr-tr' : {
//         title: 'Sohbet',
//         send: 'Gönder',
//         unknownFile: '[Dosya türü: \'%1\']',
//         unknownCard: '[Bilinmeyen Kart: \'%1\']',
//         receiptVat: 'KDV',
//         receiptTax: 'Vergi',
//         receiptTotal: 'Toplam',
//         messageRetry: 'yeniden deneyin',
//         messageFailed: 'gönderilemedi',
//         messageSending: 'gönderiliyor',
//         timeSent: ', %1',
//         consolePlaceholder: 'İletinizi yazın...',
//         listeningIndicator: 'Dinliyor...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//    },
//    'pt-pt' : {
//         title: 'Chat',
//         send: 'Enviar',
//         unknownFile: '[Ficheiro do tipo "%1"]',
//         unknownCard: '[Cartão Desconhecido "%1"]',
//         receiptVat: 'IVA',
//         receiptTax: 'Imposto',
//         receiptTotal: 'Total',
//         messageRetry: 'repetir',
//         messageFailed: 'não foi possível enviar',
//         messageSending: 'a enviar',
//         timeSent: ' em %1',
//         consolePlaceholder: 'Escreva a sua mensagem...',
//         listeningIndicator: 'A Escutar...',
//         uploadFile: '',
//         speak: '',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//    },
//    'fi-fi' : {
//         title: 'Chat',
//         send: 'Lähetä',
//         unknownFile: '[Tiedosto tyyppiä \'%1\']',
//         unknownCard: '[Tuntematon kortti \'%1\']',
//         receiptVat: 'ALV',
//         receiptTax: 'Vero',
//         receiptTotal: 'Yhteensä',
//         messageRetry: 'yritä uudelleen',
//         messageFailed: 'ei voitu lähettää',
//         messageSending: 'lähettää',
//         timeSent: ' klo %1',
//         consolePlaceholder: 'Kirjoita viesti...',
//         listeningIndicator: 'Kuuntelee...',
//         uploadFile: 'Lataa tiedosto',
//         speak: 'Puhu',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     },
//     'he-il': {
//         title: 'צ\'אט',
//         send: 'שלח',
//         unknownFile: '[קובץ מסוג \'%1\']',
//         unknownCard: '[כרטיס לא ידוע \'%1\']',
//         receiptVat: 'מע\"מ',
//         receiptTax: 'מס',
//         receiptTotal: 'סך הכל',
//         messageRetry: 'נסה שוב',
//         messageFailed: 'השליחה נכשלה',
//         messageSending: 'שולח',
//         timeSent: ' %1',
//         consolePlaceholder: 'כתוב כאן...',
//         listeningIndicator: 'מאזין...',
//         uploadFile: 'העלה קובץ',
//         speak: 'דבר',
//         alwaysSpeak: '',
//         autoListenAfterSpeak: '',
//         close: '',
//         config: ''
//     }
};

export const defaultStrings = localizedStrings['en-us'];

// Returns strings using the "best match available"" locale
// e.g. if 'en-us' is the only supported English locale, then
// strings('en') should return localizedStrings('en-us')

function mapLocale(locale: string) {
    locale = locale && locale.toLowerCase();

    if (locale in localizedStrings) {
        return locale;
    } else if (locale.startsWith('cs')) {
        return 'cs-cz';
    } else if (locale.startsWith('da')) {
        return 'da-dk';
    } else if (locale.startsWith('de')) {
        return 'de-de';
    } else if (locale.startsWith('el')) {
        return 'el-gr';
    } else if (locale.startsWith('es')) {
        return 'es-es';
    } else if (locale.startsWith('fi')) {
        return 'fi-fi';
    } else if (locale.startsWith('fr')) {
        return 'fr-fr';
    } else if (locale.startsWith('he')) {
        return 'he-il';
    } else if (locale.startsWith('hu')) {
        return 'hu-hu';
    } else if (locale.startsWith('it')) {
        return 'it-it';
    } else if (locale.startsWith('ja')) {
        return 'ja-jp';
    } else if (locale.startsWith('ko')) {
        return 'ko-kr';
    } else if (locale.startsWith('lv')) {
        return 'lv-lv';
    } else if (locale.startsWith('nb') || locale.startsWith('nn') || locale.startsWith('no')) {
        return 'nb-no';
    } else if (locale.startsWith('nl')) {
        return 'nl-nl';
    } else if (locale.startsWith('pl')) {
        return 'pl-pl';
    } else if (locale.startsWith('pt')) {
        if (locale === 'pt-br') {
            return 'pt-br';
        } else {
            return 'pt-pt';
        }
    } else if (locale.startsWith('ru')) {
        return 'ru-ru';
    } else if (locale.startsWith('sv')) {
        return 'sv-se';
    } else if (locale.startsWith('tr')) {
        return 'tr-tr';
    } else if (locale.startsWith('zh')) {
        if (locale === 'zh-hk' || locale === 'zh-mo' || locale === 'zh-tw') {
            return 'zh-hant';
        } else {
            return 'zh-hans';
        }
    }

    return 'en-us';
}

export const strings = (locale: string) => localizedStrings[mapLocale(locale)];
