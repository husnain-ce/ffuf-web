from typing import Optional
from pydantic import BaseModel

class InputOptions(BaseModel):
	ignore_wordlist_comments: Optional[bool] = True
