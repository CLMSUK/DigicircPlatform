// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.
using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using zAppDev.DotNet.Framework.Linq;
using zAppDev.DotNet.Framework.Data.Domain;
using zAppDev.DotNet.Framework.Workflow;
using zAppDev.DotNet.Framework.Identity.Model;

namespace DigicircMatchmaking.BO
{
    /// <summary>
    /// The ActorCreateRequest class
    ///
    /// </summary>
    [Serializable]
    [DataContract]
    public class ActorCreateRequest
    {
        #region ActorCreateRequest's Fields

        protected Guid _transientId= Guid.NewGuid();
        public virtual Guid TransientId
        {
            get
            {
                return _transientId;
            }
            set
            {
                _transientId = value;
            }
        }
        [DataMember(Name="ActorCreateRequestKey")]
        protected int? actorCreateRequestKey = 0;
#pragma warning disable 0649
        private bool disableInternalAdditions;
#pragma warning restore 0649
        #endregion
        #region ActorCreateRequest's Properties
/// <summary>
/// The ActorCreateRequestKey property
///
/// </summary>
///
        [Key]
        public virtual int? ActorCreateRequestKey
        {
            get
            {
                return actorCreateRequestKey;
            }
            set
            {
                actorCreateRequestKey = value;
            }
        }
        #endregion
        #region ActorCreateRequest's Participant Properties
        [DataMember(Name="Statements")]
        protected IList<ActorCreateStatements> statements = new List<ActorCreateStatements>();
        public virtual List<ActorCreateStatements> Statements
        {
            get
            {
                if (statements is ActorCreateStatements[])
                {
                    statements = statements.ToList();
                }
                if (statements == null)
                {
                    statements = new List<ActorCreateStatements>();
                }
                return statements.ToList();
            }
            set
            {
                if (statements is ActorCreateStatements[])
                {
                    statements = statements.ToList();
                }
                if (statements != null)
                {
                    var __itemsToDelete = new List<ActorCreateStatements>(statements);
                    foreach (var __item in __itemsToDelete)
                    {
                        RemoveStatements(__item);
                    }
                }
                if(value == null)
                {
                    statements = new List<ActorCreateStatements>();
                    return;
                }
                foreach(var __item in value)
                {
                    AddStatements(__item);
                }
            }
        }
        public virtual void AddStatements(IList<ActorCreateStatements> __items)
        {
            foreach (var __item in __items)
            {
                AddStatements(__item);
            }
        }

        public virtual void InternalAddStatements(ActorCreateStatements __item)
        {
            if (__item == null || disableInternalAdditions) return;
            statements?.Add(__item);
        }

        public virtual void InternalRemoveStatements(ActorCreateStatements __item)
        {
            if (__item == null) return;
            statements?.Remove(__item);
        }

        public virtual void AddStatements(ActorCreateStatements __item)
        {
            if (__item == null) return;
            InternalAddStatements(__item);
        }

        public virtual void AddAtIndexStatements(int index, ActorCreateStatements __item)
        {
            if (__item == null) return;
            statements?.Insert(index, __item);
        }

        public virtual void RemoveStatements(ActorCreateStatements __item)
        {
            if (__item != null)
            {
                InternalRemoveStatements(__item);
            }
        }
        public virtual void SetStatementsAt(ActorCreateStatements __item, int __index)
        {
            if (__item == null)
            {
                statements[__index] = null;
            }
            else
            {
                statements[__index] = __item;
            }
        }

        public virtual void ClearStatements()
        {
            if (statements!=null)
            {
                var __itemsToRemove = statements.ToList();
                foreach(var __item in __itemsToRemove)
                {
                    RemoveStatements(__item);
                }
            }
        }
        #endregion
        #region Constructors
/// <summary>
/// Public constructors of the ActorCreateRequest class
/// </summary>
/// <returns>New ActorCreateRequest object</returns>
/// <remarks></remarks>
        public ActorCreateRequest() {}
        #endregion
        #region Methods

        public virtual List<string> _Validate(bool throwException = true)
        {
            var __errors = new List<string>();
            if (throwException && __errors.Any())
            {
                throw new zAppDev.DotNet.Framework.Exceptions.BusinessException("An instance of TypeClass 'ActorCreateRequest' has validation errors:\r\n\r\n" + string.Join("\r\n", __errors));
            }
            return __errors;
        }

