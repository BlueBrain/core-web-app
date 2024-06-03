import { Button } from 'antd';
import { useFormStatus } from 'react-dom';

export default function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex w-full items-start justify-end gap-3 py-8">
      <Button
        htmlType="reset"
        type="text"
        size="large"
        className="rounded-none"
        form="create-project-paper-form"
      >
        Cancel
      </Button>
      <Button
        htmlType="submit"
        type="primary"
        size="large"
        className="rounded-none bg-primary-8 px-14"
        loading={pending}
        disabled={pending}
        form="create-project-paper-form"
      >
        Next
      </Button>
    </div>
  );
}
