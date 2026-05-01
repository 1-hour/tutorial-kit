import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { TimeBlock, Checkpoint, Answer } from '@/components/mdx/checkpoint';
import { NextStep } from '@/components/mdx/next-step';
import type { Locale } from '@/lib/types';

/**
 * Render MDX content with custom components.
 * We inject `locale` into NextStep via a closure so MDX authors don't need to pass it.
 */
export function MDXContent({ source, locale }: { source: string; locale: Locale }) {
  const components: MDXRemoteProps['components'] = {
    TimeBlock,
    Checkpoint,
    Answer,
    // eslint-disable-next-line react/display-name
    NextStep: (props: { slug: string }) => <NextStep slug={props.slug} locale={locale} />,
  };

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ],
        },
      }}
    />
  );
}
