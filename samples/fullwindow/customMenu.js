export const customMenu = {
    showMenu: true,
    borderStyle: {
        color: '#ddd',
        imgUrl: "url('../../border.png')"
        // imgUrl: 'linear-gradient(to right, #F80, #2ED)'
    },
    allMessages: [
        {
        locale: 'ja',
        messages: [
            // [required]sendingMessage for message sent to intergration, [option]displayingmessage for message from chat, imgUrl, [option][imgUrl, buttonText] for menu button style
            { sendingMessage: '見る・体験する', displayingMessage: 'show spots', imgUrl: "../../image.png", buttonText: '見る・体験する' },
            { sendingMessage: '買う・食べる', displayingMessage: 'show shops', imgUrl: '../../image.png', buttonText: '買う・食べる' },
            { sendingMessage: '泊まる', displayingMessage: 'show hotels', imgUrl: '../../image.png', buttonText: '泊まる' },
            { sendingMessage: '地図を見る', displayingMessage: 'show map', imgUrl: '../../image.png', buttonText: '地図を見る' },
            { sendingMessage: '移動する', displayingMessage: 'show trans', imgUrl: '../../image.png', buttonText: '移動する' },
            { sendingMessage: 'その他', displayingMessage: 'other', imgUrl: '../../image.png', buttonText: 'その他' }
        ],
        defaultMessage: '未定'
        }, {
        locale: 'en',
        messages: [
            { sendingMessage: 'show spots', displayingMessage: 'show spots', imgUrl: "../../image.png", buttonText: 'show spots' },
            { sendingMessage: 'show shops', displayingMessage: 'show shops', imgUrl: '../../image.png', buttonText: 'show shops' },
            { sendingMessage: 'show hotels', displayingMessage: 'show hotels', imgUrl: '../../image.png', buttonText: 'show hotels' },
            { sendingMessage: 'show map', displayingMessage: 'show map', imgUrl: '../../image.png', buttonText: 'show map' },
            { sendingMessage: 'show trans', displayingMessage: 'show trans', imgUrl: '../../image.png', buttonText: 'show trans' },
            { sendingMessage: 'other', displayingMessage: 'other', imgUrl: '../../image.png', buttonText: 'other' }
        ],
        defaultMessage: 'coming soon'
        }, {
        locale: 'zh-hant',
        messages: [
            { sendingMessage: '景點', displayingMessage: 'show spots', imgUrl: "../../image.png", buttonText: '景點' },
            { sendingMessage: '購物', displayingMessage: 'show shops', imgUrl: '../../image.png', buttonText: '購物' },
            { sendingMessage: '住宿', displayingMessage: 'show hotels', imgUrl: '../../image.png', buttonText: '住宿' },
            { sendingMessage: '地圖', displayingMessage: 'show map', imgUrl: '../../image.png', buttonText: '地圖' },
            { sendingMessage: '交通', displayingMessage: 'show trans', imgUrl: '../../image.png', buttonText: '交通' },
            { sendingMessage: '其他', displayingMessage: 'other', imgUrl: '../../image.png', buttonText: '其他' }
        ],
        defaultMessage: '敬請期待'
        }, {
        locale: 'zh-hans',
        messages: [
            { sendingMessage: '景点', displayingMessage: 'show spots', imgUrl: "../../image.png", buttonText: '景点' },
            { sendingMessage: '购物', displayingMessage: 'show shops', imgUrl: '../../image.png', buttonText: '购物' },
            { sendingMessage: '住宿', displayingMessage: 'show hotels', imgUrl: '../../image.png', buttonText: '住宿' },
            { sendingMessage: '地图', displayingMessage: 'show map', imgUrl: '../../image.png', buttonText: '地图' },
            { sendingMessage: '交通', displayingMessage: 'show trans', imgUrl: '../../image.png', buttonText: '交通' },
            { sendingMessage: '其他', displayingMessage: 'other', imgUrl: '../../image.png', buttonText: '其他' }
        ],
        defaultMessage: '敬请期待'
        }]
}