import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // <-- add this!
import PasswordInput from '../../components/passwordInput';

const mockFormik = {
  values: { password: '' },
  handleChange: jest.fn(),
  touched: {},
  errors: {}
};

test('initial showPassword state is false and input type is password', () => {
  render(<PasswordInput name="password" formik={mockFormik} placeholder="Enter password" />);
  const input = screen.getByPlaceholderText('Enter password');
  expect(input).toHaveAttribute('type', 'password'); // now works thanks to jest-dom import
});

test('clicking the eye icon toggles showPassword state and input type', () => {
  const { container } = render(<PasswordInput name="password" formik={mockFormik} placeholder="Enter password" />);
  const input = screen.getByPlaceholderText('Enter password');
  const eyeIcon = container.querySelector('.eye'); // select by class

  // initial type
  expect(input).toHaveAttribute('type', 'password');

  // click toggle
  fireEvent.click(eyeIcon);

  // after click, input type should change
  expect(input).toHaveAttribute('type', 'text');
});