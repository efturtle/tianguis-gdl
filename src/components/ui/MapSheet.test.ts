import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MapSheet from './MapSheet.vue'; // Update with your actual filename
import { reportIssue } from '../../utils/reportIssue';

// 1. Mock the external utilities so we don't trigger real network/location calls during testing
vi.mock('../../utils/geolocation', () => ({
  formatDistance: vi.fn((km) => `${km.toFixed(1)} km`),
  getUserLocation: vi.fn(),
}));

vi.mock('../../utils/reportIssue', () => ({
  reportIssue: vi.fn(),
}));

// 2. Create a mock Tianguis object to pass as a prop
const mockTianguis = {
  name: 'Tianguis del Sol',
  day: 'miercoles',
  municipality: 'zapopan',
  state: 'jalisco',
  lat: 20.6543,
  lng: -103.4123,
  location: {
    type: 'address',
    direccion: 'Av. Patria y Moctezuma',
  },
  distance: 2.5,
};

describe('MapSheet.vue', () => {
  // Reset mocks and intercept browser APIs before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.open for the Google Maps button
    vi.stubGlobal('open', vi.fn());
    
    // Mock navigator.clipboard for the Share button
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      share: undefined, // Force fallback to clipboard for testing
    });
    
    // Mock alert for the share notification
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders the empty state when no tianguis is selected', () => {
    const wrapper = mount(MapSheet, {
      props: { selectedTianguis: null },
    });

    expect(wrapper.text()).toContain('Toca un marcador en el mapa para ver más información');
    // Ensure the sheet is not visible
    expect(wrapper.classes()).not.toContain('visible');
  });

  it('renders basic tianguis info when selected', () => {
    const wrapper = mount(MapSheet, {
      props: { selectedTianguis: mockTianguis as any },
    });

    expect(wrapper.text()).toContain('Tianguis del Sol');
    expect(wrapper.text()).toContain('Miércoles');
    expect(wrapper.text()).toContain('zapopan');
    expect(wrapper.classes()).toContain('visible');
  });

  it('expands the sheet and shows full details when header is clicked', async () => {
    const wrapper = mount(MapSheet, {
      props: { selectedTianguis: mockTianguis as any },
    });

    // Verify detailed content is hidden initially
    expect(wrapper.text()).not.toContain('Ubicación');

    // Click the header to expand
    await wrapper.find('.cursor-pointer').trigger('click');

    // Verify it added the expanded class and shows details
    expect(wrapper.classes()).toContain('expanded');
    expect(wrapper.text()).toContain('Ubicación');
    expect(wrapper.text()).toContain('Av. Patria y Moctezuma');
    expect(wrapper.text()).toContain('2.5 km');
  });

  it('opens Google Maps with correct coordinates when clicked', async () => {
    const wrapper = mount(MapSheet, {
      props: { selectedTianguis: mockTianguis as any },
    });

    // Expand sheet to reveal the button
    await wrapper.find('.cursor-pointer').trigger('click');

    // Find the Google Maps button and click it
    const buttons = wrapper.findAll('button');
    const mapsBtn = buttons.find(b => b.text().includes('Abrir en Google Maps'));
    await mapsBtn?.trigger('click');

    // Verify window.open was called with the exact formatting
    expect(window.open).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=20.6543,-103.4123',
      '_blank'
    );
  });

  it('calls the reportIssue utility with the selected tianguis', async () => {
    const wrapper = mount(MapSheet, {
      props: { selectedTianguis: mockTianguis as any },
    });

    // Find and click the "Reportar error" button
    const buttons = wrapper.findAll('button');
    const reportBtn = buttons.find(b => b.text().includes('Reportar error en la información'));
    await reportBtn?.trigger('click');

    // Verify the external utility was called with our mock data
    expect(reportIssue).toHaveBeenCalledTimes(1);
    expect(reportIssue).toHaveBeenCalledWith(mockTianguis);
  });
});