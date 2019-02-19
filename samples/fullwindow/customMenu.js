const customMenu = {
    showMenu: true,
    menuToggleSetting:{
        type: 'text', // select from ['text', 'image']
        content: 'toggle',
        transition: 'on'
    },
    allMessages: [
        {
            locale: 'en',
            messages: [
                { sendingMessage: 'show spots', imgUrl: "./img/image.png", buttonText: 'show spots' },
                { sendingMessage: 'show shops', imgUrl: './img/image.png', buttonText: 'show shops' },
                { sendingMessage: 'show hotels', imgUrl: './img/image.png', buttonText: 'show hotels' },
                { sendingMessage: 'show map', imgUrl: './img/image.png', buttonText: 'show map' },
                { sendingMessage: 'show trans', imgUrl: './img/image.png', buttonText: 'show trans' },
                { sendingMessage: 'other', imgUrl: './img/image.png', buttonText: 'other' }
            ],
            defaultMessage: 'coming soon'
        }
    ]
}