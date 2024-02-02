import { useEffect, useReducer, useRef } from 'react';
import Image from 'next/image';
import kebabCase from 'lodash/kebabCase';
import last from 'lodash/last';
import head from 'lodash/head';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';

type AboutSection = {
  id: string;
  title: string;
  description: string;
  paragraphs: Array<{
    title: string;
    text: string;
    alt?: string;
    image?: string;
    width?: number;
    height?: number;
  }>;
};

const ABOUT_ARTICLES: Array<AboutSection> = [
  {
    id: 'article-1',
    title: 'The Wonders of Neuroplasticity',
    description: ` Delve into the fascinating realm of neuroplasticity, a phenomenon that unveils the brain's incredible ability to reorganize itself.
        Explore how neural connections are formed and modified throughout a person's life, shaping experiences, learning, and adaptability.
        This article takes you on a journey through the intricacies of neuroplasticity, shedding light on its implications for cognitive functions and rehabilitation.`,
    paragraphs: [
      {
        title: 'Adapting to Change',
        text: `
            Neuroplasticity, also known as brain plasticity, is the ability of the brain to reorganize itself by forming new neural connections throughout life.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. 
            Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean lacinia bibendum nulla sed consectetur.
            Nulla vitae elit libero, a pharetra augue. Maecenas sed diam eget risus varius blandit sit amet non magna. 
            Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. 
            Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur.
            Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. 
            Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. 
            Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
          `,
      },
      {
        title: 'The Power of Learning',
        text: `
            Learning a new skill or acquiring knowledge can lead to structural changes in the brain. 
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. 
            Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
            Aenean lacinia bibendum nulla sed consectetur.
          `,
        alt: 'Neural Connections',
        image: `${basePath}/images/topological-neuron-synthesis.png`,
        width: 440,
        height: 224,
      },
    ],
  },
  {
    id: 'article-2',
    title: 'The Role of Neurotransmitters in Mood Regulation',
    description: `Embark on a profound exploration of neurotransmitters, the chemical messengers that orchestrate communication between nerve cells.
        This article unveils the intricate mechanisms behind mood regulation, shedding light on the profound impact neurotransmitters have on our emotions and mental well-being.
        Dive deep into the world of chemical messengers and emotional harmony, understanding the delicate balance that underlies our psychological states.`,
    paragraphs: [
      {
        title: 'Chemical Messengers',
        text: `
            Neurotransmitters play a crucial role in transmitting signals between nerve cells. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. 
            Aenean lacinia bibendum nulla sed consectetur.
          `,
      },
      {
        title: 'Emotional Harmony',
        text: `
            Maintaining a balance of neurotransmitters is essential for emotional stability. 
            Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean lacinia bibendum nulla sed consectetur.
            Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. 
            Cras mattis consectetur purus sit amet fermentum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
          `,
        alt: 'Neurotransmitter Molecules',
        image: `${basePath}/images/topological-neuron-synthesis.png`,
        width: 440,
        height: 224,
      },
    ],
  },
  {
    id: 'article-3',
    title: 'The Complexity of Brain Development',
    description: `Uncover the intricate processes that shape the development of the human brain, from the early stages of infancy to the complexities of adolescence and beyond.
        This article delves into the transformative journey of brain development, exploring the significant changes that occur and their profound impact on cognitive abilities.
        Gain insights into the fascinating world of brain growth and maturation, from early stages to the challenges and discoveries of adolescence.`,
    paragraphs: [
      {
        title: 'Early Stages of Development',
        text: `
            The human brain undergoes significant changes during the early stages of development. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. 
            Aenean lacinia bibendum nulla sed consectetur.
          `,
      },
      {
        title: 'Adolescence and Beyond',
        text: `
            The adolescent brain continues to develop, shaping cognitive abilities and decision-making processes. 
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
            Nulla vitae elit libero, a pharetra augue. Maecenas sed diam eget risus varius blandit sit amet non magna. 
            Aenean lacinia bibendum nulla sed consectetur.
          `,
        alt: 'Brain Development Stages',
        image: `${basePath}/images/topological-neuron-synthesis.png`,
        width: 440,
        height: 224,
      },
    ],
  },
];

