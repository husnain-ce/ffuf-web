from typing import Optional
from pydantic import BaseModel

class WordListDict(BaseModel):
	path: str
	keyword: Optional[str]
