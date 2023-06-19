import 'dotenv/config'

import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://data.fda.gov.tw/opendata/exportDataList.do?method=ExportData&InfoId=19&logType=5')
      const infos = data
      for (const info of infos) {
        if (info.中文品名 === event.message.text) {
          // event.reply([
          //   { type: 'text', text: `好處：${info.保健功效}` },
          //   { type: 'text', text: `注意事項：${info.注意事項}` },
          //   { type: 'text', text: info.網址 }
          // ])
          event.reply({
            type: 'flex',
            altText: '輸入您想查詢的產品品名',
            contents: {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: info.中文品名,
                    weight: 'bold',
                    size: 'xl',
                    margin: 'md',
                    style: 'normal',
                    decoration: 'none',
                    position: 'relative',
                    align: 'center',
                    wrap: true
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '好處',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1,
                            weight: 'regular',
                            wrap: true
                          },
                          {
                            type: 'text',
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5,
                            text: info.保健功效,
                            margin: 'xxl',
                            align: 'start'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '保健功效',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1,
                            wrap: true
                          },
                          {
                            type: 'text',
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5,
                            text: info.保健功效宣稱,
                            margin: 'xxl'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: '注意',
                            margin: 'none',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1,
                            wrap: true
                          },
                          {
                            type: 'text',
                            text: info.注意事項,
                            margin: 'xxl',
                            flex: 5,
                            size: 'sm',
                            color: '#666666',
                            wrap: true
                          }
                        ],
                        spacing: 'sm'
                      }
                    ]
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                      type: 'uri',
                      label: 'WEBSITE',
                      uri: info.網址
                    }
                  }
                ],
                flex: 0
              }
            }
          })
          console.log(info.保健功效)
          return
        }
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
