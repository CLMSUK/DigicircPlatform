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
    /// The KnowledgeBaseResults class
    ///
    /// </summary>
    [Serializable]
    [DataContract]
    public class KnowledgeBaseResults
    {
        #region KnowledgeBaseResults's Fields

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
        [DataMember(Name="KnowledgeBaseResultsKey")]
        protected int? knowledgeBaseResultsKey = 0;
#pragma warning disable 0649
        private bool disableInternalAdditions;
#pragma warning restore 0649
        #endregion
        #region KnowledgeBaseResults's Properties
/// <summary>
/// The KnowledgeBaseResultsKey property
///
/// </summary>
///
        [Key]
        public virtual int? KnowledgeBaseResultsKey
        {
            get
            {
                return knowledgeBaseResultsKey;
            }
            set
            {
                knowledgeBaseResultsKey = value;
            }
        }
        #endregion
        #region KnowledgeBaseResults's Participant Properties
        [DataMember(Name="Data")]
        protected IList<KnowledgeBaseData> data = new List<KnowledgeBaseData>();
        public virtual List<KnowledgeBaseData> Data
        {
            get
            {
                if (data is KnowledgeBaseData[])
                {
                    data = data.ToList();
                }
                if (data == null)
                {
                    data = new List<KnowledgeBaseData>();
                }
                return data.ToList();
            }
            set
            {
                if (data is KnowledgeBaseData[])
                {
                    data = data.ToList();
                }
                if (data != null)
                {
                    var __itemsToDelete = new List<KnowledgeBaseData>(data);
                    foreach (var __item in __itemsToDelete)
                    {
                        RemoveData(__item);
                    }
                }
                if(value == null)
                {
                    data = new List<KnowledgeBaseData>();
                    return;
                }
                foreach(var __item in value)
                {
                    AddData(__item);
                }
            }
        }
        public virtual void AddData(IList<KnowledgeBaseData> __items)
        {
            foreach (var __item in __items)
            {
                AddData(__item);
            }
        }

        public virtual void InternalAddData(KnowledgeBaseData __item)
        {
            if (__item == null || disableInternalAdditions) return;
            data?.Add(__item);
        }

        public virtual void InternalRemoveData(KnowledgeBaseData __item)
        {
            if (__item == null) return;
            data?.Remove(__item);
        }

        public virtual void AddData(KnowledgeBaseData __item)
        {
            if (__item == null) return;
            InternalAddData(__item);
        }

        public virtual void AddAtIndexData(int index, KnowledgeBaseData __item)
        {
            if (__item == null) return;
            data?.Insert(index, __item);
        }

        public virtual void RemoveData(KnowledgeBaseData __item)
        {
            if (__item != null)
            {
                InternalRemoveData(__item);
            }
        }
        public virtual void SetDataAt(KnowledgeBaseData __item, int __index)
        {
            if (__item == null)
            {
                data[__index] = null;
            }
            else
            {
                data[__index] = __item;
            }
        }

        public virtual void ClearData()
        {
            if (data!=null)
            {
                var __itemsToRemove = data.ToList();
                foreach(var __item in __itemsToRemove)
                {
                    RemoveData(__item);
                }
            }
        }
        #endregion
        #region Constructors
/// <summary>
/// Public constructors of the KnowledgeBaseResults class
/// </summary>
/// <returns>New KnowledgeBaseResults object</returns>
/// <remarks></remarks>
        public KnowledgeBaseResults() {}
        #endregion
        #region Methods

        public virtual List<string> _Validate(bool throwException = true)
        {
            var __errors = new List<string>();
            if (throwException && __errors.Any())
            {
                throw new zAppDev.DotNet.Framework.Exceptions.BusinessException("An instance of TypeClass 'KnowledgeBaseResults' has validation errors:\r\n\r\n" + string.Join("\r\n", __errors));
            }
            return __errors;
        }

        public virtual int _GetUniqueIdentifier()
        {
            var hashCode = 399326290;
            hashCode = hashCode * -1521134295 + (KnowledgeBaseResultsKey?.GetHashCode() ?? 0);
            return hashCode;
        }






/// <summary>
/// Copies the current object to a new instance
/// </summary>
/// <param name="deep">Copy members that refer to objects external to this class (not dependent)</param>
/// <param name="copiedObjects">Objects that should be reused</param>
/// <param name="asNew">Copy the current object as a new one, ready to be persisted, along all its members.</param>
/// <param name="reuseNestedObjects">If asNew is true, this flag if set, forces the reuse of all external objects.</param>
/// <param name="copy">Optional - An existing [KnowledgeBaseResults] instance to use as the destination.</param>
/// <returns>A copy of the object</returns>
        public virtual KnowledgeBaseResults Copy(bool deep=false, Hashtable copiedObjects=null, bool asNew=false, bool reuseNestedObjects = false, KnowledgeBaseResults copy = null)
        {
            if(copiedObjects == null)
            {
                copiedObjects = new Hashtable();
            }
            if (copy == null && copiedObjects.Contains(this))
                return (KnowledgeBaseResults)copiedObjects[this];
            copy = copy ?? new KnowledgeBaseResults();
            if (!asNew)
            {
                copy.TransientId = this.TransientId;
                copy.KnowledgeBaseResultsKey = this.KnowledgeBaseResultsKey;
            }
            if (!copiedObjects.Contains(this))
            {
                copiedObjects.Add(this, copy);
            }
            copy.data = new List<KnowledgeBaseData>();
            if(deep && this.data != null)
            {
                foreach (var __item in this.data)
                {
                    if (!copiedObjects.Contains(__item))
                    {
                        if (asNew && reuseNestedObjects)
                            copy.AddData(__item);
                        else
                            copy.AddData(__item.Copy(deep, copiedObjects, asNew));
                    }
                    else
                    {
                        copy.AddData((KnowledgeBaseData)copiedObjects[__item]);
                    }
                }
            }
            return copy;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as KnowledgeBaseResults;
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
        public static bool operator ==(KnowledgeBaseResults x, KnowledgeBaseResults y)
        {
            // By default, == and Equals compares references. In order to
            // maintain these semantics with entities, we need to compare by
            // identity value. The Equals(x, y) override is used to guard
            // against null values; it then calls EntityEquals().
            return Equals(x, y);
        }

// Maintain inequality operator semantics for entities.
        public static bool operator !=(KnowledgeBaseResults x, KnowledgeBaseResults y)
        {
            return !(x == y);
        }

        private PropertyInfo __propertyKeyCache;
        public virtual PropertyInfo GetPrimaryKey()
        {
            if (__propertyKeyCache == null)
            {
                __propertyKeyCache = this.GetType().GetProperty("KnowledgeBaseResultsKey");
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
                    this.cachedHashcode = (hashCode * HashMultiplier) ^ this.KnowledgeBaseResultsKey.GetHashCode();
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
            return this.KnowledgeBaseResultsKey == default(int) || this.KnowledgeBaseResultsKey.Equals(default(int));
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
        protected bool HasSameNonDefaultIdAs(KnowledgeBaseResults compareTo)
        {
            return !this.IsTransient() && !compareTo.IsTransient() && this.KnowledgeBaseResultsKey.Equals(compareTo.KnowledgeBaseResultsKey);
        }

        #endregion


    }
}
