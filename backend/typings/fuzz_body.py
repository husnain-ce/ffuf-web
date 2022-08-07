from typing import List, Optional
from pydantic import BaseModel

from .url_dict import URLDict
from .word_list_dict import WordListDict
from .input_options import InputOptions
from .matcher_options import MatcherOptions
from .filter_options import FilterOptions

class FuzzBody(BaseModel):
	url_dict: URLDict
	word_lists: List[WordListDict] = []
	input_options: InputOptions = { "ignore_wordlist_comments": True }
	matcher_options: Optional[MatcherOptions]
	filter_options: Optional[FilterOptions]
	# output_file: str = "./outputs/outputs.json"