        public virtual int _GetUniqueIdentifier()
        {
            var hashCode = 399326290;
            hashCode = hashCode * -1521134295 + (ActorCreateRequestKey?.GetHashCode() ?? 0);
            return hashCode;
        }






/// <summary>
/// Copies the current object to a new instance
/// </summary>
/// <param name="deep">Copy members that refer to objects external to this class (not dependent)</param>
/// <param name="copiedObjects">Objects that should be reused</param>
/// <param name="asNew">Copy the current object as a new one, ready to be persisted, along all its members.</param>
/// <param name="reuseNestedObjects">If asNew is true, this flag if set, forces the reuse of all external objects.</param>
/// <param name="copy">Optional - An existing [ActorCreateRequest] instance to use as the destination.</param>
/// <returns>A copy of the object</returns>
        public virtual ActorCreateRequest Copy(bool deep=false, Hashtable copiedObjects=null, bool asNew=false, bool reuseNestedObjects = false, ActorCreateRequest copy = null)
        {
            if(copiedObjects == null)
            {
                copiedObjects = new Hashtable();
            }
            if (copy == null && copiedObjects.Contains(this))
                return (ActorCreateRequest)copiedObjects[this];
            copy = copy ?? new ActorCreateRequest();
            if (!asNew)
            {
                copy.TransientId = this.TransientId;
                copy.ActorCreateRequestKey = this.ActorCreateRequestKey;
            }
            if (!copiedObjects.Contains(this))
            {
                copiedObjects.Add(this, copy);
            }
            copy.statements = new List<ActorCreateStatements>();
            if(deep && this.statements != null)
            {
                foreach (var __item in this.statements)
                {
                    if (!copiedObjects.Contains(__item))
                    {
                        if (asNew && reuseNestedObjects)
                            copy.AddStatements(__item);
                        else
                            copy.AddStatements(__item.Copy(deep, copiedObjects, asNew));
                    }
                    else
                    {
                        copy.AddStatements((ActorCreateStatements)copiedObjects[__item]);
                    }
                }
            }
            return copy;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as ActorCreateRequest;
            if (ReferenceEquals(this, compareTo))
            {
                return true;
            }
            if (compareTo == null || !this.GetType().Equals(compareTo.GetTypeUnproxied()))
            {
                return false;
            }
            if (this.HasSameNonDefaultIdAs(compareTo))
            {
                return true;
            }
            // Since the Ids aren't the same, both of them must be transient to
            // compare domain signatures; because if one is transient and the
            // other is a persisted entity, then they cannot be the same object.
            return this.IsTransient() && compareTo.IsTransient() && (base.Equals(compareTo) || this.TransientId.Equals(compareTo.TransientId));
        }

// Maintain equality operator semantics for entities.
        public static bool operator ==(ActorCreateRequest x, ActorCreateRequest y)
        {
            // By default, == and Equals compares references. In order to
            // maintain these semantics with entities, we need to compare by
            // identity value. The Equals(x, y) override is used to guard
            // against null values; it then calls EntityEquals().
            return Equals(x, y);
        }

// Maintain inequality operator semantics for entities.
        public static bool operator !=(ActorCreateRequest x, ActorCreateRequest y)
        {
            return !(x == y);
        }

        private PropertyInfo __propertyKeyCache;
        public virtual PropertyInfo GetPrimaryKey()
        {
            if (__propertyKeyCache == null)
            {
                __propertyKeyCache = this.GetType().GetProperty("ActorCreateRequestKey");
            }
            return __propertyKeyCache;
        }


/// <summary>
///     To help ensure hashcode uniqueness, a carefully selected random number multiplier
///     is used within the calculation.  Goodrich and Tamassia's Data Structures and
///     Algorithms in Java asserts that 31, 33, 37, 39 and 41 will produce the fewest number
///     of collissions.  See http://computinglife.wordpress.com/2008/11/20/why-do-hash-functions-use-prime-numbers/
///     for more information.
/// </summary>
        private const int HashMultiplier = 31;
        private int? cachedHashcode;

        public override int GetHashCode()
        {
            if (this.cachedHashcode.HasValue)
            {
                return this.cachedHashcode.Value;
            }
            if (this.IsTransient())
            {
                //this.cachedHashcode = base.GetHashCode();
                return this.TransientId.GetHashCode(); //don't cache because this won't stay transient forever
            }
            else
            {
                unchecked
                {
                    // It's possible for two objects to return the same hash code based on
                    // identically valued properties, even if they're of two different types,
                    // so we include the object's type in the hash calculation
                    var hashCode = this.GetType().GetHashCode();
                    this.cachedHashcode = (hashCode * HashMultiplier) ^ this.ActorCreateRequestKey.GetHashCode();
                }
            }
            return this.cachedHashcode.Value;
        }

/// <summary>
///     Transient objects are not associated with an item already in storage.  For instance,
///     a Customer is transient if its Id is 0.  It's virtual to allow NHibernate-backed
///     objects to be lazily loaded.
/// </summary>
        public virtual bool IsTransient()
        {
            return this.ActorCreateRequestKey == default(int) || this.ActorCreateRequestKey.Equals(default(int));
        }

/// <summary>
///     When NHibernate proxies objects, it masks the type of the actual entity object.
///     This wrapper burrows into the proxied object to get its actual type.
///
///     Although this assumes NHibernate is being used, it doesn't require any NHibernate
///     related dependencies and has no bad side effects if NHibernate isn't being used.
///
///     Related discussion is at http://groups.google.com/group/sharp-architecture/browse_thread/thread/ddd05f9baede023a ...thanks Jay Oliver!
/// </summary>
        protected virtual System.Type GetTypeUnproxied()
        {
            return this.GetType();
        }

/// <summary>
///     Returns true if self and the provided entity have the same Id values
///     and the Ids are not of the default Id value
/// </summary>
        protected bool HasSameNonDefaultIdAs(ActorCreateRequest compareTo)
        {
            return !this.IsTransient() && !compareTo.IsTransient() && this.ActorCreateRequestKey.Equals(compareTo.ActorCreateRequestKey);
        }

        #endregion


    }
}
