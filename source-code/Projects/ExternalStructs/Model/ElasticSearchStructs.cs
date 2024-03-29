// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.IO;

using System.Text;
using System.Xml.Serialization;
using System.Linq;

namespace DigicircMatchmaking.ExternalStructs.ElasticSearch
{
    [XmlRoot("ActorDoc")]
    public class ActorDoc
    {
        [XmlElement("ID")]
        [Newtonsoft.Json.JsonProperty("ID")]
        public int? ID
        {
            get;
            set;
        }

        [XmlElement("Description")]
        [Newtonsoft.Json.JsonProperty("Description")]
        public string Description
        {
            get;
            set;
        }

        [XmlElement("Tags")]
        [Newtonsoft.Json.JsonProperty("Tags")]
        public string Tags
        {
            get;
            set;
        }

        [XmlElement("Name")]
        [Newtonsoft.Json.JsonProperty("Name")]
        public string Name
        {
            get;
            set;
        }

        [XmlElement("Country")]
        [Newtonsoft.Json.JsonProperty("Country")]
        public string Country
        {
            get;
            set;
        }

        [XmlElement("Sector")]
        [Newtonsoft.Json.JsonProperty("Sector")]
        public string Sector
        {
            get;
            set;
        }

        [XmlElement("Resources")]
        [Newtonsoft.Json.JsonProperty("Resources")]
        public System.Collections.Generic.List<string> Resources
        {
            get;
            set;
        }

        [XmlElement("RequestedResources")]
        [Newtonsoft.Json.JsonProperty("RequestedResources")]
        public System.Collections.Generic.List<string> RequestedResources
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           ID?.ToString() +
                                           Description?.ToString() +
                                           Tags?.ToString() +
                                           Name?.ToString() +
                                           Country?.ToString() +
                                           Sector?.ToString() +
                                           Resources?.ToList()?.Count().ToString() +
                                           RequestedResources?.ToList()?.Count().ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("SearchResponse")]
    public class SearchResponse
    {
        [XmlElement("took")]
        [Newtonsoft.Json.JsonProperty("took")]
        public int? Took
        {
            get;
            set;
        }

        [XmlElement("timed_out")]
        [Newtonsoft.Json.JsonProperty("timed_out")]
        public string TimedOut
        {
            get;
            set;
        }

        [XmlElement("_shards")]
        [Newtonsoft.Json.JsonProperty("_shards")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.Shards Shards
        {
            get;
            set;
        }

        [XmlElement("hits")]
        [Newtonsoft.Json.JsonProperty("hits")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.ResponseHits Hits
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Took?.ToString() +
                                           TimedOut?.ToString() +
                                           Shards?._CalculatedKey?.ToString() +
                                           Hits?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("Shards")]
    public class Shards
    {
        [XmlElement("total")]
        [Newtonsoft.Json.JsonProperty("total")]
        public string Total
        {
            get;
            set;
        }

        [XmlElement("successful")]
        [Newtonsoft.Json.JsonProperty("successful")]
        public string Successful
        {
            get;
            set;
        }

        [XmlElement("skipped")]
        [Newtonsoft.Json.JsonProperty("skipped")]
        public string Skipped
        {
            get;
            set;
        }

        [XmlElement("failed")]
        [Newtonsoft.Json.JsonProperty("failed")]
        public string Failed
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Total?.ToString() +
                                           Successful?.ToString() +
                                           Skipped?.ToString() +
                                           Failed?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("Hit")]
    public class Hit
    {
        [XmlElement("_index")]
        [Newtonsoft.Json.JsonProperty("_index")]
        public string Index
        {
            get;
            set;
        }

        [XmlElement("_type")]
        [Newtonsoft.Json.JsonProperty("_type")]
        public string Type
        {
            get;
            set;
        }

        [XmlElement("_id")]
        [Newtonsoft.Json.JsonProperty("_id")]
        public int? Id
        {
            get;
            set;
        }

        [XmlElement("_score")]
        [Newtonsoft.Json.JsonProperty("_score")]
        public decimal? Score
        {
            get;
            set;
        }

        [XmlElement("_source")]
        [Newtonsoft.Json.JsonProperty("_source")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.ActorDoc Source
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Index?.ToString() +
                                           Type?.ToString() +
                                           Id?.ToString() +
                                           Score?.ToString() +
                                           Source?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("ResponseHits")]
    public class ResponseHits
    {
        [XmlElement("max_score")]
        [Newtonsoft.Json.JsonProperty("max_score")]
        public decimal? MaxScore
        {
            get;
            set;
        }

        [XmlElement("hits")]
        [Newtonsoft.Json.JsonProperty("hits")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.Hit[] Hits
        {
            get;
            set;
        }

        [XmlElement("total")]
        [Newtonsoft.Json.JsonProperty("total")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.Total Total
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           MaxScore?.ToString() +
                                           Hits?.Sum(x => x?._CalculatedKey)?.ToString() +
                                           Total?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("Total")]
    public class Total
    {
        [XmlElement("value")]
        [Newtonsoft.Json.JsonProperty("value")]
        public int? Value
        {
            get;
            set;
        }

        [XmlElement("relation")]
        [Newtonsoft.Json.JsonProperty("relation")]
        public string Relation
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Value?.ToString() +
                                           Relation?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("SearchRequest")]
    public class SearchRequest
    {
        [XmlElement("query")]
        [Newtonsoft.Json.JsonProperty("query")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.Query Query
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Query?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("MultiMatch")]
    public class MultiMatch
    {
        [XmlElement("query")]
        [Newtonsoft.Json.JsonProperty("query")]
        public string Query
        {
            get;
            set;
        }

        [XmlElement("fields")]
        [Newtonsoft.Json.JsonProperty("fields")]
        public string[] Fields
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Query?.ToString() +
                                           Fields?.ToList()?.Count().ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("Query")]
    public class Query
    {
        [XmlElement("multi_match")]
        [Newtonsoft.Json.JsonProperty("multi_match")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.MultiMatch MutliMatch
        {
            get;
            set;
        }

        [XmlElement("bool")]
        [Newtonsoft.Json.JsonProperty("bool")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.BoolStatement Bool
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           MutliMatch?._CalculatedKey?.ToString() +
                                           Bool?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("bool")]
    [Newtonsoft.Json.JsonObject(Title = "bool")]
    public class BoolStatement
    {
        [XmlElement("must")]
        [Newtonsoft.Json.JsonProperty("must")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.Must[] Must
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           Must?.Sum(x => x?._CalculatedKey)?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }

    [XmlRoot("Must")]
    public class Must
    {
        [XmlElement("multi_match")]
        [Newtonsoft.Json.JsonProperty("multi_match")]
        public DigicircMatchmaking.ExternalStructs.ElasticSearch.MultiMatch MultiMatch
        {
            get;
            set;
        }

        [XmlElement("_CalculatedKey")]
        [Newtonsoft.Json.JsonProperty("_CalculatedKey")]
        public int? _CalculatedKey
        {
            get
            {
                try
                {
                    var allPropsConcated = "_CalculatedKey-" +
                                           MultiMatch?._CalculatedKey?.ToString();
                    return allPropsConcated.GetHashCode();
                }
                catch (Exception)
                {
                    return 0;
                }
            }
            set {}
        }

    }


}
