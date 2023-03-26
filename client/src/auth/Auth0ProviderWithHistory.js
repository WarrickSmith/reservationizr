import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const history = useHistory();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  const redirect =
    process.env.REACT_APP_AUTH0_REDIRECT_URI || window.location.origin;

  console.log('RedirectURI : ', redirect);
  console.log('Window Origin : ', window.location.origin);
  console.log('Window Pathname : ', window.location.pathname);

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirect}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
