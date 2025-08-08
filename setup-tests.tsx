import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Ensure DOM environment is available
if (typeof globalThis.document === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
  });
  globalThis.document = dom.window.document;
  globalThis.window = dom.window;
  globalThis.navigator = dom.window.navigator;
}

process.env.TZ = 'UTC';

Object.assign(global, { TextDecoder, TextEncoder });

vi.mock('@web3-onboard/gas', () => ({
  default: () => {},
}));
vi.mock('config/envConfig', () => {
  return {
    ENV_CONFIG: {
      ENV_PROFILE: 'mainnet',
      ALLOWED_CHAINS: ['ETHEREUM_MAINNET_1', 'ARBITRUM_MAINNET_42161'],
      COOKIE3_TRACKING_ID: '',
      ENSO_API_KEY: '',
      ENSO_PRICING_API_URL: '',
      ENSO_ZAP_API_URL: '',
      GOOGLE_ANALYTICS_DEBUG_MODE: false,
      GOOGLE_ANALYTICS_MEASUREMENT_ID: '',
      SENTRY_DSN: '',
      WALLET_CONNECT_PROJECT_ID: '',
      MAINTENANCE_MODE_ENABLED: false,
    },
  };
});
vi.mock('config/env', () => {
  return {
    RPC_URL_ETHEREUM_DEV: '',
    ENV_PROFILE: 'mainnet',
  };
});
vi.mock('@sentry/react', () => {
  return {
    captureException: () => '__TEST_LOG_EVENT_ID__',
  };
});
vi.mock('@wagmi/core', () => {
  return {
    waitForTransactionReceipt: async () => {
      return {
        status: 'success',
      };
    },
  };
});
vi.mock('wagmi', () => ({
  default: () => {},
}));
vi.mock('wallet/context', () => {
  return {
    useWallet: () => {
      return {
        walletChainId: 1,
        accountAddress: '0x123',
        walletChainName: 'Ethereum',
        walletName: 'MetaMask',
        isConnected: true,
        selectWallet: async () => {},
        disconnect: async () => {},
        changeChain: () => {},
      };
    },
  };
});
vi.mock('@/components/token-icon', () => {
  return {
    TokenIcon: () => null,
  };
});

const { ResizeObserver } = window;

beforeEach(() => {
  // @ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  vi.restoreAllMocks();
});

vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      // @ts-expect-error
      <OriginalModule.ResponsiveContainer width={800} height={300}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

/**
 * @dev That's a shim for Radix UI, which requires PointerEvent
 * to work with vitest tests. JSDOM doesn't implement PointerEvent
 * so we need to mock our own implementation. Default to mouse
 * left click interaction.
 * @dev user.click from @testing-library/user-event does not work then
 * so we need to use fireEvent.click from @testing-library/react instead.
 * @see https://www.luisball.com/blog/using-radixui-with-react-testing-library
 * @see https://github.com/radix-ui/primitives/issues/1822
 * @see https://github.com/jsdom/jsdom/pull/2666
 */
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
