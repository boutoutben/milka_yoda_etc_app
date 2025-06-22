import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CloseImg from '../../components/CloseImg'; // Adjust path if needed

describe('CloseImg', () => {
  test('calls click handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<CloseImg click={handleClick} />);

    const img = screen.getByRole("button", {name: /close the page/i});
    await userEvent.click(img);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});