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
    /// The ProductType class
    ///
    /// </summary>
    [Serializable]
    [DataContract]
    public class ProductType : IDomainModelClass
    {
        #region ProductType's Fields

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
        [DataMember(Name="Id")]
        protected int? id = 0;
        [DataMember(Name="Name")]
        protected string name;
        [DataMember(Name="VersionTimestamp")]
        protected int? versionTimestamp;

#pragma warning disable 0649
        private bool disableInternalAdditions;
#pragma warning restore 0649
        #endregion
        #region ProductType's Properties
/// <summary>
/// The Id property
///
/// </summary>
///
        [Key]
        public virtual int? Id
        {
            get
            {
                return id;
            }
            set
            {
                id = value;
            }
        }
/// <summary>
/// The Name property
///
/// </summary>
///
        public virtual string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }
/// <summary>
/// The VersionTimestamp property
///Provides concurrency control for the class
/// </summary>
///
        public virtual int? VersionTimestamp
        {
            get
            {
                return versionTimestamp;
            }
            set
            {
                versionTimestamp = value;
            }
        }
        #endregion
        #region ProductType's Participant Properties
        [DataMember(Name="ParentType")]
        protected IList<ProductType> parentType = new List<ProductType>();
        public virtual List<ProductType> ParentType
        {
            get
            {
                if (parentType is ProductType[])
                {
                    parentType = parentType.ToList();
                }
                if (parentType == null)
                {
                    parentType = new List<ProductType>();
                }
                return parentType.ToList();
            }
            set
            {
                if (parentType is ProductType[])
                {
                    parentType = parentType.ToList();
                }
                if (parentType != null)
                {
                    var __itemsToDelete = new List<ProductType>(parentType);
                    foreach (var __item in __itemsToDelete)
                    {
                        RemoveParentType(__item);
                    }
                }
                if(value == null)
                {
                    parentType = new List<ProductType>();
                    return;
                }
                foreach(var __item in value)
                {
                    AddParentType(__item);
                }
            }
        }
        public virtual void AddParentType(IList<ProductType> __items)
        {
            foreach (var __item in __items)
            {
                AddParentType(__item);
            }
        }

        public virtual void InternalAddParentType(ProductType __item)
        {
            if (__item == null || disableInternalAdditions) return;
            parentType?.Add(__item);
        }

        public virtual void InternalRemoveParentType(ProductType __item)
        {
            if (__item == null) return;
            parentType?.Remove(__item);
        }

        public virtual void AddParentType(ProductType __item)
        {
            if (__item == null) return;
            if (!parentType.Contains(__item))
                InternalAddParentType(__item);
            if (!__item.SybTypes.Contains(this))
                __item.AddSybTypes(this);
        }

        public virtual void AddAtIndexParentType(int index, ProductType __item)
        {
            if (__item == null) return;
            if (!parentType.Contains(__item))
                parentType.Insert(index, __item);
            if (!__item.SybTypes.Contains(this))
                __item.AddSybTypes(this);
        }

        public virtual void RemoveParentType(ProductType __item)
        {
            if (__item != null)
            {
                if (parentType.Contains(__item))
                    InternalRemoveParentType(__item);
                if(__item.SybTypes.Contains(this))
                    __item.RemoveSybTypes(this);
            }
        }
        public virtual void SetParentTypeAt(ProductType __item, int __index)
        {
            if (__item == null)
            {
                parentType[__index].RemoveSybTypes(this);
            }
            else
            {
                parentType[__index] = __item;
                if (!__item.SybTypes.Contains(this))
                    __item.AddSybTypes(this);
            }
        }

        public virtual void ClearParentType()
        {
            if (parentType!=null)
            {
                var __itemsToRemove = parentType.ToList();
                foreach(var __item in __itemsToRemove)
                {
                    RemoveParentType(__item);
                }
            }
        }
        [DataMember(Name="SybTypes")]
        protected IList<ProductType> sybTypes = new List<ProductType>();
        public virtual List<ProductType> SybTypes
        {
            get
            {
                if (sybTypes is ProductType[])
                {
                    sybTypes = sybTypes.ToList();
                }
                if (sybTypes == null)
                {
                    sybTypes = new List<ProductType>();
                }
                return sybTypes.ToList();
            }
            set
            {
                if (sybTypes is ProductType[])
                {
                    sybTypes = sybTypes.ToList();
                }
                if (sybTypes != null)
                {
                    var __itemsToDelete = new List<ProductType>(sybTypes);
                    foreach (var __item in __itemsToDelete)
                    {
                        RemoveSybTypes(__item);
                    }
                }
                if(value == null)
                {
                    sybTypes = new List<ProductType>();
                    return;
                }
                foreach(var __item in value)
                {
                    AddSybTypes(__item);
                }
            }
        }
        public virtual void AddSybTypes(IList<ProductType> __items)
        {
            foreach (var __item in __items)
            {
                AddSybTypes(__item);
            }
        }

        public virtual void InternalAddSybTypes(ProductType __item)
        {
            if (__item == null || disableInternalAdditions) return;
            sybTypes?.Add(__item);
        }

        public virtual void InternalRemoveSybTypes(ProductType __item)
        {
            if (__item == null) return;
            sybTypes?.Remove(__item);
        }

        public virtual void AddSybTypes(ProductType __item)
        {
            if (__item == null) return;
            if (!sybTypes.Contains(__item))
                InternalAddSybTypes(__item);
            if (!__item.ParentType.Contains(this))
                __item.AddParentType(this);
        }

        public virtual void AddAtIndexSybTypes(int index, ProductType __item)
        {
            if (__item == null) return;
            if (!sybTypes.Contains(__item))
                sybTypes.Insert(index, __item);
            if (!__item.ParentType.Contains(this))
                __item.AddParentType(this);
        }

        public virtual void RemoveSybTypes(ProductType __item)
        {
            if (__item != null)
            {
                if (sybTypes.Contains(__item))
                    InternalRemoveSybTypes(__item);
                if(__item.ParentType.Contains(this))
                    __item.RemoveParentType(this);
            }
        }
        public virtual void SetSybTypesAt(ProductType __item, int __index)
        {
            if (__item == null)
            {
                sybTypes[__index].RemoveParentType(this);
            }
            else
            {
                sybTypes[__index] = __item;
                if (!__item.ParentType.Contains(this))
                    __item.AddParentType(this);
            }
        }

        public virtual void ClearSybTypes()
        {
            if (sybTypes!=null)
            {
                var __itemsToRemove = sybTypes.ToList();
                foreach(var __item in __itemsToRemove)
                {
                    RemoveSybTypes(__item);
                }
            }
        }
        #endregion
        #region Constructors
