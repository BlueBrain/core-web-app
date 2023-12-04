type Props = { params: { 'docs-id': string } };

export default function DocumentationPage({ params }: Props) {
  const docId = params['docs-id'];

  return <div className="m-10 font-bold">documentation {docId}</div>;
}
