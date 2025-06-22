import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertBox from '../../components/alertBox';

describe('AlertBox', () => {
    test('renders with text and close button', () => {
        render(<AlertBox text="Success!" onClose={jest.fn()} />);
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument();
    });

    test('calls onClose after duration', async () => {
        const onClose = jest.fn();

        // Wrap render + timers in act()
        act(() => {
            render(<AlertBox text="Auto-close" onClose={onClose} duration={3000} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("not calls onClose if the duration are not it", async () => {
        const onClose = jest.fn();

        // Wrap render + timers in act()
        act(() => {
            render(<AlertBox text="Auto-close" onClose={onClose} duration={1000} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
          });

        expect(onClose).not.toHaveBeenCalled()
    })


    test('calls onClose when button is clicked', () => {
        const onClose = jest.fn();
        render(<AlertBox text="Click to close" onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: 'ok' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});