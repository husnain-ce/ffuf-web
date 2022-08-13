from typing import Optional
from pydantic import BaseModel, constr

# Visit https://regexr.com/6rqve to test the regex

class URLDict(BaseModel):
	url: constr(regex=r"^(?:http?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$")
	custom_query: Optional[str]
