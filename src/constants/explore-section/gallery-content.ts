export type SingleGallery = {
  title: string;
  imageCover: string;
  description: string;
  slug: {
    current: string;
  };
};

export const GalleryListContent: SingleGallery[] = [
  {
    title: 'Simulation renders',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_01.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'simulation-renders',
    },
  },
  {
    title: 'Cellular details',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_02.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'cellular-details',
    },
  },
  {
    title: 'Atlas views',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_03.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'atlas-views',
    },
  },
  {
    title: 'Point Neurons details',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_04.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'point-neurons-details',
    },
  },
  {
    title: 'Circuit steps',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_05.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'point-neurons-details',
    },
  },
  {
    title: 'Experiment detail',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_06.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'experiment-detail',
    },
  },
  {
    title: 'Thalamus Experiments',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_01.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'thalamus-experiments',
    },
  },
  {
    title: 'Isocortex astrocytes',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_02.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'isocortex-astrocytes',
    },
  },
  {
    title: 'Glial renders',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_03.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'glial-renders',
    },
  },
  {
    title: 'Microglial structure',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_04.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'microglial-structure',
    },
  },
  {
    title: 'Hypothalamus renders',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_05.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'hypothalamus-renders',
    },
  },
  {
    title: 'Ion channels analysis',
    imageCover: '/images/explore/gallery/sbo_explore_gallery_imgCover_06.jpg',
    description:
      'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
    slug: {
      current: 'ion-channels-analysis',
    },
  },
];

export type GalleryImages = {
  name: string;
  src: string;
  alt: string;
  credit: string;
  year: string;
  software: string;
};

export type SingleGalleryContentType = {
  name: string;
  description: string;
  images: GalleryImages[];
};

export const SingleGalleryContent = {
  name: 'Simulation renders',
  description:
    'Here is a description of what can be achieved  in this app. What is expected from the user and what is the output...',
  images: [
    {
      name: 'Simulation renders number 1',
      src: '/images/explore/singleGallery/gallery_image_1.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 2',
      src: '/images/explore/singleGallery/gallery_image_2.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 3',
      src: '/images/explore/singleGallery/gallery_image_3.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 4',
      src: '/images/explore/singleGallery/gallery_image_4.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 5',
      src: '/images/explore/singleGallery/gallery_image_5.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 6',
      src: '/images/explore/singleGallery/gallery_image_1.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 7',
      src: '/images/explore/singleGallery/gallery_image_2.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 8',
      src: '/images/explore/singleGallery/gallery_image_3.jpg',
      alt: 'Simulation renders',
    },
    {
      name: 'Simulation renders number 9',
      src: '/images/explore/singleGallery/gallery_image_4.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 10',
      src: '/images/explore/singleGallery/gallery_image_5.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 11',
      src: '/images/explore/singleGallery/gallery_image_1.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 12',
      src: '/images/explore/singleGallery/gallery_image_2.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 13',
      src: '/images/explore/singleGallery/gallery_image_3.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 14',
      src: '/images/explore/singleGallery/gallery_image_4.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 15',
      src: '/images/explore/singleGallery/gallery_image_5.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 16',
      src: '/images/explore/singleGallery/gallery_image_1.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 17',
      src: '/images/explore/singleGallery/gallery_image_2.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 18',
      src: '/images/explore/singleGallery/gallery_image_3.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 19',
      src: '/images/explore/singleGallery/gallery_image_4.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
    {
      name: 'Simulation renders number 20',
      src: '/images/explore/singleGallery/gallery_image_5.jpg',
      alt: 'Simulation renders',
      credit: 'VIZ team',
      year: '2013',
      software: 'Brayns',
    },
  ],
};
