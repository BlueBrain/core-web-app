import Entrypoint from '@/components/Entrypoint';

export default function RootPage({
  searchParams,
}: {
  searchParams: { errorcode: string | undefined };
}) {
  return <Entrypoint errorCode={searchParams.errorcode} />;
}
