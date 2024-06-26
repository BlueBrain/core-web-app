import { act, fireEvent, render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';

import { GArticle, GenerativeQA, SortDirection } from '@/types/literature';
import { literatureResultAtom } from '@/state/literature';
import QAResultList from '@/components/explore-section/Literature/components/GenerativeQAResults';
import { getArticle } from '__tests__/__utils__/Literature';

describe('GenerativeQAResults', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  it('sorts articles in ascending order of dates by default when sort button is clicked', async () => {
    const article1 = getArticle(1, { publicationDate: undefined });
    const article2 = getArticle(2, { publicationDate: '2022-01-01' });
    const article3 = getArticle(3, { publicationDate: '2023-01-01' });
    const article4 = getArticle(4, { publicationDate: '2021-10-01' });

    renderComponent([article1, article2, article3, article4]);

    sortArticles('asc');

    expectArticlesInOrder([article4, article2, article3, article1]);
  });

  it('sorts by number of citations when user selects "Number of citations" criteria', async () => {
    const article1 = getArticle(1, { citationsCount: 2 });
    const article2 = getArticle(2, { citationsCount: 5 });
    const article3 = getArticle(3, { citationsCount: undefined });
    const article4 = getArticle(4, { citationsCount: 1 });

    renderComponent([article1, article2, article3, article4]);
    expandArticles();
    await selectSortByField('Number of citations');

    expectArticlesInOrder([article4, article1, article2, article3]);
  });

  it('sorts by impact number when user selects "Matching score" criteria', async () => {
    const article1 = getArticle(1, { impactFactor: 2 });
    const article2 = getArticle(2, { impactFactor: 5 });
    const article3 = getArticle(3, { impactFactor: undefined });
    const article4 = getArticle(4, { impactFactor: 1 });

    renderComponent([article1, article2, article3, article4]);
    expandArticles();

    await selectSortByField('Matching score');

    expectArticlesInOrder([article4, article1, article2, article3]);
  });

  it('sorts articles in descending order of dates when sort button is clicked twice', async () => {
    const article1 = getArticle(1, { publicationDate: undefined });
    const article2 = getArticle(2, { publicationDate: '2022-01-01' });
    const article3 = getArticle(3, { publicationDate: '2023-01-01' });
    const article4 = getArticle(4, { publicationDate: '2021-10-01' });

    renderComponent([article1, article2, article3, article4]);
    sortArticles('desc');

    expectArticlesInOrder([article3, article2, article4, article1]);
  });

  it('sorts articles in original order when sort button is clicked 3 times', async () => {
    const article1 = getArticle(1, { publicationDate: undefined });
    const article2 = getArticle(2, { publicationDate: '2022-01-01' });
    const article3 = getArticle(3, { publicationDate: '2023-01-01' });
    const article4 = getArticle(4, { publicationDate: '2021-10-01' });

    renderComponent([article1, article2, article3, article4]);
    sortArticles(null);

    expectArticlesInOrder([article1, article2, article3, article4]);
  });

  it('shows paragraph for articles instead of their abstract', async () => {
    const mockAbstract = 'Mock abstract';
    const mockParagraph = 'Mock paragraph';
    const article1 = getArticle(1, { abstract: mockAbstract, paragraph: `${mockParagraph} 1` });
    const article2 = getArticle(2, { abstract: mockAbstract, paragraph: `${mockParagraph} 2` });
    const article3 = getArticle(3, { abstract: mockAbstract, paragraph: `${mockParagraph} 3` });
    const article4 = getArticle(4, { abstract: mockAbstract, paragraph: `${mockParagraph} 4` });

    renderComponent([article1, article2, article3, article4]);
    expandArticles();

    expect(screen.getAllByText(new RegExp(mockParagraph))).toHaveLength(4);
    expect(screen.queryByText(new RegExp(mockAbstract))).not.toBeInTheDocument();
  });

  const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  function TestProvider({ initialValues, children }: any) {
    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Provider>
    );
  }

  function QAListProvider(articles: GArticle[]) {
    const qa: GenerativeQA[] = [
      {
        id: '1',
        askedAt: new Date(),
        question: 'How many neurons are there in brain',
        answer: '10k',
        rawAnswer: 'blah blah blah',
        isNotFound: false,
        articles,
        streamed: true,
      },
    ];
    return (
      <TestProvider initialValues={[[literatureResultAtom, qa]]}>
        <QAResultList />
      </TestProvider>
    );
  }

  const DropdownSelector = '.ant-select-dropdown';
  const DropdownOptionSelector = 'div.ant-select-item-option-content';

  const getInputForLabel = (label: string) =>
    screen.getByLabelText(label, {
      selector: 'input',
    }) as HTMLInputElement;

  // Expects mock articles to have unique titles
  const expectArticlesInOrder = (expectedArticles: GArticle[]) => {
    const articleElements = screen.getAllByTestId('article-item');

    articleElements.forEach((actualArticle, index) => {
      const actualTitle = actualArticle.querySelector('h1')?.innerHTML;
      expect(actualTitle).toMatch(expectedArticles[index].title);
    });
  };

  const renderComponent = (articles: GArticle[]) => render(QAListProvider(articles));
  const expandArticles = () => {
    const expandArticlesBt = screen.getByRole('button', { name: 'expand-articles' });
    fireEvent.click(expandArticlesBt);
  };

  const sortArticles = (direction: SortDirection | null) => {
    expandArticles();

    if (direction === 'asc') {
      clickSortButton();
    } else if (direction === 'desc') {
      clickSortButton();
      clickSortButton();
    } else {
      clickSortButton();
      clickSortButton();
      clickSortButton();
    }
  };

  const clickSortButton = () => {
    const sortButton = screen.getByRole('button', { name: 'sort-articles' });
    fireEvent.click(sortButton);
  };

  const selectSortByField = async (fieldLabel: string) => {
    const menuInput = getInputForLabel('sort-by-field-selector');
    await act(async () => {
      fireEvent.mouseDown(menuInput);
    });

    const menuDropdown = document.querySelector(DropdownSelector);
    expect(menuDropdown).toBeInTheDocument();

    const option = screen.getByText(new RegExp(fieldLabel, 'i'), {
      selector: DropdownOptionSelector,
    });
    fireEvent.click(option);
  };
});
