// Copyright (c) CLMS UK. All rights reserved.
// Licensed under the Custom License. See LICENSE file in the project root for full license information.
// This was autogenerated by zAppDev.

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Data;

namespace DigicircMatchmaking.DAL.Queries
{
    public interface IDBqueries_ActorsByEntityTypeRepository
    {
        List<DBqueries_ActorsByEntityTypeItem> GetDBqueries_ActorsByEntityTypes(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate,
                int startRowIndex,
                int pageSize,
                Dictionary<Expression<Func<DBqueries_ActorsByEntityTypeItem, object>>, bool> orderBy,
                out int totalRecords);

        List<DBqueries_ActorsByEntityTypeItem> GetDBqueries_ActorsByEntityTypes(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate,
                int startRowIndex,
                int pageSize,
                Dictionary<Expression<Func<DBqueries_ActorsByEntityTypeItem, object>>, bool> orderBy = null);

        List<DBqueries_ActorsByEntityTypeItem> GetAll(Expression<Func<DBqueries_ActorsByEntityTypeItem, bool>> predicate = null);
    }
}