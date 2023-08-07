import { CloseOutlined } from '@ant-design/icons';

import { generateId } from '@/components/experiment-designer/GenericParamWrapper';

function ArticleCategory({
  category,
  clearable,
  onClear,
}: {
  category: string;
  clearable?: boolean;
  onClear?: Function;
}) {
  return (
    <button
      type="button"
      onClick={() => clearable && onClear && onClear()}
      className="inline-flex items-center justify-center gap-3 px-6 py-2 text-base font-normal capitalize bg-white border border-gray-200 rounded-full shadow-sm select-none text-primary-6"
    >
      <span>{category}</span>
      <span>
        {clearable && (
          <CloseOutlined className="text-base font-thin hover:transform hover:scale-105 hover:transition-transform hover:ease-in-out hover:text-primary-7" />
        )}
      </span>
    </button>
  );
}

function ArticleCategories({ title, categories }: { title: string; categories?: string[] }) {
  return (
    !!categories?.length && (
      <div className="flex flex-wrap items-center justify-start gap-2 my-2">
        {categories.map((category) => {
          const key = generateId(title, category);
          return <ArticleCategory clearable key={key} category={category} />;
        })}
      </div>
    )
  );
}

export default ArticleCategories;
