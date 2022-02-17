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
    /// The EntityType class
    ///
    /// </summary>
    [Serializable]
    [DataContract]
    [KnownType(typeof(ValueType))]

    public class EntityType : ValueType,IDomainModelClass
    {
        #region EntityType's Fields
        [DataMember(Name="IsProvider")]
        protected bool isProvider;
        [DataMember(Name="IsCluster")]
        protected bool isCluster;
        #endregion
        #region EntityType's Properties
/// <summary>
/// The IsProvider property
///
/// </summary>
///
        public virtual bool IsProvider
        {
            get
            {
                return isProvider;
            }
            set
            {
                isProvider = value;
            }
        }
/// <summary>
/// The IsCluster property
///
/// </summary>
///
        public virtual bool IsCluster
        {
            get
            {
                return isCluster;
            }
            set
            {
                isCluster = value;
            }
        }
        #endregion
        #region Constructors
/// <summary>
/// Public constructors of the EntityType class
/// </summary>
/// <returns>New EntityType object</returns>
/// <remarks></remarks>
        public EntityType(): base()
        {
            isProvider = false;
        }
        #endregion
        #region Methods

        public override List<string> _Validate(bool throwException = true)
        {
            var __errors = new List<string>();
            __errors = base._Validate(throwException);
            if (throwException && __errors.Any())
            {
                throw new zAppDev.DotNet.Framework.Exceptions.BusinessException("An instance of TypeClass 'EntityType' has validation errors:\r\n\r\n" + string.Join("\r\n", __errors));
            }
            return __errors;
        }

        public virtual int _GetUniqueIdentifier()
        {
            var hashCode = 399326290;
            hashCode = hashCode * -1521134295 + (IsProvider.GetHashCode() );
            hashCode = hashCode * -1521134295 + (IsCluster.GetHashCode() );
            hashCode = hashCode * -1521134295 + (Id?.GetHashCode() ?? 0);
            hashCode = hashCode * -1521134295 + (Code?.GetHashCode() ?? 0);
            hashCode = hashCode * -1521134295 + (Value?.GetHashCode() ?? 0);
            return hashCode;
        }






/// <summary>
/// Copies the current object to a new instance
/// </summary>
/// <param name="deep">Copy members that refer to objects external to this class (not dependent)</param>
/// <param name="copiedObjects">Objects that should be reused</param>
/// <param name="asNew">Copy the current object as a new one, ready to be persisted, along all its members.</param>
/// <param name="reuseNestedObjects">If asNew is true, this flag if set, forces the reuse of all external objects.</param>
/// <param name="copy">Optional - An existing [EntityType] instance to use as the destination.</param>
/// <returns>A copy of the object</returns>
        public virtual EntityType Copy(bool deep=false, Hashtable copiedObjects=null, bool asNew=false, bool reuseNestedObjects = false, EntityType copy = null)
        {
            if(copiedObjects == null)
            {
                copiedObjects = new Hashtable();
            }
            if (copy == null && copiedObjects.Contains(this))
                return (EntityType)copiedObjects[this];
            copy = copy ?? new EntityType();
            if (!asNew)
            {
                copy.TransientId = this.TransientId;
            }
            copy.IsProvider = this.IsProvider;
            copy.IsCluster = this.IsCluster;
            if (!copiedObjects.Contains(this))
            {
                copiedObjects.Add(this, copy);
            }
            base.Copy(deep, copiedObjects, asNew, reuseNestedObjects, copy);
            return copy;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as EntityType;
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
        public static bool operator ==(EntityType x, EntityType y)
        {
            // By default, == and Equals compares references. In order to
            // maintain these semantics with entities, we need to compare by
            // identity value. The Equals(x, y) override is used to guard
            // against null values; it then calls EntityEquals().
            return Equals(x, y);
        }

// Maintain inequality operator semantics for entities.
        public static bool operator !=(EntityType x, EntityType y)
        {
            return !(x == y);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        #endregion


    }
}
