from typing import Optional, Union, List, Literal
from pydantic import BaseModel, constr

class MatcherOptions(BaseModel):
	match_http_status_codes: Optional[Union[List[int], Literal["all"]]]
	match_line_count: Optional[int]
	match_regexp: Optional[str]
	match_response_size: Optional[int]
	match_response_time: Optional[constr(regex=r"(<|>)\d{1,}")]
	match_word_count: Optional[int]
