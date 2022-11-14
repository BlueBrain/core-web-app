# How authentication is performed?

## Step 1: redirecting to login screen

We start by generating a 128 chars random string names **codeVerifier**
that we temporarly store in session storage key **"keycloak/codeVerifier"**.

Then we change the current URL for
`https://bbpauth.epfl.ch/auth/realm/BBP/protocol/openid-connect/auth`
with these URL parameters:

```js
{
    client_id: "bbp-sbo-application",
    redirect_uri: window.location.origin,
    code_challenge: SHA256( codeVerifier ),
    code_challenge_method: "S256",
    response_type: "code",
    scope: "profile openid",
}
```

## Step 2: getting access token

If the login succeeds, the browser will be redirected to the SBO application
with only one meaningful URL param: `code`. We store the value of this param in a variable
called `authorizationCode`.

Now we can perform a POST query to
`https://bbpauth.epfl.ch/auth/realm/BBP/protocol/openid-connect/token`
with there params:

```js
{
    client_id: "bbp-sbo-application",
    redirect_uri: window.location.origin,
    grant_type: "authorization_code",
    code: authorizationCode,
    code_verifier: codeVerifier
}
```
