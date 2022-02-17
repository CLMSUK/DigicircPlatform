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
    /// The GraphQuery class
    ///
    /// </summary>
    [Serializable]
    [DataContract]
    public class GraphQuery
    {
        #region GraphQuery's Fields

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
        [DataMember(Name="SearchMode")]
        protected string searchMode;
        [DataMember(Name="DisplayMode")]
        protected string displayMode;
        [DataMember(Name="GraphQueryKey")]
        protected int? graphQueryKey = 0;
#pragma warning disable 0649
        private bool disableInternalAdditions;
#pragma warning restore 0649
        #endregion
        #region GraphQuery's Properties
/// <summary>
/// The SearchMode property
///
/// </summary>
///
        public virtual string SearchMode
        {
            get
            {
                return searchMode;
            }
            set
            {
                searchMode = value;
            }
        }
/// <summary>
/// The DisplayMode property
///
/// </summary>
///
        public virtual string DisplayMode
        {
            get
            {
                return displayMode;
            }
            set
            {
                displayMode = value;
            }
        }
/// <summary>
/// The GraphQueryKey property
///
/// </summary>
///
        [Key]
        public virtual int? GraphQueryKey
        {
            get
            {
                return graphQueryKey;
            }
            set
            {
                graphQueryKey = value;
            }
        }
        #endregion
        #region GraphQuery's Participant Properties
        [DataMember(Name="SelectedActor")]
        protected Actor selectedActor;
        public virtual Actor SelectedActor
        {
            get
            {
                return selectedActor;
            }
            set
            {
                if(Equals(selectedActor, value)) return;
                var __oldValue = selectedActor;
                if (value != null)
                {
                    selectedActor = value;
                }
                else
                {
                    if (selectedActor != null)
                    {
                        selectedActor = null;
                    }
                }
            }
        }
        [DataMember(Name="ActorNames")]
        protected IList<ActorNames> actorNames = new List<ActorNames>();
        public virtual List<ActorNames> ActorNames
        {
            get
            {
                if (actorNames is ActorNames[])
                {
                    actorNames = actorNames.ToList();
                }
                if (actorNames == null)
                {
                    actorNames = new List<ActorNames>();
                }
                return actorNames.ToList();
            }
            set
            {
                if (actorNames is ActorNames[])
                {
                    actorNames = actorNames.ToList();
                }
                if (actorNames != null)
                {
                    var __itemsToDelete = new List<ActorNames>(actorNames);
                    foreach (var __item in __itemsToDelete)
                    {
                        RemoveActorNames(__item);
                    }
                }
                if(value == null)
                {
                    actorNames = new List<ActorNames>();
                    return;
                }
                foreach(var __item in value)
                {
                    AddActorNames(__item);
                }
            }
        }
        public virtual void AddActorNames(IList<ActorNames> __items)
        {
            foreach (var __item in __items)
            {
                AddActorNames(__item);
            }
        }

        public virtual void InternalAddActorNames(ActorNames __item)
        {
            if (__item == null || disableInternalAdditions) return;
            actorNames?.Add(__item);
        }

        public virtual void InternalRemoveActorNames(ActorNames __item)
        {
            if (__item == null) return;
            actorNames?.Remove(__item);
        }

        public virtual void AddActorNames(ActorNames __item)
        {
            if (__item == null) return;
            InternalAddActorNames(__item);
        }

        public virtual void AddAtIndexActorNames(int index, ActorNames __item)
        {
            if (__item == null) return;
            actorNames?.Insert(index, __item);
        }

        public virtual void RemoveActorNames(ActorNames __item)
        {
            if (__item != null)
            {
                InternalRemoveActorNames(__item);
            }
        }
        public virtual void SetActorNamesAt(ActorNames __item, int __index)
        {
            if (__item == null)
            {
                actorNames[__index] = null;
            }
            else
            {
                actorNames[__index] = __item;
            }
        }

        public virtual void ClearActorNames()
        {
            if (actorNames!=null)
            {
                var __itemsToRemove = actorNames.ToList();
                foreach(var __item in __itemsToRemove)
                {
                    RemoveActorNames(__item);
                }
            }
        }
        [DataMember(Name="DesiredProduct")]
        protected Product desiredProduct;
        public virtual Product DesiredProduct
        {
            get
            {
                return desiredProduct;
            }
            set
            {
                if(Equals(desiredProduct, value)) return;
                var __oldValue = desiredProduct;
                if (value != null)
                {
                    desiredProduct = value;
                }
                else
                {
                    if (desiredProduct != null)
                    {
                        desiredProduct = null;
                    }
                }
            }
        }
        [DataMember(Name="ResourceProduct")]
        protected Product resourceProduct;
        public virtual Product ResourceProduct
        {
            get
            {
                return resourceProduct;
            }
            set
            {
                if(Equals(resourceProduct, value)) return;
                var __oldValue = resourceProduct;
                if (value != null)
                {
                    resourceProduct = value;
                }
                else
                {
                    if (resourceProduct != null)
                    {
                        resourceProduct = null;
                    }
                }
            }
        }
        #endregion
        #region Constructors
/// <summary>
/// Public constructors of the GraphQuery class
/// </summary>
/// <returns>New GraphQuery object</returns>
/// <remarks></remarks>
        public GraphQuery() {}
        #endregion
        #region Methods

        public virtual List<string> _Validate(bool throwException = true)
        {
            var __errors = new List<string>();
            if (SearchMode != null && SearchMode.Length > 100)
            {
                __errors.Add("Length of property 'SearchMode' cannot be greater than 100.");
            }
            if (DisplayMode != null && DisplayMode.Length > 100)
            {
                __errors.Add("Length of property 'DisplayMode' cannot be greater than 100.");
            }
            if (throwException && __errors.Any())
            {
                throw new zAppDev.DotNet.Framework.Exceptions.BusinessException("An instance of TypeClass 'GraphQuery' has validation errors:\r\n\r\n" + string.Join("\r\n", __errors));
            }
            return __errors;
        }

        public virtual int _GetUniqueIdentifier()
        {
            var hashCode = 399326290;
            hashCode = hashCode * -1521134295 + (SearchMode?.GetHashCode() ?? 0);
            hashCode = hashCode * -1521134295 + (DisplayMode?.GetHashCode() ?? 0);
            hashCode = hashCode * -1521134295 + (GraphQueryKey?.GetHashCode() ?? 0);
            return hashCode;
        }






/// <summary>
/// Copies the current object to a new instance
/// </summary>
/// <param name="deep">Copy members that refer to objects external to this class (not dependent)</param>
/// <param name="copiedObjects">Objects that should be reused</param>
/// <param name="asNew">Copy the current object as a new one, ready to be persisted, along all its members.</param>
/// <param name="reuseNestedObjects">If asNew is true, this flag if set, forces the reuse of all external objects.</param>
/// <param name="copy">Optional - An existing [GraphQuery] instance to use as the destination.</param>
/// <returns>A copy of the object</returns>
        public virtual GraphQuery Copy(bool deep=false, Hashtable copiedObjects=null, bool asNew=false, bool reuseNestedObjects = false, GraphQuery copy = null)
        {
            if(copiedObjects == null)
            {
                copiedObjects = new Hashtable();
            }
            if (copy == null && copiedObjects.Contains(this))
                return (GraphQuery)copiedObjects[this];
            copy = copy ?? new GraphQuery();
            if (!asNew)
            {
                copy.TransientId = this.TransientId;
                copy.GraphQueryKey = this.GraphQueryKey;
            }
            copy.SearchMode = this.SearchMode;
            copy.DisplayMode = this.DisplayMode;
            if (!copiedObjects.Contains(this))
            {
                copiedObjects.Add(this, copy);
            }
            if(deep && this.selectedActor != null)
            {
                if (!copiedObjects.Contains(this.selectedActor))
                {
                    if (asNew && reuseNestedObjects)
                        copy.SelectedActor = this.SelectedActor;
                    else if (asNew)
                        copy.SelectedActor = this.SelectedActor.Copy(deep, copiedObjects, true);
                    else
                        copy.selectedActor = this.selectedActor.Copy(deep, copiedObjects, false);
                }
                else
                {
                    if (asNew)
                        copy.SelectedActor = (Actor)copiedObjects[this.SelectedActor];
                    else
                        copy.selectedActor = (Actor)copiedObjects[this.SelectedActor];
                }
            }
            copy.actorNames = new List<ActorNames>();
            if(deep && this.actorNames != null)
            {
                foreach (var __item in this.actorNames)
                {
                    if (!copiedObjects.Contains(__item))
                    {
                        if (asNew && reuseNestedObjects)
                            copy.AddActorNames(__item);
                        else
                            copy.AddActorNames(__item.Copy(deep, copiedObjects, asNew));
                    }
                    else
                    {
                        copy.AddActorNames((ActorNames)copiedObjects[__item]);
                    }
                }
            }
            if(deep && this.desiredProduct != null)
            {
                if (!copiedObjects.Contains(this.desiredProduct))
                {
                    if (asNew && reuseNestedObjects)
                        copy.DesiredProduct = this.DesiredProduct;
                    else if (asNew)
                        copy.DesiredProduct = this.DesiredProduct.Copy(deep, copiedObjects, true);
                    else
                        copy.desiredProduct = this.desiredProduct.Copy(deep, copiedObjects, false);
                }
                else
                {
                    if (asNew)
                        copy.DesiredProduct = (Product)copiedObjects[this.DesiredProduct];
                    else
                        copy.desiredProduct = (Product)copiedObjects[this.DesiredProduct];
                }
            }
            if(deep && this.resourceProduct != null)
            {
                if (!copiedObjects.Contains(this.resourceProduct))
                {
                    if (asNew && reuseNestedObjects)
                        copy.ResourceProduct = this.ResourceProduct;
                    else if (asNew)
                        copy.ResourceProduct = this.ResourceProduct.Copy(deep, copiedObjects, true);
                    else
                        copy.resourceProduct = this.resourceProduct.Copy(deep, copiedObjects, false);
                }
                else
                {
                    if (asNew)
                        copy.ResourceProduct = (Product)copiedObjects[this.ResourceProduct];
                    else
                        copy.resourceProduct = (Product)copiedObjects[this.ResourceProduct];
                }
            }
            return copy;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as GraphQuery;
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
        public static bool operator ==(GraphQuery x, GraphQuery y)
        {
            // By default, == and Equals compares references. In order to
            // maintain these semantics with entities, we need to compare by
            // identity value. The Equals(x, y) override is used to guard
            // against null values; it then calls EntityEquals().
            return Equals(x, y);
        }

// Maintain inequality operator semantics for entities.
        public static bool operator !=(GraphQuery x, GraphQuery y)
        {
            return !(x == y);
        }

        private PropertyInfo __propertyKeyCache;
        public virtual PropertyInfo GetPrimaryKey()
        {
            if (__propertyKeyCache == null)
            {
                __propertyKeyCache = this.GetType().GetProperty("GraphQueryKey");
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
                    this.cachedHashcode = (hashCode * HashMultiplier) ^ this.GraphQueryKey.GetHashCode();
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
            return this.GraphQueryKey == default(int) || this.GraphQueryKey.Equals(default(int));
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
        protected bool HasSameNonDefaultIdAs(GraphQuery compareTo)
        {
            return !this.IsTransient() && !compareTo.IsTransient() && this.GraphQueryKey.Equals(compareTo.GraphQueryKey);
        }

        #endregion


    }
}