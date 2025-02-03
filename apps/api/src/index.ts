import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { nanoid } from 'nanoid'
import { R2Bucket } from '@cloudflare/workers-types'

type Env = {
  BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Env }>()

// 使用 CORS 中间件，只允许 https://chat.deepseek.com 访问
app.use('*', cors({
  origin: 'https://chat.deepseek.com',
  // 如有需要，可额外配置允许的请求方法和头部：
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type']
}))

// 保存分享内容
app.post('/share', async (c) => {
  const { content, styles } = await c.req.json()
  const id = nanoid(8)
  
  await c.env.BUCKET.put(id, JSON.stringify({ content, styles }), {
    customMetadata: { createdAt: Date.now().toString() }
  })

  // 动态获取请求的 baseUrl
  const baseUrl = new URL(c.req.url).origin
  const shareUrl = `${baseUrl}/share/${id}`

  return c.json({ id, shareUrl, expiryDays: 7 })
})

// 获取分享内容
app.get('/share/:id', async (c) => {
  const id = c.req.param('id')
  const obj = await c.env.BUCKET.get(id)
  
  if (!obj) return c.notFound()
  
  const data = (await obj.json()) as { content: string; styles: string }
  const { content, styles } = data
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>分享页面</title>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `)
})

export default app 