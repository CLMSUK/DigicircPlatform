// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Xml.Serialization;

namespace DigicircMatchmaking.DAL.Queries
{
    /// <summary>
    /// The DBqueries_ActorsByEntityType class
    /// </summary>
    [Serializable]
    public class DBqueries_ActorsByEntityTypeItem
    {
        #region DBqueries_ActorsByEntityType's Fields
        private string _value;
        private Int32? count;
        private Int32? ___UniqueId;
        #endregion
        #region DBqueries_ActorsByEntityType's Properties
        [XmlAttribute]
        public virtual string Value
        {
            get
            {
                return _value;
            }
            set
            {
                _value = value;
            }
        }
        [XmlAttribute]
        public virtual Int32? Count
        {
            get
            {
                return count;
            }
            set
            {
                count = value;
            }
        }
        [XmlAttribute]
        public virtual Int32? __UniqueId
        {
            get
            {
                return ___UniqueId;
            }
            set
            {
                ___UniqueId = value;
            }
        }
        #endregion
    }
}
