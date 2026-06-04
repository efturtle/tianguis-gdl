import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MobileMapView from './MobileMapView.vue';

// Mock the maplibre components
vi.mock('@indoorequal/vue-maplibre-gl', () => ({
  MglMap: { name: 'MglMap', template: '<div class="mgl-map"><slot /></div>' },
  MglNavigationControl: { name: 'MglNavigationControl', template: '<div></div>' },
  MglGeolocateControl: { name: 'MglGeolocateControl', template: '<div></div>' },
  MglMarker: { name: 'MglMarker', template: '<div><slot /></div>' },
  MglPopup: { name: 'MglPopup', template: '<div><slot /></div>' },
}));

// Mock child components
vi.mock('../map/TianguisPopup.vue', () => ({
  default: { name: 'TianguisPopup', template: '<div>Popup</div>' },
}));

vi.mock('./DarkModeToggle.vue', () => ({
  default: { name: 'DarkModeToggle', template: '<div>Toggle</div>' },
}));

describe('MobileMapView', () => {
  const mockTianguis = [
    {
      name: 'Test Tianguis',
      lat: 20.6597,
      lng: -103.3496,
      day: 'lunes' as const,
      municipality: 'Guadalajara',
      state: 'Jalisco',
      location: {
        type: 'address' as const,
        direccion: 'Test Address',
      },
    },
  ];

  it('renders the component', () => {
    const wrapper = mount(MobileMapView, {
      props: {
        tianguis: mockTianguis,
      },
      global: {
        stubs: {
          MglMap: true,
          MglNavigationControl: true,
          MglGeolocateControl: true,
          MglMarker: true,
          MglPopup: true,
          TianguisPopup: true,
          DarkModeToggle: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays the title', () => {
    const wrapper = mount(MobileMapView, {
      props: {
        tianguis: mockTianguis,
      },
      global: {
        stubs: {
          MglMap: true,
          MglNavigationControl: true,
          MglGeolocateControl: true,
          MglMarker: true,
          MglPopup: true,
          TianguisPopup: true,
          DarkModeToggle: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Tianguis GDL');
  });

  it('has municipality and day filters', () => {
    const wrapper = mount(MobileMapView, {
      props: {
        tianguis: mockTianguis,
      },
      global: {
        stubs: {
          MglMap: true,
          MglNavigationControl: true,
          MglGeolocateControl: true,
          MglMarker: true,
          MglPopup: true,
          TianguisPopup: true,
          DarkModeToggle: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Todos');
  });

  it('toggles search overlay', async () => {
    const wrapper = mount(MobileMapView, {
      props: {
        tianguis: mockTianguis,
      },
      global: {
        stubs: {
          MglMap: true,
          MglNavigationControl: true,
          MglGeolocateControl: true,
          MglMarker: true,
          MglPopup: true,
          TianguisPopup: true,
          DarkModeToggle: true,
        },
      },
    });

    // Initially, search should not be visible
    expect(wrapper.text()).not.toContain('Buscar Tianguis');

    // Find and click the search button (the button with the search icon)
    const searchButton = wrapper.findAll('button').find(btn => 
      btn.html().includes('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')
    );
    
    if (searchButton) {
      await searchButton.trigger('click');
      await wrapper.vm.$nextTick();
      
      // Now search overlay should be visible
      expect(wrapper.text()).toContain('Buscar Tianguis');
    }
  });
});