function AboutSectionItem({ id, title, description, paragraphs }: AboutSection) {
  return (
    <div
      id={`about-article-${id}`}
      className="relative flex h-full w-full min-w-full snap-center flex-col"
    >
      <div className="sticky top-0 mb-5 bg-white px-6 pb-6 pt-14">
        <h1 className="text-3xl font-bold text-primary-8">{title}</h1>
        <p className="mt-2 text-base font-normal text-primary-8">{description}</p>
      </div>
      <div className="mr-2 grid grid-flow-col gap-9 px-6">
        {paragraphs.map(({ title: pTitle, text, image: src, alt, width, height }) => (
          <div key={kebabCase(`${pTitle}-${alt}`)}>
            {src && height && width && (
              <div className="mb-5">
                <Image
                  className="block h-auto"
                  {...{
                    src,
                    width,
                    height,
                    alt: alt ?? pTitle,
                  }}
                />
                {alt && (
                  <span className="mt-1 text-sm font-normal text-neutral-4">
                    Figure 1: <span className="text-primary-8">{alt}</span>
                  </span>
                )}
              </div>
            )}
            <h2 className="mb-4 text-2xl font-bold text-primary-8">{pTitle}</h2>
            <article className="text-justify text-primary-8">{text}</article>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutCarousel() {
  const refSlider = useRef<HTMLDivElement>(null);
  const [currentArticle, updateCurrentArticle] = useReducer(
    (_: string, value: string) => value,
    'article-1'
  );

  const onTrackItemClick = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedArticle = refSlider.current?.querySelector(`#about-article-${id}`);
    selectedArticle?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  };

  const onLeftRightSlide = (direction: 'left' | 'right') => () => {
    const slider = refSlider.current;
    if (slider) {
      let left;
      const { clientWidth, scrollLeft } = slider;
      if (direction === 'left') left = scrollLeft - clientWidth;
      if (direction === 'right') left = scrollLeft + clientWidth;
      slider.scroll({
        left,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const slider = refSlider.current;
    const scroller = () => {
      if (slider) {
        const { scrollLeft, scrollWidth } = slider;
        const index = Math.round((scrollLeft / scrollWidth) * ABOUT_ARTICLES.length);
        const article = ABOUT_ARTICLES.find((_, ind) => index === ind);
        if (article) updateCurrentArticle(article.id);
      }
    };

    slider?.addEventListener('scroll', scroller);
    return () => {
      slider?.removeEventListener('scroll', scroller);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        className="no-scrollbar flex h-[calc(100%-55px)] w-full snap-x snap-mandatory gap-1 overflow-y-auto overflow-x-scroll overscroll-x-contain"
        ref={refSlider}
      >
        {ABOUT_ARTICLES.map(({ id, description, title, paragraphs }) => (
          <AboutSectionItem key={id} {...{ id, title, description, paragraphs }} />
        ))}
      </div>
      <nav className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center">
        <ul className="m-0 flex list-none gap-1 p-0">
          <li key="indicator-previous" className="box-border">
            <button
              type="button"
              title="previous"
              aria-label="previous"
              disabled={head(ABOUT_ARTICLES)?.id === currentArticle}
              className="text-primary-8 disabled:pointer-events-none disabled:select-none disabled:text-gray-400"
              onClick={onLeftRightSlide('left')}
            >
              <LeftOutlined className="h-3 w-3 text-current" />
            </button>
          </li>
          {ABOUT_ARTICLES.map(({ id, title }) => (
            <li key={`indicator-${id}`} className="box-border">
              <button
                type="button"
                title={title}
                aria-label={`go to ${title}`}
                onClick={onTrackItemClick(id)}
                className={classNames(
                  'relative mx-[2px] block w-6 cursor-pointer py-3',
                  'before:absolute before:left-0 before:top-[calc(50%-1px)] before:h-1 before:w-6 before:rounded-full before:[transform-origin:left_center]',
                  currentArticle === id
                    ? ' before:bg-primary-8'
                    : 'before:bg-neutral-4 before:opacity-30'
                )}
              />
            </li>
          ))}
          <li key="indicator-next" className="box-border">
            <button
              type="button"
              title="next"
              aria-label="next"
              disabled={last(ABOUT_ARTICLES)?.id === currentArticle}
              onClick={onLeftRightSlide('right')}
              className="text-primary-8 disabled:pointer-events-none disabled:select-none disabled:text-gray-400"
            >
              <RightOutlined className="h-3 w-3 text-current" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
