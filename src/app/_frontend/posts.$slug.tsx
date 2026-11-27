import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { Post } from '@/payload-types'

export const Route = createFileRoute('/_frontend/posts/$slug')({
  loader: ({ params }) => getPostBySlug({ data: { slug: decodeURIComponent(params.slug) } }),
  component: PostPage,
})

export const getPostBySlug = createServerFn({ method: 'GET', strict: { output: false } })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: data.slug } },
    })

    return result.docs?.[0] || null
  })

function PostPage() {
  const post = Route.useLoaderData()

  return (
    <article className="pt-16 pb-16">
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <p>{post.title}</p>
        </div>
      </div>
    </article>
  )
}
