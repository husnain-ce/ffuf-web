from typing import Optional, Union, List, Literal
from pydantic import BaseModel, constr

class FilterOptions(BaseModel):
	filter_http_status_codes: Optional[str]
	filter_line_counts: Optional[str]
	filter_regexp: Optional[str]
	filter_response_sizes: Optional[str]
	filter_response_time: Optional[constr(regex=r"(<|>)\d{1,}")]
	filter_word_counts: Optional[str]
