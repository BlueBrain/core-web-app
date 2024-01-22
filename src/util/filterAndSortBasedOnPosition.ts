export default function filterAndSortBasedOnPosition<T extends { label: string }>(
  query: string,
  data: Array<T>
) {
  const filteredData = data.filter((item) => item.label.toLowerCase().includes(query));

  const sortedData = filteredData.sort((a, b) => {
    const indexA = a.label.toLowerCase().indexOf(query);
    const indexB = b.label.toLocaleLowerCase().indexOf(query);

    return indexA - indexB;
  });

  return sortedData;
}
