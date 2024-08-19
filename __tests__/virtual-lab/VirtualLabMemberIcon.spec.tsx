import React from 'react';
import { render } from '@testing-library/react';
import { Role } from '@/types/virtual-lab/members';
import VirtualLabMemberIcon from '@/components/VirtualLab/VirtualLabMemberIcon';
import colorDictionary from '@/components/VirtualLab/VirtualLabMemberIcon/availableColors';

/* eslint-disable react/jsx-props-no-spreading */

describe('VirtualLabMemberIcon', () => {
  const defaultProps = {
    memberRole: 'member' as Role,
    firstName: 'John',
    lastName: 'Doe',
  };

  it('should render initials based on the first name and last name', () => {
    const { getByText } = render(<VirtualLabMemberIcon {...defaultProps} />);
    const initialsElement = getByText('JD');
    expect(initialsElement).toBeInTheDocument();
  });

  it('should apply background and text color from the colorDictionary based on the first letter of the first name', () => {
    const { container } = render(<VirtualLabMemberIcon {...defaultProps} />);
    const firstChar = 'John'.codePointAt(0);
    // Calculate the expected index based on the code point
    const expectedIndex = firstChar ? firstChar % colorDictionary.length : 0;

    const divElement = container.querySelector('div');
    const spanElement = container.querySelector('span');

    expect(divElement).toHaveStyle(
      `background-color: ${colorDictionary[expectedIndex].background}`
    );
    expect(spanElement).toHaveStyle(`color: ${colorDictionary[expectedIndex].color}`);
  });

  it('should apply rounded-full class when role is "member"', () => {
    const { container } = render(<VirtualLabMemberIcon {...defaultProps} />);
    const divElement = container.querySelector('div');

    expect(divElement).toHaveClass('rounded-full');
  });

  it('should not apply rounded-full class when role is not "member"', () => {
    const { container } = render(<VirtualLabMemberIcon {...defaultProps} memberRole="admin" />);
    const divElement = container.querySelector('div');

    expect(divElement).not.toHaveClass('rounded-full');
  });

  it('should use the correct color dictionary index for a different first name', () => {
    const props = { ...defaultProps, firstName: 'Alice' };
    const { container } = render(<VirtualLabMemberIcon {...props} />);

    const firstChar = 'Alice'.codePointAt(0);
    // Calculate the expected index based on the code point
    const expectedIndex = firstChar ? firstChar % colorDictionary.length : 0;

    const divElement = container.querySelector('div');
    const spanElement = container.querySelector('span');

    expect(divElement).toHaveStyle(
      `background-color: ${colorDictionary[expectedIndex].background}`
    );
    expect(spanElement).toHaveStyle(`color: ${colorDictionary[expectedIndex].color}`);
  });
});
