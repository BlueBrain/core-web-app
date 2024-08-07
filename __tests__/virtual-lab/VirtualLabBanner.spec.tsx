import { render, screen, fireEvent } from '@testing-library/react';
import {
  DashboardBanner,
  LabDetailBanner,
  SandboxBanner,
} from '@/components/VirtualLab/VirtualLabBanner';

describe('DashboardBanner Component', () => {
  const createdAt = '2023-01-01';
  const description = 'Test Description';
  const id = 'test-id';
  const name = 'Test Name';

  it('should display the correct name and description', () => {
    render(<DashboardBanner createdAt={createdAt} description={description} id={id} name={name} />);
    expect(screen.getByTestId('dashboard-banner-name-element')).toHaveTextContent(name);
    expect(screen.getByTestId('dashboard-banner-description-element')).toHaveTextContent(
      description
    );
  });

  it('should generate correct href link', () => {
    render(<DashboardBanner createdAt={createdAt} description={description} id={id} name={name} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/virtual-lab/lab/${id}/overview`);
  });
});

describe('SandboxBanner Component', () => {
  const name = 'Sandbox Name';
  const description = 'Sandbox Description';

  it('should display the correct name and description', () => {
    render(<SandboxBanner name={name} description={description} />);
    expect(screen.getByTestId('sandbox-banner-name-element')).toHaveTextContent(name);
    expect(screen.getByTestId('sandbox-banner-description-element')).toHaveTextContent(description);
  });
});

describe('LabDetailBanner Component', () => {
  const initialVlab = {
    id: 'test-id',
    name: 'Test lab',
    description: 'this is the description',
    entity: 'BBP',
    created_at: '6/08/2024',
    reference_email: 'test@test.ch',
    budget: 1000,
    plan_id: 1,
  };

  it('should display the correct name and description', () => {
    render(<LabDetailBanner initialVlab={initialVlab} />);
    expect(screen.getByTestId('lab-detail-banner-name-element')).toHaveTextContent(
      initialVlab.name
    );
    expect(screen.getByTestId('lab-detail-banner-description-element')).toHaveTextContent(
      initialVlab.description
    );
  });

  it('should toggle edit mode on button click', () => {
    render(<LabDetailBanner initialVlab={initialVlab} />);
    const editButton = screen.getByTestId('lab-detail-banner-edit-btn');
    fireEvent.click(editButton);
    expect(screen.getByTestId('lab-detail-banner-name-input')).toBeVisible();
    expect(screen.getByTestId('lab-detail-banner-description-input')).toBeVisible();
  });
});
