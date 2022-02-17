// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Data;
using NHibernate;
using NHibernate.Linq;

namespace DigicircMatchmaking.DAL.Queries
{

    public class DBqueries_ActorsByEntityTypeRepository : AbstractRepository<DBqueries_ActorsByEntityTypeItem>, IDBqueries_ActorsByEntityTypeRepository
    {
        #region Implementation of IDBqueries_ActorsByEntityTypeRepository

        public List<DBqueries_ActorsByEntityTypeItem> GetDBqueries_ActorsByEntityTypes(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate,
                int startRowIndex,
                int pageSize,
                Dictionary<Expression<Func<DBqueries_ActorsByEntityTypeItem, object>>, bool> orderBy,
                out int totalRecords)
        {
            return Get(predicate, startRowIndex, pageSize, orderBy, out totalRecords);
        }

        public List<DBqueries_ActorsByEntityTypeItem> GetDBqueries_ActorsByEntityTypes(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate,
                int startRowIndex,
                int pageSize,
                Dictionary<Expression<Func<DBqueries_ActorsByEntityTypeItem, object>>, bool> orderBy = null)
        {
            return Get(predicate, startRowIndex, pageSize, orderBy);
        }

        public IQueryable<DBqueries_ActorsByEntityTypeItem> GetDBqueries_ActorsByEntityTypes(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate)
        {
            return GetMainQuery<DBqueries_ActorsByEntityTypeItem>().Where(predicate); //Get(predicate);
        }

        public List<double> GetDBqueries_ActorsByEntityTypeAggregates(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate,
                Dictionary<Expression<Func<DBqueries_ActorsByEntityTypeItem, double>>, string> requestedAggregates)
        {
            var mainQuery = zAppDev.DotNet.Framework.Data.MiniSessionManager.Instance.Session.Query<DBqueries_ActorsByEntityTypeItem>();
            List<double> aggregateValues = new List<double>();
            if(predicate == null) predicate = a => true;
            foreach (var entry in requestedAggregates)
            {
                try
                {
                    switch (entry.Value)
                    {
                    case "SUM":
                        aggregateValues.Add(mainQuery.Where(predicate).Sum(entry.Key));
                        break;
                    case "AVERAGE":
                        aggregateValues.Add(mainQuery.Where(predicate).Average(entry.Key));
                        break;
                    case "COUNT":
                        aggregateValues.Add(mainQuery.Where(predicate).Count());
                        break;
                    }
                }
                catch
                {
                    aggregateValues.Add(0);
                }
            }
            return aggregateValues;
        }

        public IQueryable<T> GetMainQuery<T>()
        {
            return zAppDev.DotNet.Framework.Data.MiniSessionManager.Instance.Session.Query<T>();
        }

        #endregion
    }
}