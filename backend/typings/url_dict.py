from typing import Optional
from pydantic import BaseModel, constr

class URLDict(BaseModel):
	url: constr(regex=r"[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)")
	custom_query: Optional[str]
