import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/Homescreen/HomeScreen';


describe('HomeScreen', () => {
  it('renders correctly with initial state', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);
    expect(getByTestId('status-text').props.children.join('')).toContain('Disabled');
    expect(getByText('Toggle Screenshot')).toBeTruthy();
  });

  it('toggles the state on button press', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);
    fireEvent.press(getByText('Toggle Screenshot'));
    expect(getByTestId('status-text').props.children.join('')).toContain('Enabled');
  });
});
