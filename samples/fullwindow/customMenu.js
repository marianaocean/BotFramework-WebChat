const customMenu = {
    showMenu: true,
    menuToggleSetting:{
        type: 'text', // select from ['text', 'image']
        content: 'toggle',
        transition: 'on' // turn animation to on/off, default to be off
    },
    commonIcons: [
        './img/icon_activity.svg',
        './img/icon_restaurant.svg',
        './img/icon_hotel.svg',
        './img/icon_travelinfo.svg',
        './img/icon_culture.svg',
        './img/icon_event.svg'
    ],
    allMessages: [
        {
            locale: 'ja',
            messages: [
                // [required]sendingMessage for message sent to intergration, [option][imgUrl, buttonText] for menu button style
                // message max to 6
                { sendingMessage: 'アクティビティ', buttonText: 'アクティビティ' }, // set imgUrl to 'no' to not show image for button
                { sendingMessage: 'レストラン', buttonText: 'レストラン' },
                { sendingMessage: '宿泊施設' , buttonText: '宿泊施設' },
                { sendingMessage: 'トラベルインフォ' , buttonText: 'トラベルインフォ' },
                { sendingMessage: 'カルチャー' , buttonText: 'カルチャー' },
                { sendingMessage: 'イベント情報' , buttonText: 'イベント情報' }
            ],
            defaultMessage: '未定'
        }, {
            locale: 'en',
            messages: [
                { sendingMessage: 'show spots', imgUrl: './img/image.png', buttonText: 'show spots' },
                { sendingMessage: 'show shops', buttonText: 'show shops' }
            ],
            defaultMessage: 'coming soon'
        }, {
            locale: 'zh-hant',
            messages: [
                { sendingMessage: '景點', buttonText: '景點' }
            ],
            defaultMessage: '敬请期待'
        }, {
            locale: 'zh-hans',
            messages: [
                { sendingMessage: '景点', buttonText: '景点' },
                { sendingMessage: '购物', buttonText: '购物' },
                { sendingMessage: '住宿', buttonText: '住宿' }
            ],
            defaultMessage: '敬请期待'
        }]
}