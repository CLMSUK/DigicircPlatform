
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
using zAppDev.DotNet.Framework.Utilities;
using zAppDev.DotNet.Framework.Configuration;
using zAppDev.DotNet.Framework.Data.Domain;
using NHibernate.Linq;

using DigicircMatchmaking.DAL;
using DigicircMatchmaking.DAL.Queries;
namespace DigicircMatchmaking.BO
{
    /// <summary>
    /// The ExElements extensions
    /// </summary>
    public static class ExElementsExtensions
    {
        public static System.Collections.Generic.List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> Transform(System.Collections.Generic.List<DigicircMatchmaking.BO.ExElements> exElements)
        {
            System.Collections.Generic.List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> elements = new System.Collections.Generic.List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements>();
            foreach (var exElement in exElements ?? Enumerable.Empty<DigicircMatchmaking.BO.ExElements>())
            {
                elements.Add((new DigicircMatchmaking.BO.GraphBackendDataTransformation.Transformer()).ExElements_To_ExElements(exElement));
            }
            return elements;
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> PrepareRelationNodes(DigicircMatchmaking.BO.GraphUpdateElement element)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements sourceElement = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements();
            sourceElement.Name = (element?.SourceNodeName ?? "");
            sourceElement.Type = (element?.SourceNodeType ?? "");
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements destinationElement = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements();
            destinationElement.Name = (element?.DestinationNodeName ?? "");
            destinationElement.Type = (element?.DestinationNodeType ?? "");
            return new List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> { sourceElement, destinationElement };
        }


        public static System.Collections.Generic.List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> PrepareRalationNodesTypeText(DigicircMatchmaking.BO.GraphUpdateElement element, bool textIsInSource)
        {
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements sourceElement = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements();
            sourceElement.Name = (element?.SourceNodeName ?? "");
            sourceElement.Type = (element?.SourceNodeType ?? "");
            if ((textIsInSource))
            {
                sourceElement.Category = "Text";
            }
            DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements destinationElement = new DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements();
            destinationElement.Name = (element?.DestinationNodeName ?? "");
            destinationElement.Type = (element?.DestinationNodeType ?? "");
            if ((((textIsInSource) == false)))
            {
                destinationElement.Category = "Text";
            }
            return new List<DigicircMatchmaking.ExternalStructs.GraphBackend.ExElements> { sourceElement, destinationElement };
        }




    }
}
