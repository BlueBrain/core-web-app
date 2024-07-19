import { RenderResult, act, cleanup, fireEvent, render } from '@testing-library/react';

import { success } from '@/api/notifications';
import authFetch from '@/authFetch';
import {
  dataTestid,
  getSuccessMsg,
  ProjectDetailBanner,
} from '@/components/VirtualLab/VirtualLabBanner';
import { virtualLabApi } from '@/config';

const createdAt = new Date().toString();
const projectDescription = 'Test project description';
const projectId = '36e67b31-eddb-414b-8341-9d995430480c';
const projectName = 'Test project name';
const virtualLabId = '67748ce7-c65f-4d78-aff5-227137d43b4d';

const formData = { description: 'Updated project description', name: 'Updated project name' };

const nameElementTestId = `${dataTestid}-name-element`;
const descriptionElementTestId = `${dataTestid}-description-element`;

const nameInputTestId = `${dataTestid}-name-input`;
const descriptionInputTestId = `${dataTestid}-description-input`;

jest.mock('@/authFetch', () => {
  const originalModule = jest.requireActual('@/authFetch');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn((_url, { body, headers: _headers, method: _method }) => {
      const { description: patchedDescription, name: patchedName } = JSON.parse(body);

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            message: 'Successfully updated virtual lab project',
            data: {
              project: {
                created_at: createdAt,
                description: patchedDescription ?? projectDescription,
                id: projectId,
                name: patchedName ?? projectName,
                virtual_lab_id: virtualLabId,
              },
            },
          }),
        status: 200,
        ok: true,
      } as Response);
    }),
  };
});

jest.mock('@/api/notifications', () => {
  const originalModule = jest.requireActual('@/api/notifications');

  return {
    __esModule: true,
    ...originalModule,
    error: jest.fn((_message: string) => {}),
    success: jest.fn((_message: string) => {}),
  };
});

jest.useFakeTimers();

async function toggleEditable(wrapper: RenderResult) {
  const editableToggleBtn = wrapper.getByTestId(dataTestid);

  await act(async () => {
    editableToggleBtn.click(); // Reveal the inputs
  });
}

describe('the VL Banner component', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <ProjectDetailBanner
        createdAt={createdAt}
        description={projectDescription}
        name={projectName}
        projectId={projectId}
        virtualLabId={virtualLabId}
      />
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the VL name and description', () => {
    const nameElement = wrapper.getByTestId(nameElementTestId);
    const descriptionElement = wrapper.getByTestId(descriptionElementTestId);

    expect(nameElement).toHaveTextContent(projectName);
    expect(descriptionElement).toHaveTextContent(projectDescription);
  });

  it('renders the name and description inputs after clicking the "edit" button', async () => {
    await toggleEditable(wrapper);

    const nameInput = wrapper.getByTestId(nameInputTestId);
    const descriptionInput = wrapper.getByTestId(descriptionInputTestId);

    expect(nameInput).toBeVisible();
    expect(descriptionInput).toBeVisible();
  });

  it('renders the "static" name and description after clicking the "edit" button twice', async () => {
    await toggleEditable(wrapper);
    await toggleEditable(wrapper);

    const nameElement = wrapper.getByTestId(nameElementTestId);
    const descriptionElement = wrapper.getByTestId(descriptionElementTestId);

    expect(nameElement).toBeVisible();
    expect(descriptionElement).toBeVisible();
  });

  it('can successfully update the project name and description, and will notify the user of the updates', async () => {
    await toggleEditable(wrapper);

    const nameInput = wrapper.getByTestId(nameInputTestId);
    const descriptionInput = wrapper.getByTestId(descriptionInputTestId);

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: formData.name } }); // Change the name input value
      fireEvent.change(descriptionInput, { target: { value: formData.description } }); // Change the description input value

      jest.runOnlyPendingTimers(); // Account for debounced onChange callback
    });

    expect(authFetch).toHaveBeenCalledTimes(2);

    const fetchUrl = `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}`;

    expect(authFetch).toHaveBeenCalledWith(fetchUrl, {
      body: JSON.stringify({ name: formData.name }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });
    expect(authFetch).toHaveBeenCalledWith(fetchUrl, {
      body: JSON.stringify({ description: formData.description }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });

    const successMsgName = getSuccessMsg('name', formData.name);
    const successMsgDescription = getSuccessMsg('description', formData.description);

    expect(success).toHaveBeenCalledTimes(2);
    expect(success).toHaveBeenCalledWith(successMsgName);
    expect(success).toHaveBeenCalledWith(successMsgDescription);
  });
});
