import '@testing-library/jest-dom/vitest'

/**
 * TokenIcon only displays a token image
 * and is very complex to test
 * and brings no value to the tests
 * so we mock it to return nothing
 */
vi.mock('@/components/token-icon', () => ({
  TokenIcon: () => null,
}));