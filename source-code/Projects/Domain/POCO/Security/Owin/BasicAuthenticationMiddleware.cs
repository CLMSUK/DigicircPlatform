// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

#if NETFRAMEWORK
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin;
using Microsoft.Owin.Security.Infrastructure;

namespace DigicircMatchmaking.Security.Owin
{
    public class BasicAuthenticationMiddleware : AuthenticationMiddleware<BasicAuthenticationOptions>
    {
        public delegate Task<IEnumerable<Claim>> CredentialValidationFunction(string id, string secret);

        public BasicAuthenticationMiddleware(OwinMiddleware next, BasicAuthenticationOptions options)
        : base(next, options)
        {}

        protected override AuthenticationHandler<BasicAuthenticationOptions> CreateHandler()
        {
            return new BasicAuthenticationHandler(Options);
        }
    }
}
#else
#endif