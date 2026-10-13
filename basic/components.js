// Helpers for calling the Clearly.Hub components and checking their results.
// See https://support.clearly.app/hub/hosted-components.html for the full description.

const STATE_KEY = 'clearlyHubComponentState';

// Clearly.Hub publishes the public key it signs component results with here:
const DEFAULT_PUBLIC_KEY_URL = 'https://hub.clearly.app/.well-known/public-key.pem';

// Checks that basic/config.js exists and contains the Client Id of your own app client.
const isConfigured = () => {
  if (typeof config === 'undefined') {
    alert('basic/config.js is missing: copy basic/config.js.example to basic/config.js. See "Getting started" in README.md.');
    return false;
  }
  if (!config.clientId || /readme/i.test(config.clientId)) {
    alert('Fill in the Client Id of your app client in basic/config.js. See "Getting started" in README.md.');
    return false;
  }
  return true;
};

// The url the component sends the user back to: this page, without query string.
// It must exactly match one of the callback urls of your app client (see README.md).
const getRedirectUrl = () => location.origin + location.pathname;

// Builds the (base64 encoded) request for a component, and stores a new random
// state, so the result can be matched to this request later.
const createComponentRequest = (action, extra = {}) => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  return btoa(JSON.stringify({
    actions: [action],
    client_id: config.clientId,
    redirect_url: getRedirectUrl(),
    param: config.param,
    state,
    ...extra,
  }));
};

// Reads the result of a component from the query string of the current url.
// The component does not url-encode the values, so URLSearchParams turns every "+"
// of the base64 into a space: put them back before using the values.
const readComponentResult = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const param = (typeof config !== 'undefined' && config.param) || 'data';
  const data = urlParams.get(param)?.replace(/ /g, '+');
  const signature = urlParams.get('signature')?.replace(/ /g, '+');
  return data ? { data, signature } : null;
};

// Verifies that the result was signed by Clearly.Hub (Ed25519, raw signature format).
// In a real application, do this in your backend before trusting the result.
const verifyComponentSignature = async (data, signature) => {
  if (!signature) return false;
  try {
    const pem = await (await fetch(config.publicKeyUrl || DEFAULT_PUBLIC_KEY_URL)).text();
    const keyBytes = Uint8Array.from(atob(pem.replace(/-----[^-]+-----|\s/g, '')), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('spki', keyBytes, { name: 'Ed25519' }, false, ['verify']);
    return await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      Uint8Array.from(atob(signature), c => c.charCodeAt(0)),
      new TextEncoder().encode(data),
    );
  } catch (error) {
    console.warn('Could not verify the signature (does your browser support Ed25519?)', error);
    return false;
  }
};

// Decodes the result, verifies the signature and checks the state.
const checkComponentResult = async ({ data, signature }) => {
  const result = JSON.parse(atob(data));
  const signatureValid = await verifyComponentSignature(data, signature);

  // compare the state in the result with the one we stored, and use it only once:
  const expectedState = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  const stateValid = !!expectedState && result.request?.state === expectedState;

  return { result, signatureValid, stateValid };
};

// Logs a checked result and shows a short summary.
const showComponentResult = ({ result, signatureValid, stateValid }) => {
  console.log('Component result:', result);
  console.log('Signature valid:', signatureValid, '| State valid:', stateValid);

  const outcome = result.response?.result; // SUCCESS or CANCELED
  alert(
    `Component finished with result: ${outcome}\n`
    + `Signature valid: ${signatureValid}\n`
    + `State valid: ${stateValid}\n\n`
    + 'Check the console for the details.',
  );
};
