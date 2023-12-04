const MOST_READ = [
  {
    id: 'most-read-explore',
    category: 'Explore',
    title: 'Introduction to Brain Mapping',
    description: `Understand the fundamentals of brain mapping, including techniques and technologies used
    to visualize and navigate the intricate structure of the mouse brain.`,
  },
  {
    id: 'most-read-build',
    category: 'Build',
    title: 'Optimizing Synapse Models for Realistic Simulations',
    description: `Learn how to optimize synapse models for realistic simulations of synaptic
    transmissions. This documentation provides insights into creating accurate models that
    contribute to the overall circuit dynamics.`,
  },
  {
    id: 'most-read-simulate',
    category: 'Simulate',
    title: 'Collaborative Simulation: Sharing Data and Insights',
    description: `Learn how to collaborate effectively on neural simulations. This documentation covers
    tools and best practices for sharing data, insights, and simulations among research
    collaborators.`,
  },
];

export default function MostRead() {
  return (
    <div className="mt-10 mb-4">
      <h2 className="font-normal text-neutral-3 text-base mb-3">Most read</h2>
      <ul className="grid grid-cols-3 gap-3 border-y border-neutral-2 py-3">
        {MOST_READ.map(({ id, title, category, description }) => (
          <li key={id} className="flex flex-col">
            <span className="text-sm uppercase text-neutral-3">{category}</span>
            <h3 className="font-bold text-lg text-primary-8">{title}</h3>
            <p className="text-base text-primary-8 font-light line-clamp-2">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
