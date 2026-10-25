from datetime import date, timedelta

import strawberry
from pydantic import BaseModel
from strawberry.pydantic import PydanticValidationErrorHandler, ValidationError


@strawberry.pydantic.type
class Loan(BaseModel):
    isbn: str
    due: date


@strawberry.pydantic.type
class Receipt(BaseModel):
    member: str
    loans: list[Loan]


@strawberry.pydantic.input
class LoanInput(BaseModel):
    isbn: str
    weeks: int = 2


@strawberry.pydantic.input
class BorrowInput(BaseModel):
    member: str
    items: list[LoanInput]


@strawberry.type
class Query:
    @strawberry.field
    def open(self) -> bool:
        return True


@strawberry.type
class Mutation:
    @strawberry.mutation
    def borrow(self, input: BorrowInput) -> Receipt | ValidationError:
        return Receipt(
            member=input.member,
            loans=[
                Loan(isbn=item.isbn, due=date.today() + timedelta(weeks=item.weeks))
                for item in input.items
            ],
        )


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    exception_handlers=[PydanticValidationErrorHandler()],
)
