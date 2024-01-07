import graphene
from core.schema import (
    Mutation as CoreMutation,
    Query as CoreQuery
)
from user.schema import (
    Query as UserQuery,
    Mutation as UserMutation
)


class Query(CoreQuery, UserQuery, graphene.ObjectType):
    # This class will inherit from multiple Queries
    pass


class Mutation(CoreMutation, UserMutation, graphene.ObjectType):
    # This class will inherit from multiple Queries
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
