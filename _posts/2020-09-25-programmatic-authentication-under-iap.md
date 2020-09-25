---
layout: post
title: Programmatic Authentication under IAP on GCP
excerpt: Programmatic Authentication under IAP on GCP
authorslug: punit_goswami
author: Punit Goswami
---
 
### Overview

We recently started with moving a lot of our infrastructure onto Google Cloud Platform. With this, we also decided that a lot of entities, that are not supposed to be accessible from outside the organization, should be moved behind GCP’s [Identity Aware Proxy](https://cloud.google.com/iap). Google’s Identity Aware Proxy (IAP) implements zero-trust access to GCP resources. It allows enforcing access control policies for applications and resources, where group-based application access and service account-based access can be configured, without using any VPN. Any resource or application that is present behind IAP can only be accessed through the proxy by members who have the correct Identity and Access Management (IAM) roles.

### The Problem

A lot of our automation frameworks are run on our test-apps, but now moving them behind IAP posed a new challenge of handling the IAP authentication. Reading through the documentation provided on GCP we figured that the process of service account based programmatic authentication of applications was pretty cumbersome. One has to first add the service account to the access list. To do this, go to the [Identity Aware proxy page](https://console.cloud.google.com/security/iap), then select the resource to be secured. Then in the info panel, you can add the email address for the service account, and the access policy desired. This gives you a service account JSON file. Something like this:

```json
{
 "type": "service_account",
 "project_id": "PROJECT_ID",
 "private_key_id": "abcd123",
 "private_key": "-----BEGIN PRIVATE KEY-----qwerty6789-----END PRIVATE KEY-----\n",
 "client_email": "someone@PROJECT_ID.iam.gserviceaccount.com",
 "client_id": "1239876543210",
 "auth_uri": "https://accounts.google.com/o/oauth2/auth",
 "token_uri": "https://oauth2.googleapis.com/token",
 "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
 "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/someone%40PROJECT_ID.iam.gserviceaccount.com"
}

```

Then use the claim of `target_audience` which you get as the client ID in the previous step, to generate a JWT based token. You can also get the client ID by going to the IAP page, select the resource under consideration, click on the ellipses and then click on **Edit OAuth Client**. On the subsequent page, you get the **client ID** associated with the resource.
Now, mind you, generating the JSON Web Token (JWT) in itself is a separate task, for which you’d need some JWT library. And then the JWT itself needs to be signed with RSA-256 using the private key which is in the service account JSON file. The signature bytes are then to be added to the token, with dot separators, as:

```json
{
 "alg": "RS256",
 "typ": "JWT",
 "kid": "PRIVATE_KEY_ID"
}
.
{
 "iss": "someone@PROJECT_ID.iam.gserviceaccount.com",
 "sub": "someone@PROJECT_ID.iam.gserviceaccount.com",
 "aud": "https://SERVICE_NAME/",
 "iat": 1600948084,
 "exp": 1600951684
}
.
{
   [signature bytes]
}
```

The signed JWT along with the signature bytes addendum and base64url encoded would look something like this:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3NjEzMjY3OTgwNjktcjVtbGpsbG4xcmQ0bHJiaGc3NWVmZ2lncDM2bTc4ajVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzY29wZSI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcHJlZGljdGlvbiIsImF1ZCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92NC90b2tlbiIsImV4cCI6MTMyODU1NDM4NSwiaWF0IjoxMzI4NTUwNzg1fQ.UFUt59SUM2_AW4cRU8Y0BYVQsNTo4n7AFsNrqOpYiICDu37vVt-tw38UKzjmUKtcRsLLjrR3gFW3dNDMx_pL9DVjgVHDdYirtrCekUHOYoa1CMR66nxep5q5cBQ4y4u2kIgSvChCTc9pmLLNoIem-ruCecAJYgI9Ks7pTnW1gkOKs0x3YpiLpzplVHAkkHztaXiJdtpBcY1OXyo6jTQCa3Lk2Q3va1dPkh_d--GU2M5flgd8xNBPYw4vxyt0mP59XZlHMpztZt0soSgObf7G3GXArreF_6tpbFsS3z2t5zkEiHuWJXpzcYr5zWTRPDEHsejeBSG8EgpLDce2380ROQ

```

Once you have the signed JWT, you have to base64url encode it and then make an **OIDC** access token request. This request would be a **POST** request and should be made to the URL `https://oauth2.googleapis.com/token`. Two parameters, `grant_type` and `assertion` are to be added to this request. `grant_type` has the string value of `urn:ietf:params:oauth:grant-type:jwt-bearer` while the `assertion` parameter has the signed JWT, including the signature bytes, as it's value.

```
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3NjEzMjY3OTgwNjktcjVtbGpsbG4xcmQ0bHJiaGc3NWVmZ2lncDM2bTc4ajVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzY29wZSI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcHJlZGljdGlvbiIsImF1ZCI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi90b2tlbiIsImV4cCI6MTMyODU3MzM4MSwiaWF0IjoxMzI4NTY5NzgxfQ.ixOUGehweEVX_UKXv5BbbwVEdcz6AYS-6uQV6fGorGKrHf3LIJnyREw9evE-gs2bmMaQI5_UbabvI4k-mQE4kBqtmSpTzxYBL1TCd7Kv5nTZoUC1CmwmWCFqT9RE6D7XSgPUh_jF1qskLa2w0rxMSjwruNKbysgRNctZPln7cqQ

```

The received response would contain the **Bearer** access token. This token then needs to be incorporated in all the requests that are made to the resources which are present behind the IAP.

At the onset, if you read the description above, and if that description is not daunting enough, then [read the documentation itself](https://cloud.google.com/iap/docs/authentication-howto#iap_make_request-nodejs); The steps seem to be confusing and seems like it could do some rework in being more comprehendible.

### The Solution

Fortunately, Google has made google auth libraries where all the above procedures are already implemented and are well abstracted. Searching google-auth-library would return results with their implementation in multiple languages.
We used the [node library](https://github.com/googleapis/google-auth-library-nodejs) since we had our automation projects majorly implemented through protractor and javascript.
The implementation looks something like this :

```javascript
function main(targetAudience = 'CLIENT_ID_GOES_HERE') {
  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth();

  function request() {
    auth.getIdTokenClient(targetAudience).then(function (client) {
      client.getRequestHeaders().then(function (headers) {
        console.info('headers', headers);
      });
    });
  }
  request();
}

main();
```

This was used to generate the **Bearer** auth token that could then be further used in making requests to our test apps under automation testing.

In the app automation where we required browser instances from Protractor to run automations on test-apps, we made use of the node implementation of [browsermob-proxy](https://github.com/zzo/browsermob-node) along with the [browsermob-proxy server](https://github.com/lightbody/browsermob-proxy).
Using Protractor’s lifecycle method `beforeAll`, we made sure that the token is fetched and ready to be used before any of the spec files are executed.

```javascript
exports.setIap = function () {
  beforeAll(function (done) {
    global.iapAuthToken = 'CLIENT_ID_GOES_HERE';
    if (browser.params.isRunOnTestApp) {
      var targetAudience = '';
      const auth = new GoogleAuth();
      auth.getIdTokenClient(targetAudience).then(function (client) {
        client.getRequestHeaders().then(function (headers) {
          iapAuthToken = headers.Authorization;
          done();
        });
      });
    } else {
      done();
    }
  });
};
```

Then the global available value of this token was used to set the authorization header in the proxy spawned.
We used the `addHeader` method for this.

```javascript
var headersToSet = {};
headersToSet.Authorization = global.iapAuthToken;
proxy.addHeader(port, headersToSet, function (err, resp) {
  if (err) {
    console.error('Error encountered', err);
  } else {
    console.info(`Headers added ${JSON.stringify(headersToSet)}, ${resp}`);
  }
});
```

This allowed us to add the authorization bearer token to every request that was being made through the Protractor browser instance.

The addition of the proxy option to protractor browser capabilities was done to have Protractor route all it’s browser requests through the proxy spawned at the designated `host: port` combination.

```json
proxy: {
    "proxyType": "manual",
    "httpProxy": `${this.params.proxyHost}:${this.params.proxyPort}`,
    "sslProxy": `${this.params.proxyHost}:${this.params.proxyPort}`
}
```

In our node-based automations, where we were making use of the request module to make API calls for their assertion. We overrode them and to accommodate the addition of the authorization bearer token in every request that was being made.

```javascript
exports.customRequest = function (options, callback) {
  var base;
  if (browser.params.isRunOnTestApp) {
    base = request.defaults({
      headers: {
        Authorization: iapAuthToken,
      },
      jar: true,
    });
  } else {
    base = request.defaults({
      jar: true,
    });
  }
  base(options, callback);
};
```

And for all our load tests that were being run through JMeter, we made use of a similar script as mentioned in the first example above. It generates the access token and writes it to a file. This file is then read by the JMX scripts while adding the authorization bearer token to all the network requests that are made through JMeter.
Keeping in mind that these tokens have a short expiration, we generate the token and write them to the files as and when the load tests are run.

### Aftermath

The IAP is a good option to regulate access to private resources without having to implement a VPN tunneling. But throwing accessibility to automated agents in the mix created new interesting challenges here. There are some obvious pros to it:

1. Easy access regulation to resources
2. Fine-grained control of access through users' and services' IAM roles
3. Access through untrusted networks without the requirements of a VPN tunnel

But there are some cons that we discovered along the way of implementing programmatic authentication:

1. Slower execution speeds on private resources, a resultant of re-routing the access which is done to add authorization headers
2. Added overhead of handling authentication in automation tests, which does not cater to the user flow being tested. Users won't be accessing the actual app over IAP.