/// <summary>
/// Public constructors of the ProductType class
/// </summary>
/// <returns>New ProductType object</returns>
/// <remarks></remarks>
        public ProductType() {}
        #endregion
        #region Methods

        public virtual List<string> _Validate(bool throwException = true)
        {
            var __errors = new List<string>();
            if (Id == null)
            {
                __errors.Add("Property 'Id' is required.");
            }
            if (Name != null && Name.Length > 100)
            {
                __errors.Add("Length of property 'Name' cannot be greater than 100.");
            }
            if (throwException && __errors.Any())
            {
                throw new zAppDev.DotNet.Framework.Exceptions.BusinessException("An instance of TypeClass 'ProductType' has validation errors:\r\n\r\n" + string.Join("\r\n", __errors));
            }
            return __errors;
        }

        public virtual int _GetUniqueIdentifier()
        {
            var hashCode = 399326290;
            hashCode = hashCode * -1521134295 + (Id?.GetHashCode() ?? 0);
            hashCode = hashCode * -1521134295 + (Name?.GetHashCode() ?? 0);
            return hashCode;
        }






/// <summary>
/// Copies the current object to a new instance
/// </summary>
/// <param name="deep">Copy members that refer to objects external to this class (not dependent)</param>
/// <param name="copiedObjects">Objects that should be reused</param>
/// <param name="asNew">Copy the current object as a new one, ready to be persisted, along all its members.</param>
/// <param name="reuseNestedObjects">If asNew is true, this flag if set, forces the reuse of all external objects.</param>
/// <param name="copy">Optional - An existing [ProductType] instance to use as the destination.</param>
/// <returns>A copy of the object</returns>
        public virtual ProductType Copy(bool deep=false, Hashtable copiedObjects=null, bool asNew=false, bool reuseNestedObjects = false, ProductType copy = null)
        {
            if(copiedObjects == null)
            {
                copiedObjects = new Hashtable();
            }
            if (copy == null && copiedObjects.Contains(this))
                return (ProductType)copiedObjects[this];
            copy = copy ?? new ProductType();
            if (!asNew)
            {
                copy.TransientId = this.TransientId;
                copy.Id = this.Id;
            }
            copy.Name = this.Name;
            if (!copiedObjects.Contains(this))
            {
                copiedObjects.Add(this, copy);
            }
            copy.parentType = new List<ProductType>();
            if(deep && this.parentType != null)
            {
                foreach (var __item in this.parentType)
                {
                    if (!copiedObjects.Contains(__item))
                    {
                        if (asNew && reuseNestedObjects)
                            copy.AddParentType(__item);
                        else
                            copy.AddParentType(__item.Copy(deep, copiedObjects, asNew));
                    }
                    else
                    {
                        copy.AddParentType((ProductType)copiedObjects[__item]);
                    }
                }
            }
            copy.sybTypes = new List<ProductType>();
            if(deep && this.sybTypes != null)
            {
                foreach (var __item in this.sybTypes)
                {
                    if (!copiedObjects.Contains(__item))
                    {
                        if (asNew && reuseNestedObjects)
                            copy.AddSybTypes(__item);
                        else
                            copy.AddSybTypes(__item.Copy(deep, copiedObjects, asNew));
                    }
                    else
                    {
                        copy.AddSybTypes((ProductType)copiedObjects[__item]);
                    }
                }
            }
            return copy;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as ProductType;
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
        public static bool operator ==(ProductType x, ProductType y)
        {
            // By default, == and Equals compares references. In order to
            // maintain these semantics with entities, we need to compare by
            // identity value. The Equals(x, y) override is used to guard
            // against null values; it then calls EntityEquals().
            return Equals(x, y);
        }

// Maintain inequality operator semantics for entities.
        public static bool operator !=(ProductType x, ProductType y)
        {
            return !(x == y);
        }

        private PropertyInfo __propertyKeyCache;
        public virtual PropertyInfo GetPrimaryKey()
        {
            if (__propertyKeyCache == null)
            {
                __propertyKeyCache = this.GetType().GetProperty("Id");
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
                    this.cachedHashcode = (hashCode * HashMultiplier) ^ this.Id.GetHashCode();
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
            return this.Id == default(int) || this.Id.Equals(default(int));
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
        protected bool HasSameNonDefaultIdAs(ProductType compareTo)
        {
            return !this.IsTransient() && !compareTo.IsTransient() && this.Id.Equals(compareTo.Id);
        }

        #endregion


    }
}
