import config from '../config';

// Helpers for calling the Clearly.Hub components and checking their results.
// See https://support.clearly.app/hub/hosted-components.html for the full description.

export type ComponentAction = 'SELECT_SUBSCRIPTION' | 'SELECT_HUB' | 'REGISTER_RESOURCE';

export interface RawComponentResult {
  data: string;
  signature?: string;
}

export interface CheckedComponentResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  signatureValid: boolean;
  stateValid: boolean;
}

const STATE_KEY = 'clearlyHubComponentState';

// Clearly.Hub publishes the public key it signs component results with here:
const DEFAULT_PUBLIC_KEY_URL = 'https://hub.clearly.app/.well-known/public-key.pem';

// The url the component sends the user back to: this page, without query string.
// It must exactly match one of the callback urls of your app client (see README.md).
export const getRedirectUrl = (): string => location.origin + location.pathname;

// Builds the request for a component, and stores a new random state,
// so the result can be matched to this request later.
export const createComponentRequest = (
  action: ComponentAction,
  extra: Record<string, unknown> = {},
): Record<string, unknown> => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  return {
    actions: [action],
    client_id: config.cognito.userPoolClientId,
    redirect_url: getRedirectUrl(),
    state,
    ...extra,
  };
};

// Encodes a request, for use in the component url.
export const encodeComponentRequest = (request: Record<string, unknown>): string =>
  btoa(JSON.stringify(request));

// Reads the result of a component from the given query parameters.
// The component does not url-encode the values, so URLSearchParams turns every "+"
// of the base64 into a space: put them back before using the values.
export const readComponentResult = (
  params: URLSearchParams,
  param = 'data',
): RawComponentResult | null => {
  const data = params.get(param)?.replace(/ /g, '+');
  const signature = params.get('signature')?.replace(/ /g, '+');
  return data ? { data, signature } : null;
};

// Verifies that the result was signed by Clearly.Hub (Ed25519, raw signature format).
// In a real application, do this in your backend before trusting the result.
const verifyComponentSignature = async (data: string, signature?: string): Promise<boolean> => {
  if (!signature) return false;
  try {
    const pem = await (await fetch(config.components.publicKeyUrl ?? DEFAULT_PUBLIC_KEY_URL)).text();
    const keyBytes = Uint8Array.from(atob(pem.replace(/-----[^-]+-----|\s/g, '')), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('spki', keyBytes, { name: 'Ed25519' }, false, ['verify']);
    return await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      Uint8Array.from(atob(signature), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(data),
    );
  } catch (error) {
    console.warn('Could not verify the signature (does your browser support Ed25519?)', error);
    return false;
  }
};

// Decodes the result, verifies the signature and checks the state.
export const checkComponentResult = async (
  { data, signature }: RawComponentResult,
): Promise<CheckedComponentResult> => {
  const result = JSON.parse(atob(data));
  const signatureValid = await verifyComponentSignature(data, signature);

  // compare the state in the result with the one we stored, and use it only once:
  const expectedState = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  const stateValid = !!expectedState && result.request?.state === expectedState;

  return { result, signatureValid, stateValid };
};

// A short, readable summary of a checked result.
export const summarizeComponentResult = (
  { result, signatureValid, stateValid }: CheckedComponentResult,
): string => [
  `Result: ${result.response?.result}`, // SUCCESS or CANCELED
  `Signature valid: ${signatureValid}`,
  `State valid: ${stateValid}`,
  JSON.stringify(result.response, null, 2),
].join('\n');
